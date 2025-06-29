import express from 'express';
import { todoRouter } from './routes/todos.js';
import { corsMiddleware } from './middlewares/cors.js';
import { authRouter } from './routes/auth.js';
import 'dotenv/config.js';
import { sessionMiddleware } from './middlewares/session.js';
import passport from 'passport';
const app = express();

app.use(corsMiddleware());
app.use(express.json());
app.use(sessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);
app.use('/api/todo', todoRouter);

export default app;