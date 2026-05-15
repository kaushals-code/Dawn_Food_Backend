import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DB_PASSWORD);

const db = new Client({
    host: "localhost",
    user: "postgres",
    password: process.env.DB_PASSWORD,
    database: "Dawn_Food",
    port: 5432,
});

export default db;