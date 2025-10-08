import pkg from "pg";
const { Client } = pkg;

const client = new Client({
    connectionString: "postgresql://postgres:BryanWiller1010@db.ohawqyuegkjppdvpiaou.supabase.co:5432/postgres?schema=public",
});

async function test() {
    try {
        await client.connect();
        const res = await client.query("SELECT NOW()");
        console.log("Conexão ok:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Erro de conexão:", err.message);
    }
}

test();
