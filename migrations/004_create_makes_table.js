export async function up(client) {
  await client.query(`
      CREATE TABLE "makes" (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE
      );
  `);
}

export async function down(client) {
  await client.query(`DROP TABLE IF EXISTS makes;`);
}