import { Router } from 'express';
import urlController from "./urlController";
import authMiddleware from '../../middleware/authMiddleware';

export default (router: Router) => {
    const SERVICE: string = '/url';

    router.post('/shorten', authMiddleware, urlController.shortenUrl);

    router.get('/:shortUrl', urlController.redirectUrl);

    router.get(`${SERVICE}/list`, authMiddleware, urlController.listByUserId);

    router.get(`${SERVICE}/:id`, authMiddleware, urlController.getById);

    router.put(`${SERVICE}/:id`, authMiddleware, urlController.edit);

    router.delete(`${SERVICE}/:id`, authMiddleware, urlController.deactivateUrl);

};