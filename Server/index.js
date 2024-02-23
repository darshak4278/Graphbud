const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const PORT = 4000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors())
// SQLite database setup
const db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create a table if it doesn't exist
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT)');
  }
});

// Insert data into SQLite
app.post('/insertData', (req, res) => {
    const jsonData = req.body;
  
    jsonData.forEach(({ id, name, location }) => {
      db.run('INSERT INTO users (id, name, location) VALUES (?, ?, ?)', [id, name, location], (err) => {
        if (err) {
          console.error('Error inserting data:', err.message);
        }
      });
    });
  
    res.json({ message: 'Data inserted successfully' });
  });
  
  // Retrieve all users from SQLite
  app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      res.json(rows);
    });
  });
  
// Create a new user
app.post('/users', (req, res) => {
  const { name, location } = req.body;
  console.log(req.body)
  db.run('INSERT INTO users (name, location) VALUES (?, ?)', [name, location], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      id: this.lastID,
      name: name,
      location: location
    });
  });
});

// Get all users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// Get a specific user by ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(row);
  });
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, location } = req.body;

  db.run('UPDATE users SET name = ?, location = ? WHERE id = ?', [name, location, userId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      id: userId,
      name: name,
      location: location
    });
  });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'User deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
