import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db: any;

export async function openDb() {
  if (!db) {
    db = await open({
      filename: "./users.sqlite",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
      )
    `);
  }
  return db;
}

export async function getUser(username: string) {
  const db = await openDb();
  return db.get("SELECT * FROM users WHERE username = ?", [username]);
}

export async function createUser(username: string, password: string) {
  const db = await openDb();
  return db.run("INSERT INTO users (username, password) VALUES (?, ?)", [
    username,
    password,
  ]);
}
