import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as readline from 'readline';

// Database connection
async function connectToDb() {
  return open({
    filename: './survey.db',
    driver: sqlite3.Database
  });
}

// View all records with formatted output
async function viewAllRecords() {
  const db = await connectToDb();
  console.log('\n--- ALL SURVEY RESPONSES ---');
  
  try {
    const responses = await db.all('SELECT * FROM responses ORDER BY created_at DESC');
    
    if (responses.length === 0) {
      console.log('No survey responses found in the database.');
      return;
    }
    
    // Print table headers
    console.log('\nTotal records found:', responses.length);
    console.log('-----------------------------------------------------');
    
    // Print each record in a formatted way
    responses.forEach((record, index) => {
      console.log(`\n[RECORD #${index + 1}]`);
      console.log('-----------------------------------------------------');
      console.log(`ID: ${record.id}`);
      console.log(`Name: ${record.name}`);
      console.log(`Age: ${record.age}`);
      console.log(`Gender: ${record.gender || 'Not specified'}`);
      console.log(`Marital Status: ${record.marital_status || 'Not specified'}`);
      console.log(`Education: ${record.education_level || 'Not specified'}`);
      console.log(`Income: $${record.annual_income || 'Not specified'}`);
      console.log(`Savings: $${record.savings || 'Not specified'}`);
      console.log(`Health: ${record.health_rating || 'Not specified'}`);
      console.log(`Chronic Conditions: ${record.chronic_conditions || 'Not specified'}`);
      console.log(`Daily Assistance: ${record.adl_assistance || 'Not specified'}`);
      console.log(`Living Arrangement: ${record.living_arrangement || 'Not specified'}`);
      console.log(`Retirement Plan: ${record.retirement_plan || 'Not specified'}`);
      console.log(`Family History: ${record.family_history || 'Not specified'}`);
      console.log(`Created: ${record.created_at}`);
      console.log('-----------------------------------------------------');
    });
  } catch (error) {
    console.error('Error viewing records:', error);
  }
}

// View database schema
async function viewSchema() {
  const db = await connectToDb();
  console.log('\n--- DATABASE SCHEMA ---');
  
  try {
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    
    for (const table of tables) {
      console.log(`\nTable: ${table.name}`);
      const columns = await db.all(`PRAGMA table_info(${table.name})`);
      console.log('Columns:');
      columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`);
      });
    }
  } catch (error) {
    console.error('Error viewing schema:', error);
  }
}

// Add a sample record
async function addSampleRecord() {
  const db = await connectToDb();
  console.log('\n--- ADDING SAMPLE RECORD ---');
  
  try {
    const result = await db.run(
      `INSERT INTO responses (
        name, age, gender, marital_status, education_level, 
        annual_income, savings, health_rating, chronic_conditions, 
        adl_assistance, living_arrangement, retirement_plan, family_history
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'John Doe', 65, 'Male', 'Married', 'Bachelor\'s degree',
        '85000', '450000', 'Good', '1 condition',
        'Minimal assistance', 'Live with spouse/partner', '401(k)', 'Parents needed care'
      ]
    );
    
    console.log(`Sample record added with ID: ${result.lastID}`);
  } catch (error) {
    console.error('Error adding sample record:', error);
  }
}

// Delete a record by ID
async function deleteRecord(id: number) {
  const db = await connectToDb();
  console.log(`\n--- DELETING RECORD ID: ${id} ---`);
  
  try {
    const result = await db.run('DELETE FROM responses WHERE id = ?', id);
    
    if (result && result.changes && result.changes > 0) {
      console.log(`Record with ID ${id} deleted successfully.`);
    } else {
      console.log(`No record found with ID ${id}.`);
    }
  } catch (error) {
    console.error('Error deleting record:', error);
  }
}

// Run statistics on the data
async function runStatistics() {
  const db = await connectToDb();
  console.log('\n--- DATABASE STATISTICS ---');
  
  try {
    const totalCount = await db.get('SELECT COUNT(*) as count FROM responses');
    console.log(`Total responses: ${totalCount.count}`);
    
    // Age statistics
    const ageStats = await db.get('SELECT AVG(age) as avg, MIN(age) as min, MAX(age) as max FROM responses');
    console.log(`Age statistics: Avg: ${ageStats.avg?.toFixed(1) || 'N/A'}, Min: ${ageStats.min || 'N/A'}, Max: ${ageStats.max || 'N/A'}`);
    
    // Gender distribution
    const genderDist = await db.all('SELECT gender, COUNT(*) as count FROM responses GROUP BY gender');
    console.log('Gender distribution:');
    genderDist.forEach(g => console.log(`  - ${g.gender || 'Not specified'}: ${g.count}`));
    
    // Health rating distribution
    const healthDist = await db.all('SELECT health_rating, COUNT(*) as count FROM responses GROUP BY health_rating');
    console.log('Health rating distribution:');
    healthDist.forEach(h => console.log(`  - ${h.health_rating || 'Not specified'}: ${h.count}`));
  } catch (error) {
    console.error('Error running statistics:', error);
  }
}

// Main menu interface
async function showMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n=== LONG-TERM CARE NEEDS ASSESSMENT DATABASE TOOL ===');
  console.log('1. View all records');
  console.log('2. View database schema');
  console.log('3. Add sample record');
  console.log('4. Delete record by ID');
  console.log('5. Run statistics');
  console.log('6. Exit');
  
  rl.question('\nEnter your choice (1-6): ', async (answer) => {
    switch (answer.trim()) {
      case '1':
        await viewAllRecords();
        break;
      case '2':
        await viewSchema();
        break;
      case '3':
        await addSampleRecord();
        break;
      case '4':
        rl.question('Enter record ID to delete: ', async (id) => {
          await deleteRecord(parseInt(id));
          rl.close();
          showMenu();
        });
        return;
      case '5':
        await runStatistics();
        break;
      case '6':
        console.log('Exiting database tool.');
        rl.close();
        return;
      default:
        console.log('Invalid choice. Please try again.');
    }
    
    rl.close();
    showMenu();
  });
}

// Start the tool
showMenu().catch(error => {
  console.error('Error running database tool:', error);
}); 