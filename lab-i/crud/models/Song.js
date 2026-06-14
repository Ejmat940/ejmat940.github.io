const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'app.db');

let SQL = null;
let dbInstance = null;

async function initDB() {
  if (!SQL) {
    SQL = await initSqlJs();
  }

  if (!dbInstance) {
    try {
      if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        dbInstance = new SQL.Database(buffer);
      } else {
        dbInstance = new SQL.Database();
        // Initialize schema
        const sqlFile = path.join(__dirname, '..', 'sql', '01-song.sql');
        const sql = fs.readFileSync(sqlFile, 'utf-8');
        dbInstance.run(sql);
        saveDB();
      }
    } catch (err) {
      console.error('Database init error:', err);
      dbInstance = new SQL.Database();
      const sqlFile = path.join(__dirname, '..', 'sql', '01-song.sql');
      const sql = fs.readFileSync(sqlFile, 'utf-8');
      dbInstance.run(sql);
      saveDB();
    }
  }

  return dbInstance;
}

function saveDB() {
  if (dbInstance) {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

class Song {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || null;
    this.artist = data.artist || null;
    this.year = data.year || null;
  }

  static async findAll(callback) {
    try {
      const db = await initDB();
      const result = db.exec('SELECT * FROM song');
      const songs = [];

      if (result.length > 0) {
        const rows = result[0].values;
        const columns = result[0].columns;
        rows.forEach(row => {
          const obj = {};
          columns.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          songs.push(new Song(obj));
        });
      }

      callback(null, songs);
    } catch (err) {
      callback(err, null);
    }
  }

  static async findById(id, callback) {
    try {
      const db = await initDB();
      const result = db.exec('SELECT * FROM song WHERE id = ?', [id]);

      if (result.length > 0 && result[0].values.length > 0) {
        const row = result[0].values[0];
        const columns = result[0].columns;
        const obj = {};
        columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        callback(null, new Song(obj));
      } else {
        callback(null, null);
      }
    } catch (err) {
      callback(err, null);
    }
  }

  async save(callback) {
    try {
      const db = await initDB();

      if (!this.id) {
        // Insert
        db.run(
          'INSERT INTO song (title, artist, year) VALUES (?, ?, ?)',
          [this.title, this.artist, this.year]
        );

        // Get last insert id
        const result = db.exec('SELECT last_insert_rowid() as id');
        if (result.length > 0 && result[0].values.length > 0) {
          this.id = result[0].values[0][0];
        }
      } else {
        // Update
        db.run(
          'UPDATE song SET title = ?, artist = ?, year = ? WHERE id = ?',
          [this.title, this.artist, this.year, this.id]
        );
      }

      saveDB();
      callback(null, this.id);
    } catch (err) {
      callback(err);
    }
  }

  async delete(callback) {
    try {
      const db = await initDB();
      db.run('DELETE FROM song WHERE id = ?', [this.id]);
      saveDB();
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = Song;




