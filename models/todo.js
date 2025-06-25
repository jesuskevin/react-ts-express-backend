import { randomUUID } from 'node:crypto';
import todos from '../todos.json' with {type: "json"};

export class TodoModel {
    static getAll = async () => {
        return todos;
    }

    static create = async ({ input }) => {
        const todo = {
            id: randomUUID(),
            ...input,
        };

        todos.push(todo);

        return todo;
    }

    static update = async ({ id, input }) => {
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if(todoIndex === -1) return false;

        todos[todoIndex] = {
            ...todos[todoIndex],
            ...input
        }

        return todos[todoIndex];
    }

    static delete = async ({ id }) => {
        const index = todos.findIndex(todo => todo.id === id);
        if (index === -1) return false;

        todos.splice(index, 1);

        return todos;
    }

    static complete = async ({ id }) => {
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if(todoIndex === -1) return false;

        todos[todoIndex] = {
            ...todos[todoIndex],
            completed: todos[todoIndex].completed ? false : true
        }

        return todos[todoIndex];
    }

    static clearCompleted = async ({ input }) => {
        const idsToRemove = input.map(todo => todo.id);
        const filtered = todos.filter(todo => !idsToRemove.includes(todo.id));
        todos.splice(0, todos.length, ...filtered);

        return todos;
    }
}