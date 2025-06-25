import { Router } from "express";
import { TodoModel } from "../models/todo.js";
import { createTodo, updateTodo } from '../validationSchemas/todos.js';

export const todoRouter = Router();

todoRouter.get('/', async (req, res) => {
    const todos = await TodoModel.getAll();
    return res.json({todos});
});

todoRouter.post('/', async (req, res) => {
    const validation = createTodo(req.body);

    if (validation.error) {
        return res.status(422).json({ error: validation.error.message });
    }

    const todo = await TodoModel.create({input: validation.data});

    return res.json(todo);
});

todoRouter.put('/:id', (req, res) => {
    const { id } = req.params;
    const validation = updateTodo(req.body);

    if (validation.error) {
        return res.status(422).json({ error: validation.error.message });
    }

    const todo = TodoModel.update({id, input: validation.data});
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    
    return res.json(todo);
});

todoRouter.post('/:id/complete', (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const todo = TodoModel.complete({id});
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    
    return res.json(todo);
});

todoRouter.delete('/clear-completed', (req, res) => {
    const todosCompleted = req.body;

    if (!Array.isArray(todosCompleted)) {
        return res.status(400).json({ message: 'Expected an array of completed todos' });
    }

    const todos = TodoModel.clearCompleted({input: todosCompleted});

    res.json({ todos });
});

todoRouter.delete('/:id', (req, res) => {
    const { id } = req.params;

    const todos = TodoModel.delete({id});

    if (!todos) return res.status(404).json({ message: 'Todo not found' });

    res.json({ todos });
});