require('dotenv').config(); // Add this line to load .env variables

const express = require('express');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 5000;

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port:1433,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

// Function to get data from SQL Server
async function getData() {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT * FROM users`;
        return result.recordset;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
}

// API endpoint to get user data
app.get('/api/users', async (req, res) => {
    try {
        const data = await getData();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user data', details: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
