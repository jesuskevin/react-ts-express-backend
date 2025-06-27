DROP DATABASE IF EXISTS todosdb;
CREATE DATABASE todosdb;

USE todosdb;

CREATE TABLE todos (
	id BINARY(16) PRIMARY KEY DEFAULT(UUID_TO_BIN(UUID())),
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN
);

INSERT INTO todos (id, title, completed) VALUES
((UUID_TO_BIN(UUID())), 'Clean the house', false),
((UUID_TO_BIN(UUID())), 'Do the groceries', true),
((UUID_TO_BIN(UUID())), 'Walk the dog', false);