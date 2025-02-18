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
  const stream = fs.createReadStream('vehicles.csv'); // Ensure the file path is correct
  const csvParser = parse({ delimiter: ',', trim: true, fromLine: 2 });

  const linesParsed = stream.pipe(csvParser);

  for await (const line of linesParsed) {
    const [id, make, model, year, licensePlate] = line;

    try {
      // 1️⃣ Insert Make (if not exists)
      const makeResult = await client.query(`
        INSERT INTO makes (name) 
        VALUES ($1) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING id;
      `, [make]);

      // Get the make_id (if not returned, retrieve manually)
      let makeId = makeResult.rows.length ? makeResult.rows[0].id : null;
      if (!makeId) {
        const fetchMake = await client.query(`SELECT id FROM makes WHERE name = $1`, [make]);
        makeId = fetchMake.rows[0]?.id;
      }

      // 2️⃣ Insert Model (linked to make)
      const modelResult = await client.query(`
        INSERT INTO models (make_id, name)
        VALUES ($1, $2)
        ON CONFLICT (make_id, name) DO NOTHING
        RETURNING id;
      `, [makeId, model]);

      // Get the model_id (if not returned, retrieve manually)
      let modelId = modelResult.rows.length ? modelResult.rows[0].id : null;
      if (!modelId) {
        const fetchModel = await client.query(`SELECT id FROM models WHERE make_id = $1 AND name = $2`, [makeId, model]);
        modelId = fetchModel.rows[0]?.id;
      }

      // 3️⃣ Insert Vehicle (using model_id)
      await client.query(`
        INSERT INTO vehicles (id, model_id, year, license_plate)
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT (id) DO NOTHING;
      `, [id, modelId, year, licensePlate]);

      console.log(`✅ Imported: ${id} - ${year} - ${licensePlate} - ${modelId} `);
    } catch (error) {
      console.error(`❌ Error importing vehicle ${id}:`, error.message);
    }
  }

  await client.end();
  console.log('✅ Import completed');
}

importVehicles().catch(error => {
  console.log(`❌ Error on import: ${error}`);
  client.end();
});