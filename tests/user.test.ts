import dotenv from 'dotenv';
dotenv.config();
import sequelize from '../src/database/pgsql';
import userService from '../src/app/user/userService';
import UserModel from '../src/app/user/userModel';

const old_email = 'teste1@user.com';
const new_email = 'teste2@user.com';


describe('User CRUD', () => {
    beforeAll(async () => {
        // sequelize.authenticate().then(() => {
        // }).catch(error => {
        //     console.log(`** Erro ao conectar com o Postgres! **`)
        //     console.log(`** ${error} **`)
        // });

        // await sequelize.sync({ alter: true });
    });

    it('Criar um user', async () => {

        const user = await userService.createUser(old_email, '123456');

        expect(user.email).toBe(old_email);
        expect(user).toBeInstanceOf(UserModel);
    });

    it('Listar users', async () => {

        const result = await userService.getAllUsers();

        expect(result.count).toBeGreaterThan(0);
        expect(result.rows).toBeInstanceOf(Array);
    });

    it('Encontrar um user pelo id', async () => {
        const list = await userService.getAllUsers();
        const id = (list.rows[0]).id;
        const result = await userService.getUserById(id);

        expect(result?.id).toBe(id);
        expect(result).toBeInstanceOf(UserModel);
    });

    it('Atualizar um user pelo id', async () => {
        const user = await userService.getUserByEmail(old_email);
        const id = user ? user.id : 0;
        const result = await userService.updateUser(id, new_email);

        expect(result?.id).toBe(id);
        expect(result?.email).toBe(new_email);
        expect(result).toBeInstanceOf(UserModel);
    });

    it('Deletar um user pelo id', async () => {
        const user = await userService.getUserByEmail(new_email);
        const id = user ? user.id : 0;

        await userService.deleteUser(id);

        const result = await userService.getUserById(id);

        expect(result).toBe(null);
    });

    afterAll(async () => {
        await sequelize.close();
    });

});