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


