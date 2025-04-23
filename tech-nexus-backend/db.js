import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    password: process.env.DB_PASSWORD, // pgsql user password
    host: "localhost",
    port: 5432,
    database: "technexus" // database name
});

export default pool;