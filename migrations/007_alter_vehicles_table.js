export async function up(client) {
  await client.query(`
      ALTER TABLE vehicles
      DROP COLUMN make,
      DROP COLUMN model;
  `);
}

export async function down(client) {
  await client.query(`DROP TABLE IF EXISTS vehicles CASCADE;`);
}