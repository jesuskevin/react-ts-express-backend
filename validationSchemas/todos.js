import * as z from 'zod/v4';

const createTodoSchema = z.object({
    title: z.string().min(3),
    completed: z.boolean()
});

const updateTodoSchema = z.object({
    title: z.string().min(3)
});

function createTodo(object) {
    return createTodoSchema.safeParse(object);
}

function updateTodo(object) {
    return updateTodoSchema.safeParse(object);
}

export {
    createTodo,
    updateTodo
};