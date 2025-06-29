import MySQLStoreFactory from 'express-mysql-session';
import session from 'express-session';

export const sessionMiddleware = () => {
    const MySQLStore = MySQLStoreFactory(session);

    const sessionStore = new MySQLStore(
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,

            clearExpired: true,
            checkExpirationInterval: 15 * 60 * 1000,
            expiration: 1 * 60 * 60 * 1000,
            schema: {
                tableName: 'sessions',
                columnNames: {
                    session_id: 'session_id',
                    expires: 'expires',
                    data: 'data'
                }
            }
        }
    );

    return session({
        secret: process.env.APP_SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1 * 60 * 60 * 1000 }
    })
}