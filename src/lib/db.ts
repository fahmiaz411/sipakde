// lib/db.ts

import Database from "better-sqlite3";
import path from "path";

// Initialize the SQLite database connection
const db = new Database(
  path.resolve(process.cwd(), "database/database.sqlite")
);

export default db;
