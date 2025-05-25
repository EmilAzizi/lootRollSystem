import connection from "./connectionToDatabase.js";

const deleteMode = process.argv.includes("--delete");

if (deleteMode) {
    await connection.execute(`DROP TABLE IF EXISTS users`);
    console.log("Dropped users table.");
}

// Create table
await connection.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    userPassword VARCHAR(255),
    isAdmin VARCHAR(10),
    userrank VARCHAR(100),
    amountofLoot INT)`);

console.log("Users table created.");

// Seed data
if (deleteMode) {
    await connection.execute(
        `INSERT INTO users (username, userpassword, isAdmin, userrank, amountofLoot) VALUES (?, ?, ?, ?, ?)`,
        ["adminTest", "1234", "true", "raider", 4]
    );
    await connection.execute(
        `INSERT INTO users (username, userpassword, isAdmin, userrank, amountofLoot) VALUES (?, ?, ?, ?, ?)`,
        ["normalUser", "1234", "false", "trial", 0]
    );
    console.log("Seeded initial users.");
}

// Fetch and log users
const [users] = await connection.execute(`SELECT * FROM users`);
console.log(users);
