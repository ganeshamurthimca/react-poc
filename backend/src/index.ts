// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { sequelize } from './config/database';
import customerRoutes from './routes/customers';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/customers', customerRoutes);

// Start the server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync();
        console.log('Models synchronized successfully.');

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();