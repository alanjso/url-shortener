import dotenv from 'dotenv';
dotenv.config();
import sequelize from '../src/database/pgsql';
import urlService from '../src/app/url/urlService';
import UrlModel from '../src/app/url/urlModel';

const old_url = 'https://www.google.com.br/';
const new_url = 'https://www.google.com/';
const userId = -1;
let idToDelete: number;
let shortUrl: string | undefined;

describe('URL CRUD', () => {
    beforeAll(async () => {
        // sequelize.authenticate().then(() => {
        // }).catch(error => {
        //     console.log(`** Erro ao conectar com o Postgres! **`)
        //     console.log(`** ${error} **`)
        // });
        // await sequelize.sync({ alter: true });
    });

    it('Encurtar uma URL', async () => {

        const url = await urlService.createShortUrl(old_url, userId);

        idToDelete = url.id;
        shortUrl = url.shortUrl;

        expect(url).toBeInstanceOf(UrlModel);
        expect(url.originalUrl).toBe(old_url);
    });

    it('Listar URLs pelo User', async () => {

        const result = await urlService.listByUserId(userId);

        expect(result.count).toBeGreaterThan(0);
        expect(result.rows).toBeInstanceOf(Array);
    });

    it('Recuperar URL original', async () => {

        const result = await urlService.getOriginalUrl(shortUrl ? shortUrl : '');

        expect(result).toBe(old_url);
    });

    it('Update URL', async () => {

        const result = await urlService.updateOriginalUrl(idToDelete, new_url);

        expect(result?.originalUrl).toBe(new_url);
    });

    it('Soft Delet URL', async () => {

        const result = await urlService.deactivateUrl(idToDelete);

        expect(result).toBe(true);
    });

    afterAll(async () => {
        // await sequelize.close();
    });

});