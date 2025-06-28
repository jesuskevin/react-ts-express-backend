import app from "./app.js";
import { database } from "./database/database.js";

const start = async () => {
    const PORT = process.env.PORT ?? 8000;
    try {
        await database.sync();
        app.listen(PORT);
        console.log(`Connection has been established successfully. Server on port ${PORT}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

start();