import path from "path";
import db from "./db";
import fs from "fs";

export function execMigrations() {
  db.exec("PRAGMA cache_size = 1");
  // users
  db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
            password VARCHAR(200) NOT NULL
        );
    `);

  db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            date TEXT NOT NULL, -- Stores as a string in 'YYYY-MM-DD HH:MM:SS' format
            pdf TEXT DEFAULT '',
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);

  db.exec(`
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            status TEXT NOT NULL CHECK (status IN ('pending', 'onview', 'approved', 'rejected')),
            name TEXT NOT NULL,
            description TEXT DEFAULT '',
            type TEXT NOT NULL,
            project_id INTEGER NOT NULL,
            date TEXT NOT NULL, -- Stores as a string in 'YYYY-MM-DD HH:MM:SS' format
            sender_id INTEGER NOT NULL, -- Renamed 'from' to 'sender_id'
            pdf TEXT DEFAULT '',
            FOREIGN KEY (project_id) REFERENCES projects(id),
            FOREIGN KEY (sender_id) REFERENCES users(id)
        );
    `);

  db.exec(`CREATE INDEX IF NOT EXISTS idx_status ON documents(status);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_type ON documents(type);`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sender_id ON documents(sender_id);`);
  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_project_id ON documents(project_id);`
  );

  db.exec(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER NOT NULL,
            comment TEXT NOT NULL,
            sender_id INTEGER NOT NULL,
            sender_name TEXT NOT NULL,
            date TEXT NOT NULL, -- Stores as a string in 'YYYY-MM-DD HH:MM:SS' format
            FOREIGN KEY (document_id) REFERENCES documents(id)
        );
    `);

  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_document_id ON comments(document_id);`
  );
}
