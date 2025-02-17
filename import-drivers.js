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

const csvPath = new URL('./drivers.csv', import.meta.url);

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

async function importDrivers() {
  const linesParsed = stream.pipe(csvParse);

  for await (const line of linesParsed) {
    let [id, firstName, lastName] = line;

    //sanitize data
    firstName = firstName.replace(/'/g, "''");
    lastName = lastName.replace(/'/g, "''");

    try {
      await client.query(`
        INSERT INTO drivers (id, first_name, last_name)
        VALUES ($1, $2, $3)
      `, [id, firstName, lastName]);

      console.log(`✅ Successfully imported driver ${id} - ${firstName} ${lastName}`);
    } catch (error) {
      console.log(`❌ Error importing driver ${id}: ${error.message}`);
    }

  }

  await client.end();
  console.log('✅ Import completed');
}

importDrivers().catch(error => {
  console.log(`❌ Error on import: ${error}`);
  client.end();
});