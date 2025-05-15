import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
export const dbPromise = open({
  filename: './survey.db',
  driver: sqlite3.Database
});

// Initialize database
export async function initializeDatabase() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
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
}

// Routes
app.post('/responses', async (req, res) => {
  try {
    const db = await dbPromise;
    const { 
      name, 
      age, 
      gender, 
      marital_status, 
      education_level, 
      annual_income, 
      savings, 
      health_rating, 
      chronic_conditions, 
      adl_assistance, 
      living_arrangement, 
      retirement_plan, 
      family_history 
    } = req.body;
    
    // Basic validation
    if (!name || !age) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await db.run(
      `INSERT INTO responses (
        name, 
        age, 
        gender, 
        marital_status, 
        education_level, 
        annual_income, 
        savings, 
        health_rating, 
        chronic_conditions, 
        adl_assistance, 
        living_arrangement, 
        retirement_plan, 
        family_history
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        age, 
        gender || null, 
        marital_status || null, 
        education_level || null, 
        annual_income || null, 
        savings || null, 
        health_rating || null, 
        chronic_conditions || null, 
        adl_assistance || null, 
        living_arrangement || null, 
        retirement_plan || null, 
        family_history || null
      ]
    );

    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/responses', async (req, res) => {
  try {
    const db = await dbPromise;
    const responses = await db.all('SELECT * FROM responses ORDER BY created_at DESC');
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Only start the server if this file is run directly, not when imported for testing
if (require.main === module) {
  // Initialize database and start server
  initializeDatabase().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
} 