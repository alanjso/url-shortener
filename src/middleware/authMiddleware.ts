import { Request, Response, NextFunction } from 'express';
import jwt from 'jws';
import UserModel from '../app/user/userModel';

interface AuthRequest extends Request {
    user?: UserModel | null;
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    let token = req.headers.authorization?.split(' ')[1];
    if (req.path == '/shorten') {
        if (token) {
            const verifiedToken = jwt.verify(token, 'HS256', JWT_SECRET);
            if (verifiedToken) {
                const decoded = jwt.decode(token);
                const id = decoded ? JSON.parse(decoded.payload).id : null;
                const user = await UserModel.findByPk(id);
                if (!user) return res.status(401).json({ error: 'User not found' });

                req.user = user;
            }
        } else if (!token) {
            req.user = null;
        }

    } else {
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const verifiedToken = jwt.verify(token, 'HS256', JWT_SECRET);

        if (verifiedToken) {
            const decoded = await jwt.decode(token);
            const id = decoded ? JSON.parse(decoded.payload).id : null;
            const user = await UserModel.findByPk(id);
            if (!user) return res.status(401).json({ error: 'User not found' });

            req.user = user;
        }
    }


    next();

    // try {
    // } catch (error) {
    //     res.status(401).json({ error: 'Invalid token' });
    // }
};

export default authMiddleware;
