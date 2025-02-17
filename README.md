# Bulk Data Importer

This project provides a simple script to import bulk data from CSV files into a PostgreSQL database.

## Features

- Reads data from a CSV file
- Sanitizes input data to prevent SQL errors
- Inserts records into a PostgreSQL database
- Logs success and failure messages

## Prerequisites

Before running this script, ensure that you have:

- [Node.js](https://nodejs.org/) installed
- A running PostgreSQL database
- The CSV files on the challenge

## Installation

1. Clone this repository:

```sh
git clone https://github.com/lombeira/massive-importer.git
cd massive-importer
```

2. Install dependencies:
```sh
npm install
```

## Configuration

The script connects to a PostgreSQL database with the following credentials:

- User: admin
- Password: admin
- Host: localhost
- Port: 5432
- Database: sf_transportation

Modify these credentials in the script if necessary.

## Error Handling
The script logs any import errors and continues processing. Errors may occur due to:

 - Duplicate IDs
 - Invalid CSV format
 - Database connection issues

 
## Usage

```sh
 npm run import:drivers 
 npm run import:vehicles 
 npm run import:ownerships
```

## Queries
1. First exercise
```sql
  SELECT v.*
  FROM vehicles v
  JOIN ownerships o ON v.id = o.vehicle_id
  WHERE o.driver_id = 5
```

2. Second exercise
```sql
  SELECT d.id AS driver_id, d.first_name, d.last_name, v.make, v.model, v.year
  FROM drivers d
  LEFT JOIN ownerships o ON d.id = o.driver_id
  LEFT JOIN vehicles v ON o.vehicle_id = v.id;
```

3. Third exercise
```sql
  SELECT DISTINCT d.id, d.first_name, d.last_name
  FROM drivers d
  JOIN ownerships o ON d.id = o.driver_id
  JOIN vehicles v ON o.vehicle_id = v.id
  WHERE v.make IN ('Toyota', 'Honda')
```

4. Fourth exercise
```sql
  SELECT d.id, d.first_name, d.last_name
  FROM drivers d
  WHERE EXISTS (
    SELECT 1
    FROM ownerships o
    JOIN vehicles v ON o.vehicle_id = v.id
    WHERE d.id = o.driver_id AND v.make = 'Toyota' 
  )
  AND EXISTS (
    SELECT 1
    FROM ownerships o
    JOIN vehicles v ON o.vehicle_id = v.id
    WHERE d.id = o.driver_id AND v.make = 'Honda' 
  );
```

5. Fifth exercise
```sql
EXPLAIN ANALYZE
SELECT * from vehicles WHERE make = 'Toyota' AND model = 'Camry'

CREATE INDEX idx_make_model ON vehicles ("make", "model")
```


6. Sixth exercise
```sql

CREATE TABLE "makes" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) UNIQUE
) 


----

CREATE TABLE "models" (
  "id" SERIAL PRIMARY KEY,
  "make_id" INT REFERENCES makes(id),
  "name" VARCHAR(100),
  UNIQUE (make_id, name)
) 

----


  INSERT INTO makes (name)
  SELECT DISTINCT make FROM vehicles

----

  INSERT INTO models (make_id, name)
  SELECT DISTINCT m.id, v.model
  FROM vehicles v
  JOIN makes m on v.make = m.name

----

  UPDATE vehicles v 
  SET model_id = (
      SELECT mo.id
      FROM models mo
      JOIN makes ma ON mo.make_id = ma.id
      WHERE v.make = ma.name AND v.model = mo.name
  );
```


