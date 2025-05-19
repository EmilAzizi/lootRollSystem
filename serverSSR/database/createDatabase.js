import database from './connectionToDatabase.js';

const deleteMode = process.argv.includes("--delete");

if(deleteMode) {
    await database.run(`DROP TABLE IF EXISTS users`);
    await database.run(`DROP TABLE IF EXISTS runtime_enviroments`);
}

await database.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        isAdmin TEXT,
        rank TEXT,
        amountofLoot NUMBER
    );
`);

if(deleteMode) {
    await database.run('INSERT INTO users (username, password, isAdmin, rank, amountofLoot) VALUES ("adminTest", "1234", "true", "raider", "4")');
}

const users = await database.all('SELECT * FROM users');
console.log(users);