import { Router } from 'express';
import authController from './authController';

export default (router: Router) => {

    const SERVICE: string = '/src/auth';

    router.post(`${SERVICE}/login`, authController.login);
}