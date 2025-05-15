import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function resetDatabase() {
  const db = await open({
    filename: './survey.db',
    driver: sqlite3.Database
  });

  console.log('Dropping existing responses table...');
  await db.exec('DROP TABLE IF EXISTS responses');

  console.log('Creating new responses table with updated schema...');
  await db.exec(`
    CREATE TABLE responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT,
      marital_status TEXT,
      education_level TEXT,
      annual_income TEXT,
      savings TEXT,
      health_rating TEXT,
      chronic_conditions TEXT,
      adl_assistance TEXT,
      living_arrangement TEXT,
      retirement_plan TEXT,
      family_history TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database reset successfully!');
  process.exit(0);
}

resetDatabase().catch(error => {
  console.error('Error resetting database:', error);
  process.exit(1);
}); 