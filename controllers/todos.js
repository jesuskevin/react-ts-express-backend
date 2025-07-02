import { Op } from "sequelize";
import { TodoModel } from "../models/todo.js";
import { UserModel } from "../models/user.js";
import { createTodo, updateTodo } from '../validationSchemas/todos.js';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export class TodoController {
    static getAll = async (req, res) => {
        const todos = await (await this.getAuthUser(req)).getTodos();
        return res.json({ todos });
    }

    static create = async (req, res) => {
        const validation = createTodo(req.body);

        if (validation.error) {
            return res.status(422).json({ error: validation.error.message });
        }

        const todo = await (await this.getAuthUser(req)).createTodo({ ...validation.data });

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
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: 'Expected an array of completed todos' });
        }

        const todosCompleted = req.body.map((todo) => todo.id);

        await TodoModel.destroy({
            where: { id: { [Op.in]: todosCompleted } }
        });

        const todos = await (await this.getAuthUser(req)).getTodos();

        res.json({ todos });
    }

    static summarize = async (req, res) => {
        try {
            const rows = await (await this.getAuthUser(req)).getTodos({raw: true});
            const groupedTodos = rows.reduce((filteredTodos, todo) => {
                const key = todo.completed ? 'completed' : 'active' ?? 'unknown';
                (filteredTodos[key] ||= []).push(todo);
                return filteredTodos;
            }, {});

            const userInput = JSON.stringify(groupedTodos, null, 2);
            const response = await openai.responses.create({
                model: 'gpt-4o-mini',
                instructions: `You are an upbeat assistant that summarises a user's todos.`,
                input: `Here is the user's todo list grouped by active or completed status:\n\n${userInput}\n\nWrite a friendly summary for him.`,
            });

            res.json({ summary: response.output_text });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to generate summary' });
        }
    }

    static getAuthUser = async (req) => {
        return await UserModel.findByPk(req.user.id);
    }
}