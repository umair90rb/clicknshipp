const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not defined in the .env file');
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to the database successfully, executing query...');
    await client.query(
      `DELETE FROM "SequelizeData" WHERE name = '20231109085435-add-roles-permissions-super-user.js';`
    );
    console.log('Query executed successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await client.end();
  }
}

connectToDatabase();
