import { Router } from "express";
import { TodoController } from "../controllers/todos.js";

export const todoRouter = Router();

todoRouter.use((req, res, next) => {
    if (!req.user) return res.status(401).json({message: "Unauthorized"});

    return next();
});

todoRouter.get('/', TodoController.getAll);

todoRouter.post('/', TodoController.create);

todoRouter.put('/:id', TodoController.update);

todoRouter.post('/:id/complete', TodoController.complete);

todoRouter.delete('/clear-completed', TodoController.clearCompleted);

todoRouter.delete('/:id', TodoController.delete);