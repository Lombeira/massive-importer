export async function up(client) {
  await client.query(`
      CREATE TABLE "ownerships" (
          "driver_id" INT NOT NULL,
          "vehicle_id" INT NOT NULL,
          "notes" TEXT,
          CONSTRAINT "ownerships_pkey" PRIMARY KEY ("driver_id", "vehicle_id"),
          CONSTRAINT "ownerships_driver_fk" FOREIGN KEY ("driver_id") 
              REFERENCES "drivers" ("id") 
              ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "ownerships_vehicle_fk" FOREIGN KEY ("vehicle_id") 
              REFERENCES "vehicles" ("id") 
              ON DELETE CASCADE ON UPDATE CASCADE
      );
  `);
}

export async function down(client) {
  await client.query(`DROP TABLE IF EXISTS ownerships;`);
}