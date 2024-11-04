import jwt from 'jws';
import userService from '../user/userService';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

class AuthService {
    async login(email: string, password: string): Promise<{ token: string | undefined, checkPassword: boolean }> {

        let token = undefined;
        let checkPassword = false;

        const user = await userService.getUserByEmail(email);

        if (user && (await user.checkPassword(password))) {
            token = jwt.sign({
                header: { alg: 'HS256' },
                payload: { id: user.id, email: user.email },
                secret: JWT_SECRET
            });
            checkPassword = true;
        }

        return { token, checkPassword };
    }
}

export default new AuthService();