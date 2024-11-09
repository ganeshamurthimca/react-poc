const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');

// Initialize the app
const app = express();
const port = process.env.PORT || 3500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection pool
const pool = new Pool({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432, // Default PostgreSQL port
});

// Endpoint to handle customer data with validation
app.post(
    '/api/customers',
    [
        body('firstName')
            .trim()
            .notEmpty()
            .withMessage('First Name is required'),
        body('lastName')
            .trim()
            .notEmpty()
            .withMessage('Last Name is required'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email'),
        // Optionally validate phone number
        body('phone')
            .optional()
            .trim()
            .matches(/^\d+$/)
            .withMessage('Phone number must contain only digits'),
    ],
    async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, phone } = req.body;

        try {
            const client = await pool.connect();
            const result = await client.query(
                'INSERT INTO customers (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
                [firstName, lastName, email, phone]
            );
            client.release();

            res.status(201).json({
                status: 'success',
                data: result.rows[0],
                message: 'Customer added successfully',
            });
        } catch (err) {
            console.error(err);

            // Handle duplicate email error (unique constraint violation)
            if (err.code === '23505' && err.constraint === 'customers_email_key') {
                res.status(400).json({
                    status: 'error',
                    message: 'Email already exists',
                });
            } else {
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to add customer',
                });
            }
        }
    }
);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});