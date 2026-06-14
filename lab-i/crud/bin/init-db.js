const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'app.db');

async function initDatabase(callback) {
  try {
    const SQL = await initSqlJs();
    let db;

    // Check if database exists
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    // Read and execute SQL
    const sqlFile = path.join(__dirname, '..', 'sql', '01-song.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    try {
      db.run(sql);
    } catch (err) {
      // Table might already exist, ignore
      console.log('SQL execution note:', err.message);
    }

    // Save database
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
    db.close();

    console.log('Database initialized successfully');
    callback();
  } catch (err) {
    console.error('Error initializing database:', err);
    callback(err);
  }
}

module.exports = initDatabase;



