import { Sequelize } from 'sequelize';

const db = process.env.DATABASE || 'url-shortener';
const dbUsername = process.env.DB_USERNAME || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(db, dbUsername, dbPassword, {
    host: dbHost,
    dialect: 'postgres',
    logging: false,
    port: 5432
});

sequelize.sync({ alter: true }).then(() => {
    console.log("Sync true");
}).catch(error => {
    console.log("Sync error:");
    console.log(error);
});

export default sequelize;