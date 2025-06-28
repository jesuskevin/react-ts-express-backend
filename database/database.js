import { Sequelize } from "sequelize";

export const database = new Sequelize('todosdb', 'root', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});