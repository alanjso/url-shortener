import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/database/pgsql';
import userService from '../src/app/user/userService';
import UserModel from '../src/app/user/userModel';
import authService from '../src/app/auth/authService';
import jwt from 'jws';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const email = 'teste1@user.com';
const password = '123456'
let userToLogin: UserModel;

describe('User CRUD', () => {
    beforeAll(async () => {
        sequelize.authenticate().then(() => {
        }).catch(error => {
            console.log(`** Erro ao conectar com o Postgres! **`)
            console.log(`** ${error} **`)
        });
        await sequelize.sync({ alter: true });
        userToLogin = await userService.createUser(email, password);
    });

    it('Realizar Login e receber uma token JWT', async () => {

        const result = await authService.login(email, password);

        const token = result.token || ''
        const verify = jwt.verify(token, 'HS256', JWT_SECRET);

        const decoded = jwt.decode(token);

        const emailDecoded = decoded ? JSON.parse(decoded.payload).email : null;

        expect(emailDecoded).toBe(email);
        expect(verify).toBe(true);
        expect(result.checkPassword).toBe(true);
    });

    afterAll(async () => {
        await userService.deleteUser(userToLogin.id);
        // await sequelize.close();
    });

});