import { Router } from 'express';
import urlRouter from './app/url/urlRouter';
import userRouter from './app/user/userRouter';
import authRouter from './app/auth/authRouter';

const routes: Router = Router();

routes.get('/health', (req, res) => {
    res.status(200).json({ urlShortener: 'Application /v1 Up' });
});

urlRouter(routes);
userRouter(routes);
authRouter(routes);

export default routes;