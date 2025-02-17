 ------- exercise 1 -------
SELECT v.*
FROM vehicles v
JOIN ownerships o ON v.id = o.vehicle_id
WHERE o.driver_id = 5


 ------- exercise 2 -------
SELECT d.id AS driver_id, d.first_name, d.last_name, v.make, v.model, v.year
FROM drivers d
LEFT JOIN ownerships o ON d.id = o.driver_id
LEFT JOIN vehicles v ON o.vehicle_id = v.id;

  ------- exercise 3 -------

SELECT DISTINCT d.id, d.first_name, d.last_name
FROM drivers d
JOIN ownerships o ON d.id = o.driver_id
JOIN vehicles v ON o.vehicle_id = v.id
WHERE v.make IN ('Toyota', 'Honda')


  ------- exercise 4 -------

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
)


  ------- exercise 5 -------
EXPLAIN ANALYZE
SELECT * from vehicles WHERE make = 'Toyota' AND model = 'Camry'

CREATE INDEX idx_make_model ON vehicles ("make", "model")


  ------- exercise 6 -------

  CREATE TABLE "makes" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) UNIQUE
) 


-----

CREATE TABLE "models" (
  "id" SERIAL PRIMARY KEY,
  "make_id" INT REFERENCES makes(id),
  "name" VARCHAR(100),
  UNIQUE (make_id, name)
) 

-----


INSERT INTO makes (name)
SELECT DISTINCT make FROM vehicles

-----

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

-----

SELECT v.model_id, v.make, ma.name, v.model, mo.name
FROM vehicles v
JOIN models mo ON mo.id = v.model_id
JOIN makes ma ON mo.make_id = ma.id

---- 

ALTER TABLE vehicles
DROP COLUMN make,
DROP COLUMN model;

