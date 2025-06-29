import app from "./app.js";
import { database } from "./database/database.js";
import 'dotenv/config.js';

const start = async () => {
    const PORT = process.env.APP_PORT ?? 8000;
    try {
        database.sync({force: false}).then(() => {
            app.listen(PORT);
            console.log(`Connection has been established successfully. Server on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

start();