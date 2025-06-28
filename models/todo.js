import { DataTypes, Model } from "sequelize";
import { database } from "../database/database.js";

const dbConnectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'todosdb',
};

export class TodoModel extends Model {}

TodoModel.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }   
}, { sequelize: database, modelName: 'Todo' });