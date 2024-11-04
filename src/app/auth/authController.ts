// src/controllers/authController.ts
import { Request, Response } from 'express';
import authService from './authService';

export default {
    login: async (req: Request, res: Response): Promise<any> => {
        const { email, password } = req.body;
        try {
            const { token, checkPassword } = await authService.login(email, password);

            if (checkPassword) {
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

        } catch (error) {
            return res.status(500).json({ error: 'Authentication failed' });
        }
    }
}
