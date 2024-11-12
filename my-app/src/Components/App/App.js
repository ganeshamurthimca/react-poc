import React, { useState } from 'react';
import './App.css';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, Paper, TextField, Snackbar, Alert as MuiAlert } from '@mui/material';
import axios from 'axios';

function App() {
    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [errors, setErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!customer.firstName || customer.firstName.trim() === '') {
            tempErrors.firstName = 'First Name is required';
            isValid = false;
        }
        if (!customer.lastName || customer.lastName.trim() === '') {
            tempErrors.lastName = 'Last Name is required';
            isValid = false;
        }
        if (!customer.email || customer.email.trim() === '') {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
            tempErrors.email = 'Email is not valid';
            isValid = false;
        }
        // Optional: Add phone validation if necessary

        setErrors(tempErrors);
        return isValid;
    };

    const handleChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value,
        });
        // Clear validation error for the field
        setErrors({
            ...errors,
            [e.target.name]: '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            // Send data to the backend server
            axios
                .post('http://localhost:3500/api/customers', customer)
                .then((response) => {
                    console.log(response.data);
                    // Show success notification
                    setOpenSnackbar(true);
                    // Clear the form
                    setCustomer({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                    });
                })
                .catch((error) => {
                    console.error('Error submitting form:', error);
                    if (error.response && error.response.data) {
                        // Handle validation errors returned from the backend
                        setErrorMessage(error.response.data.message || 'Submission failed');
                    } else {
                        setErrorMessage('Submission failed');
                    }
                });
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="sm" className="App">
            <Paper style={{ padding: 16 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Customer Information
                </Typography>
                {errorMessage && (
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        severity="error"
                        onClose={() => setErrorMessage('')}
                        style={{ marginBottom: 16 }}
                    >
                        {errorMessage}
                    </MuiAlert>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={customer.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={customer.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={customer.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={customer.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: 16 }}
                    >
                        Submit
                    </Button>
                </form>
            </Paper>

            {/* Snackbar for success message */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity="success"
                >
                    Customer added successfully!
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}

export default App;