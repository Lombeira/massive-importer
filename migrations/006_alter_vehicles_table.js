export async function up(client) {
  await client.query(`
      ALTER TABLE vehicles
      ADD COLUMN model_id INT;
  `);
}

export async function down(client) {
  await client.query(`DROP TABLE IF EXISTS vehicles CASCADE;`);
}