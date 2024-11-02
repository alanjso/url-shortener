// src/services/userService.ts
import UserModel from './userModel';
import bcrypt from 'bcrypt';

class UserService {
    async createUser(email: string, password: string): Promise<UserModel> {
        const user = await UserModel.create({ email, password });
        return user;
    }

    async getUserById(id: number): Promise<UserModel | null> {
        return await UserModel.findByPk(id);
    }

    async getAllUsers(): Promise<{ rows: UserModel[]; count: number; }> {
        return await UserModel.findAndCountAll();
    }

    async updateUser(id: number, email?: string, password?: string): Promise<UserModel | null> {
        const user = await UserModel.findByPk(id);
        if (user) {
            if (email) user.email = email;
            if (password) user.password = await bcrypt.hash(password, 10);
            await user.save();
        }
        return user;
    }

    async deleteUser(id: number): Promise<void> {
        const user = await UserModel.findByPk(id);
        if (user) {
            await user.destroy();
        }
    }
}

export default new UserService();
