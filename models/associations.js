import { DataTypes } from "sequelize";
import { TodoModel } from "./todo.js";
import { UserModel } from "./user.js";

const todoUserFK = {
    name: 'user_id',
    type: DataTypes.UUID
}

UserModel.hasMany(TodoModel, {foreignKey: todoUserFK});
TodoModel.belongsTo(UserModel, {foreignKey: todoUserFK});