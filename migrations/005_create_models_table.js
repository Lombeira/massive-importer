export async function up(client) {
  await client.query(`
      CREATE TABLE "models" (
          id SERIAL PRIMARY KEY,
          make_id INT REFERENCES makes(id),
          name VARCHAR(255),
          UNIQUE (make_id, name)
      );
  `);
}

export async function down(client) {
  await client.query(`DROP TABLE IF EXISTS models;`);
}