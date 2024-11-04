import { Request, Response } from 'express';
import urlService from './urlService';
import UserModel from '../user/userModel';

const HOST = process.env.HOST || 'http://localhost'
const API_VERSION = process.env.API_VERSION || 'v1'
const PORT = process.env.PORT || '4000'

interface AuthRequest extends Request {
    user?: UserModel | null;
}

export default {
    shortenUrl: async (req: AuthRequest, res: Response): Promise<any> => {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(401).json({ error: 'originalUrl is a required value' });
        }

        const userId = req.user ? req.user.id : undefined;
        try {
            const urlModel = await urlService.createShortUrl(originalUrl, userId);
            return res.json({ shortUrl: `${HOST}:${PORT}/${API_VERSION}/${urlModel.shortUrl}` });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to shorten URL' });
        }
    },

    redirectUrl: async (req: Request, res: Response): Promise<any> => {
        const { shortUrl } = req.params;
        try {
            const originalUrl = await urlService.getOriginalUrl(shortUrl);
            if (originalUrl) {
                return res.redirect(originalUrl);
            } else {
                return res.status(404).json({ error: 'URL not found' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Failed to retrieve URL' });
        }
    },

    listByUserId: async (req: AuthRequest, res: Response): Promise<any> => {
        const userId = req.user?.id;
        try {

            if (!userId) {
                return res.status(401).json({ error: 'invalid user' });
            }
            const urls = await urlService.listByUserId(userId);
            return res.status(200).json({ message: "sucess", urls });
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    getById: async (req: AuthRequest, res: Response): Promise<any> => {
        const userId = req.user?.id;
        const id = req.params.id as unknown as number;
        try {

            if (!userId) {
                return res.status(401).json({ error: 'invalid user' });
            }

            if (!id) {
                return res.status(401).json({ error: 'invalid id' });
            }

            const url = await urlService.getById(id);

            if (!url?.isActive) {
                return res.status(401).json({ error: 'invalid url' });
            }

            if (userId !== url.userId) {
                return res.status(401).json({ error: 'url from another owner' });
            }

            return res.status(200).json({ message: "sucess", url });
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    edit: async (req: AuthRequest, res: Response): Promise<any> => {
        const userId = req.user?.id;
        const id = req.params.id as unknown as number;
        const newOriginalUrl = req.body.originalUrl;
        try {

            if (!userId) {
                return res.status(401).json({ error: 'invalid user' });
            }

            if (!id) {
                return res.status(401).json({ error: 'invalid id' });
            }

            const found = await urlService.getById(id);

            if (!found?.isActive) {
                return res.status(401).json({ error: 'invalid url' });
            }

            if (userId !== found.userId) {
                return res.status(401).json({ error: 'url from another owner' });
            }

            if (!newOriginalUrl) {
                return res.status(401).json({ error: 'invalid body' });
            }

            const url = await urlService.updateOriginalUrl(id, newOriginalUrl);

            return res.status(200).json({ message: "sucess", url });
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    deactivateUrl: async (req: AuthRequest, res: Response): Promise<any> => {
        const userId = req.user?.id;
        const id = req.params.id as unknown as number;
        try {

            if (!userId) {
                return res.status(401).json({ error: 'invalid user' });
            }

            if (!id) {
                return res.status(401).json({ error: 'invalid id' });
            }

            const found = await urlService.getById(id);

            if (!found?.isActive) {
                return res.status(401).json({ error: 'invalid url' });
            }

            if (userId !== found?.userId) {
                return res.status(401).json({ error: 'url from another owner' });
            }

            const success = await urlService.deactivateUrl(id);

            if (success) return res.status(200).json({ message: "deleted" });
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}

