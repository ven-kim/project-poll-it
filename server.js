const express = require('express');
const mysql = require('mysql2');
const db = require('./db/connection');

const PORT = process.env.PORT || 3010;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send({message: 'Hello World!'});
});

// Not Found response for unmatched routes
app.use((req, res) => {
    res.status(404).end();
  });

  // Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });