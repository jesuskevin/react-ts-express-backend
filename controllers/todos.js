import { Op } from "sequelize";
import { TodoModel } from "../models/todo.js";
import { createTodo, updateTodo } from '../validationSchemas/todos.js';

export class TodoController {
    static getAll = async (req, res) => {
        const todos = await TodoModel.findAll();
        return res.json({ todos });
    }

    static create = async (req, res) => {
        const validation = createTodo(req.body);

        if (validation.error) {
            return res.status(422).json({ error: validation.error.message });
        }

        const todo = await TodoModel.create({ ...validation.data });

        return res.json(todo);
    }

    static update = async (req, res) => {
        const { id } = req.params;
        const validation = updateTodo(req.body);

        if (validation.error) {
            return res.status(422).json({ error: validation.error.message });
        }

        const todo = await TodoModel.update(
            { ...validation.data },
            {
                where: { id },
            }
        );
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        return res.json(todo);
    }

    static delete = async (req, res) => {
        const { id } = req.params;

        const todos = await TodoModel.destroy({ where: { id } });

        if (!todos) return res.status(404).json({ message: 'Todo not found' });

        res.json({ todos });
    }

    static complete = async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const todo = await TodoModel.findByPk(id);

        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        todo.completed = todo.completed ? false : true;
        todo.save();

        return res.json(todo);
    }

    static clearCompleted = async (req, res) => {
        const todosCompleted = req.body.map((todo) => todo.id);

        if (!Array.isArray(todosCompleted)) {
            return res.status(400).json({ message: 'Expected an array of completed todos' });
        }

        await TodoModel.destroy({
            where: { id: { [Op.in]: todosCompleted } }
        });

        const todos = TodoModel.findAll();

        res.json({ todos });
    }
}