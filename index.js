import express from 'express';
import { moviesRouter } from './routes/todos.js';
import { corsMiddleware } from './middlewares/cors.js';
const app = express();

app.use(corsMiddleware());
app.use(express.json());
app.use('/api/todo', moviesRouter);

const PORT = process.env.PORT ?? 8000;

app.listen(PORT);