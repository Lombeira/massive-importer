# **Bulk Data Importer**  

This project provides a simple script to import bulk data from CSV files into a PostgreSQL database.  

## **Features**  
- Reads data from CSV files  
- Sanitizes input data to prevent SQL errors  
- Inserts records into a PostgreSQL database  
- Logs success and failure messages  
- Supports automatic database migrations  

---

## **Prerequisites**  

Before running this script, ensure that you have:  
- [Node.js](https://nodejs.org/) installed  
- A running PostgreSQL database  
- The CSV files from the challenge  

---

## **Installation**  

1. Clone this repository:  

```sh
git clone https://github.com/lombeira/massive-importer.git
cd massive-importer
```  

2. Install dependencies:  

```sh
npm install
```  

---

## **Configuration**  

The script connects to a PostgreSQL database with the following credentials:  

- **User:** admin  
- **Password:** admin  
- **Host:** localhost  
- **Port:** 5432  
- **Database:** sf_transportation  

Modify these credentials in the script if necessary.  

---

## **Error Handling**  

The script logs any import errors and continues processing. Errors may occur due to:  
- Duplicate IDs  
- Invalid CSV format  
- Database connection issues  

---

## **Usage**  

### **1️⃣ Run Database Migrations**  
Before importing data, apply all necessary database migrations:  

```sh
npm run migrations:up
```  

If you need to **rollback** all migrations:  

```sh
npm run migrations:down
```  

---

### **2️⃣ Import Data**  
Once the database is set up, you can import the CSV files:  

```sh
npm run import:drivers 
npm run import:vehicles 
npm run import:ownerships
```  

Or run **all commands sequentially** in one step:  

```sh
npm run setup:all
```  

This command will:  
1. Run migrations  
2. Import `drivers`  
3. Import `vehicles`  
4. Import `ownerships`  

---

## **Notes**  
- If you need to **reset the database**, first rollback the migrations and then apply them again:  

```sh
npm run migrations:down && npm run migrations:up
```  

- The import process **skips duplicate records** and logs any issues for review.  



