import { Router } from "express";
import { randomUUID } from 'node:crypto';
import todos from '../todos.json' with {type: "json"};
import { createTodo, updateTodo } from '../validationSchemas/todos.js';

export const moviesRouter = Router();

moviesRouter.get('/', (req, res) => {
    return res.json({todos});
});

moviesRouter.post('/', (req, res) => {
    const validation = createTodo(req.body);

    if (validation.error) {
        return res.status(422).json({ error: validation.error.message });
    }

    const todo = {
        id: randomUUID(),
        ...validation.data,
    };

    todos.push(todo);
    return res.json(todo);
});

moviesRouter.put('/:id', (req, res) => {
    const { id } = req.params;
    const validation = updateTodo(req.body);

    if (validation.error) {
        return res.status(422).json({ error: validation.error.message });
    }

    const todo = todos.find(todo => todo.id === id);
    
    todo.title = validation.data.title;
    
    return res.json(todo);
});

moviesRouter.post('/:id/complete', (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const todo = todos.find(todo => todo.id === id);
    
    todo.completed ? todo.completed = false : todo.completed = true;
    
    return res.json(todo);
});

moviesRouter.delete('/clear-completed', (req, res) => {
    const todosCompleted = req.body;

    if (!Array.isArray(todosCompleted)) {
        return res.status(400).json({ message: 'Expected an array of completed todos' });
    }

    const idsToRemove = todosCompleted.map(todo => todo.id);

    const filtered = todos.filter(todo => !idsToRemove.includes(todo.id));

    todos.splice(0, todos.length, ...filtered);

    res.json({ todos });
});

moviesRouter.delete('/:id', (req, res) => {
    const { id } = req.params;

    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    todos.splice(index, 1);

    res.json({ todos });
});