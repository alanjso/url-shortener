// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jws';
import UserModel from '../user/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export default {
    login: async (req: Request, res: Response): Promise<any> => {
        const { email, password } = req.body;
        try {
            const user = await UserModel.findOne({ where: { email } });
            if (user && (await user.checkPassword(password))) {
                const token = jwt.sign({
                    header: { alg: 'HS256' },
                    payload: { id: user.id, email: user.email },
                    secret: JWT_SECRET
                });
                return res.json({ token });
            } else {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Authentication failed' });
        }
    }
}
