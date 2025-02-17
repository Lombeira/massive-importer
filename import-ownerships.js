import pg from 'pg';
import fs from 'node:fs';
import { parse } from 'csv-parse';

const { Client } = pg;

const client = new Client({
  user: 'admin',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  database: 'sf_transportation'
});

await client.connect();

const csvPath = new URL('./ownerships.csv', import.meta.url);

if (!fs.existsSync(csvPath)) {
  console.error('File not found');
  process.exit(1);
}

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

async function importOwnerships() {
  const linesParsed = stream.pipe(csvParse);

  for await (const line of linesParsed) {
    let [driverId, vehicleId, notes] = line;

    try {
      await client.query(`
        INSERT INTO ownerships (driver_id, vehicle_id, notes)
        VALUES ($1, $2, $3) ON CONFLICT (driver_id, vehicle_id) DO NOTHING
      `, [driverId, vehicleId, notes]);

      console.log(`✅ Successfully imported driver ${driverId} - ${vehicleId} - ${notes}`);
    } catch (error) {
      console.log(`❌ Error importing driver ${driverId} - ${vehicleId}: ${error}`);
    }
  }

  await client.end();
  console.log('✅ Import completed');
}

importOwnerships().catch(error => {
  console.log(`❌ Error on import: ${error}`);
  client.end();
});