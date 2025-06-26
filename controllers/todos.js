import { TodoModel } from "../models/todo.js";
import { createTodo, updateTodo } from '../validationSchemas/todos.js';

export class TodoController {
    static getAll = async (req, res) => {
        const todos = await TodoModel.getAll();
        return res.json({ todos });
    }

    static create = async (req, res) => {
        const validation = createTodo(req.body);

        if (validation.error) {
            return res.status(422).json({ error: validation.error.message });
        }

        const todo = await TodoModel.create({ input: validation.data });

        return res.json(todo);
    }

    static update = async (req, res) => {
        const { id } = req.params;
        const validation = updateTodo(req.body);

        if (validation.error) {
            return res.status(422).json({ error: validation.error.message });
        }

        const todo = await TodoModel.update({ id, input: validation.data });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        return res.json(todo);
    }

    static delete = async (req, res) => {
        const { id } = req.params;

        const todos = await TodoModel.delete({ id });

        if (!todos) return res.status(404).json({ message: 'Todo not found' });

        res.json({ todos });
    }

    static complete = async (req, res) => {
        const { id } = req.params;
        const data = req.body;

        const todo = await TodoModel.complete({ id });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        return res.json(todo);
    }

    static clearCompleted = async (req, res) => {
        const todosCompleted = req.body;

        if (!Array.isArray(todosCompleted)) {
            return res.status(400).json({ message: 'Expected an array of completed todos' });
        }

        const todos = await TodoModel.clearCompleted({ input: todosCompleted });

        res.json({ todos });
    }
}