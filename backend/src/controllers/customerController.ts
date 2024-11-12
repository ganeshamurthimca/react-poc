import { Request, Response, NextFunction } from 'express';
import { Customer } from '../models/Customer';
import { validationResult } from 'express-validator';

export const addCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { firstName, lastName, email, phone } = req.body;

    try {
        const newCustomer = await Customer.create({ firstName, lastName, email, phone });

        res.status(201).json({
            status: 'success',
            data: newCustomer,
            message: 'Customer added successfully',
        });
    } catch (err: any) {
        console.error(err);

        // Handle duplicate email error (unique constraint violation)
        if (err.name === 'SequelizeUniqueConstraintError') {
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
};  