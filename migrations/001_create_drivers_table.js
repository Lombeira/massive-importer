export async function up(client) {
  await client.query(`
      CREATE TABLE "drivers" (
          "id" SERIAL PRIMARY KEY,
          "first_name" VARCHAR(255) NOT NULL,
          "last_name" VARCHAR(255) NOT NULL
      );
  `);
}

export async function down(client) {
  await client.query(`DROP TABLE IF EXISTS drivers;`);
}