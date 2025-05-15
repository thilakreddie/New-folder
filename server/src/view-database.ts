import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function viewDatabase() {
  try {
    console.log('Opening database...');
    const db = await open({
      filename: './survey.db',
      driver: sqlite3.Database
    });

    console.log('\n--- Database Schema ---');
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    
    for (const table of tables) {
      console.log(`\nTable: ${table.name}`);
      const columns = await db.all(`PRAGMA table_info(${table.name})`);
      console.log('Columns:');
      columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`);
      });
    }

    console.log('\n--- Database Contents ---');
    for (const table of tables) {
      console.log(`\nRecords in table ${table.name}:`);
      const records = await db.all(`SELECT * FROM ${table.name}`);
      
      if (records.length === 0) {
        console.log('  No records found');
      } else {
        records.forEach((record, index) => {
          console.log(`\nRecord #${index + 1}:`);
          for (const [key, value] of Object.entries(record)) {
            console.log(`  ${key}: ${value}`);
          }
        });
      }
    }

    console.log('\nDatabase inspection complete.');
  } catch (error) {
    console.error('Error accessing database:', error);
  }
}

viewDatabase(); 