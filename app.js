import express from 'express';
import { todoRouter } from './routes/todos.js';
import { corsMiddleware } from './middlewares/cors.js';
const app = express();

app.use(corsMiddleware());
app.use(express.json());
app.use('/api/todo', todoRouter);

export default app;