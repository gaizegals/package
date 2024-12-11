const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Use 'mysql2' for MySQL

const app = express();
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
    host: 'containers-yourdb-id.up.railway.app',
    port: 5432, // Use 3306 for MySQL
    user: 'postgres',
    password: 'your-password',
    database: 'railway',
});

// Endpoint to handle webhook
app.post('/submit-form', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO form_submissions (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );
        res.status(200).send({ success: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'Database insertion failed' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
