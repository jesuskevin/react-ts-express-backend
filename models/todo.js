import mysql from 'mysql2/promise';

const dbConnectionConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'todosdb',
};

const connection = await mysql.createConnection(dbConnectionConfig);

export class TodoModel {
    static getAll = async () => {
        const [todos] = await connection.query('SELECT BIN_TO_UUID(id) id, title, completed FROM todos;');
        return todos;
    }

    static create = async ({ input }) => {
        const [newUuid] = await connection.query('SELECT UUID() uuid;');
        const [{uuid}] = newUuid;

        const result = await connection.query(`
            INSERT INTO todos (id, title, completed) VALUES
            (UUID_TO_BIN(?), ?, ?);
        `, [uuid, input.title, input.completed]);

        const [todos] = await connection.query('SELECT BIN_TO_UUID(id) id, title, completed FROM todos WHERE id = UUID_TO_BIN(?);',
            [uuid]
        )

        return todos[0];
    }

    static update = async ({ id, input }) => {
        let [todos] = await connection.query('SELECT BIN_TO_UUID(id) id, title, completed FROM todos WHERE id = UUID_TO_BIN(?);',
            [id]
        )

        if (!todos.length) return false;

        const todo = await connection.query(`
            UPDATE todos SET
            title = ?,
            completed = ?
            WHERE id = UUID_TO_BIN(?);
        `, [input.title, input.completed ?? todos[0].completed, todos[0].id]);

        [todos] = await connection.query('SELECT BIN_TO_UUID(id) id, title, completed FROM todos WHERE id = UUID_TO_BIN(?);',
            [id]
        )

        return todos[0];
    }

    static delete = async ({ id }) => {
        let [todos] = await connection.query('SELECT BIN_TO_UUID(id) id, title, completed FROM todos WHERE id = UUID_TO_BIN(?);',
            [id]
        )

        if (!todos.length) return false;

        const todo = await connection.query(`
            DELETE FROM todos
            WHERE id = UUID_TO_BIN(?);
        `, [todos[0].id]);

        [todos] = await connection.query('SELECT BIN_TO_UUID(id) id, title, completed FROM todos;',
            [id]
        )

        return todos[0];
    }

    static complete = async ({ id }) => {
        let [todos] = await connection.query('SELECT BIN_TO_UUID(id) id, title, completed FROM todos WHERE id = UUID_TO_BIN(?);',
            [id]
        )

        if (!todos.length) return false;

        const todo = await connection.query(`
            UPDATE todos SET
            completed = ?
            WHERE id = UUID_TO_BIN(?);
        `, [todos[0].completed ? false : true, todos[0].id]);

        [todos] = await connection.query('SELECT BIN_TO_UUID(id) id, title, completed FROM todos WHERE id = UUID_TO_BIN(?);',
            [id]
        )

        return todos[0];
    }

    static clearCompleted = async ({ input }) => {
        const idsToRemove = input.map(todo => todo.id);

        if (!idsToRemove.length) return [];

        const placeholders = idsToRemove.map(() => 'UUID_TO_BIN(?)').join(', ');
        
        const result = await connection.query(`
            DELETE FROM todos
            WHERE id IN (${placeholders});
        `, idsToRemove);

        const [todos] = await connection.query('SELECT BIN_TO_UUID(id) id, title, completed FROM todos;');

        return todos[0];
    }
}