import UrlModel from './urlModel';

class UrlService {
    async createShortUrl(originalUrl: string, userId?: number | undefined): Promise<UrlModel> {
        const urlModel = await UrlModel.create({ originalUrl, userId: userId ? userId : undefined });
        return urlModel;
    }

    async getOriginalUrl(shortUrl: string): Promise<string | null> {
        const urlRecord = await UrlModel.findOne({ where: { shortUrl } });
        if (urlRecord && urlRecord.isActive) {
            urlRecord.accessCount += 1;
            await urlRecord.save();
            return urlRecord.originalUrl;
        }
        return null;
    }

    async listByUserId(userId: number): Promise<{ rows: UrlModel[]; count: number; }> {
        const urls = await UrlModel.findAndCountAll({ where: { userId } });
        return urls;
    }

    async getById(id: number): Promise<UrlModel | null> {
        const url = await UrlModel.findByPk(id);
        return url;
    }

    async updateOriginalUrl(id: number, originalUrl: string): Promise<UrlModel | null> {
        const url = await UrlModel.findByPk(id);
        if (url) {
            if (originalUrl) url.originalUrl = originalUrl;
            await url.save();
        }
        return url;
    }

    async deactivateUrl(id: number): Promise<boolean> {
        const urlRecord = await UrlModel.findByPk(id)
        if (urlRecord) {
            urlRecord.isActive = false;
            await urlRecord.save();
            await urlRecord.destroy()
            return true;
        }
        return false;
    }
}

export default new UrlService();
