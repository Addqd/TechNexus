import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    password: "eternal deliberation",
    host: "localhost",
    port: 5432,
    database: "technexus"
});

export default pool;