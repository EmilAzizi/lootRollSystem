import connection from "./connectionToDatabase.js";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';

dotenv.config({path: './serverSSR/.env'});

const hashedPassword = await bcrypt.hash("1234", 10);
const deleteMode = process.argv.includes("--delete");

if (deleteMode) {
    await connection.execute(`DROP TABLE IF EXISTS users`);
}

await connection.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    userPassword VARCHAR(255),
    isAdmin VARCHAR(10),
    userrank VARCHAR(100),
    amountofLoot INT)`);

if (deleteMode) {
    await connection.execute(
        `INSERT INTO users (username, userpassword, isAdmin, userrank, amountofLoot) VALUES (?, ?, ?, ?, ?)`,
        ["Nymfalla", hashedPassword, "true", "raider", 4]
    );
    await connection.execute(
        `INSERT INTO users (username, userpassword, isAdmin, userrank, amountofLoot) VALUES (?, ?, ?, ?, ?)`,
        ["Tswigg", hashedPassword, "false", "trial", 0]
    );
}
