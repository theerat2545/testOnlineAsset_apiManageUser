const express = require('express')
const app = express()

const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const mysql2 = require('mysql2');
const cors = require('cors');

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT
const conn = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// check connect database
conn.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connect database success');
});

// port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

// ADD USER
app.post('/users/add', async (req, res) => {
    const { email, firstname, lastname, age, gender, phone, profilePicture } = req.body;

    // Validate input
    if (!email || !firstname || !lastname || !age || !gender || !phone || !profilePicture) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // SQL query to insert user
        const query = `INSERT INTO users (email, firstname, lastname, age, gender, phone, profilePicture) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        conn.query(query, [email, firstname, lastname, age, gender, phone, profilePicture], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ error: 'Failed to add user.' });
            }
            res.status(201).json({ message: 'User added successfully.', userId: result.insertId });
        });
    } catch (error) {
        console.error('Error in /users/add:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

// UPDATE USER
app.put('/users/update/:id', (req, res) => {
    const { id } = req.params;
    const { email, firstname, lastname, age, gender, phone, profilePicture } = req.body;

    // Validate input
    if (!email || !firstname || !lastname || !age || !gender || !phone || !profilePicture) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const query = `UPDATE users SET email = ?, firstname = ?, lastname = ?, age = ?, gender = ?, phone = ?, profilePicture = ? WHERE id = ?`;
        conn.query(query, [email, firstname, lastname, age, gender, phone, profilePicture, id], (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ error: 'Failed to update user.' });
            }
            res.status(200).json({ message: 'User updated successfully.' });
        });
    } catch (error) {
        console.error('Error in /users/update:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

// DELETE USER
app.delete('/users/delete/:id', (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM users WHERE id = ?`;
        conn.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).json({ error: 'Failed to delete user.' });
            }
            res.status(200).json({ message: 'User deleted successfully.' });
        });
    } catch (error) {
        console.error('Error in /users/delete:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

// SELECT ALL
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    conn.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Failed to fetch users.' });
        }
        res.status(200).json(results);
    });
});

// SELECT BY ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';
    conn.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(results[0]);
    });
});




