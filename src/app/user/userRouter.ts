import { Router } from 'express';
import userController from './userController';
import authMiddleware from '../../middleware/authMiddleware';

export default (router: Router) => {

    const SERVICE: string = '/src/user';

    router.get(`${SERVICE}`, userController.getAllUsers);

    router.get(`${SERVICE}/:id`, userController.getById);

    router.post(`${SERVICE}`, userController.createUser);

    router.put(`${SERVICE}/:id`, authMiddleware, userController.updateUser);

    router.delete(`${SERVICE}/:id`, userController.deleteUser);
}
