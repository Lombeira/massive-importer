export async function up(client) {
  await client.query(`
        CREATE TABLE "vehicles" (
          "id" SERIAL PRIMARY KEY,
          "license_plate" VARCHAR(20) NOT NULL UNIQUE,
          "make" VARCHAR(100) NOT NULL,
          "model" VARCHAR(100) NOT NULL,
          "year" INT NOT NULL CHECK ("year" >= 1886)
      );
  `);
}

export async function down(client) {
  await client.query(`DROP TABLE IF EXISTS vehicles;`);
}