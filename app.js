require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const app = express();

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false, // Use true if you're on Azure
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    connectionTimeout: 15000, // 15 seconds
    requestTimeout: 15000 // 15 seconds
};

// Connect to the database
sql.connect(dbConfig).then(pool => {
    if (pool.connecting) {
        console.log('Connecting to the database...');
    }
    if (pool.connected) {
        console.log('Connected to the database.');
    }

    // Define a route to get users
    app.get('/users', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM users');
            res.json(result.recordset);
        } catch (err) {
            console.error('SQL error', err);
            res.status(500).json({ error: 'Failed to fetch user data', details: err.message });
        }
    });

    // Start the Express server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}).catch(err => {
    console.error('Database connection error', err);
});
