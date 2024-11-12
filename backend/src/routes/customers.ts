// src/routes/customers.ts
import { Router } from 'express';
import { addCustomer } from '../controllers/customerController';
import { body } from 'express-validator';

const router = Router();

router.post(
    '/',
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
        body('phone')
            .optional()
            .trim()
            .matches(/^\d+$/)
            .withMessage('Phone number must contain only digits'),
    ],
    addCustomer
);

export default router;