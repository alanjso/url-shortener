import { Request, Response } from 'express';
import userService from './userService';
import { error } from 'console';

export default {
    createUser: async (req: Request, res: Response): Promise<any> => {
        const { email, password, confirm_password } = req.body;
        try {
            if (!email || !password || !(password == confirm_password)) {
                return res.status(401).json({ error: 'Invalid body' });
            }
            const user = await userService.createUser(email, password);
            return res.status(201).json({ user });
        } catch (error) {
            return res.status(400).json({ error: 'User registration failed' });
        }
    },

    getById: async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        try {
            const user = await userService.getUserById(Number(id));
            if (user) {
                return res.json({ user });
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch user' });
        }
    },

    getAllUsers: async (req: Request, res: Response): Promise<any> => {
        try {
            const users = await userService.getAllUsers();
            return res.json({ users });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
    },

    updateUser: async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        const { email, password } = req.body;
        try {
            const updatedUser = await userService.updateUser(Number(id), email, password);
            if (updatedUser) {
                return res.json({ user: updatedUser });
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            return res.status(400).json({ error: 'Failed to update user' });
        }
    },

    deleteUser: async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        try {
            await userService.deleteUser(Number(id));
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete user' });
        }
    },
}
