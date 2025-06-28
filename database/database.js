import { Sequelize } from "sequelize";
import 'dotenv/config.js';

const dbDatabase = process.env.DB_DATABASE;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbDialect = process.env.SEQUELIZE_DIALECT;


export const database = new Sequelize(dbDatabase, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDialect
});