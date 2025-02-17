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

const csvPath = new URL('./vehicles.csv', import.meta.url);

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

async function importVehicles() {
  const linesParsed = stream.pipe(csvParse);

  for await (const line of linesParsed) {
    let [id, make, model, year, licensePlate] = line;

    try {
      await client.query(`
        INSERT INTO vehicles (id, make, model, year, license_plate)
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING
      `, [id, make, model, year, licensePlate]);

      console.log(`✅ Successfully imported driver ${id} - ${make} - ${model} - ${year} - ${licensePlate}`);
    } catch (error) {
      console.log(`❌ Error importing driver ${id}: ${error}`);
    }

  }

  await client.end();
  console.log('✅ Import completed');
}

importVehicles().catch(error => {
  console.log(`❌ Error on import: ${error}`);
  client.end();
});