import React, { useState } from 'react';
import {
    createTheme,
    ThemeProvider,
    CssBaseline,
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Create a dark theme that matches the provided dashboard screenshot
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#1a1a1a', // A very dark gray, almost black background
            paper: '#2c2c2e',    // The card background color
        },
        primary: {
            main: '#4F46E5', // Professional Blue from your design document for consistency
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
        success: {
            main: '#10B981', // Green for success messages
        },
        error: {
            main: '#EF4444', // Red for error messages
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif', // Using the font specified in the document
        h5: {
            fontWeight: 700,
        },
        body2: {
            color: '#b0b0b0',
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#555',
                        },
                        '&:hover fieldset': {
                            borderColor: '#777',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#4F46E5', // Primary color on focus
                        },
                    },
                },
            },
        },
    },
});

const ClientVerificationPage = () => {
    const [fullName, setFullName] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [error, setError] = useState('');

    // This function simulates the API call to the backend for verification.
    // The backend would use the Deal ID from the URL to check the name.
    const handleVerification = (event) => {
        event.preventDefault();
        setError('');
        setStatus('loading');

        // Simulate network delay
        setTimeout(() => {
            // --- Backend Logic Simulation ---
            // In a real app, you would make a fetch/axios call here.
            // For this example, we'll just check if the name is "John Doe".
            if (fullName.trim().toLowerCase() === 'john doe') {
                setStatus('success');
                // In a real app, you would redirect to the payment page:
            } else {
                setStatus('error');
                setError('The name does not match our records. Please try again.');
            }
        }, 1500);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    py: 4
                }}
            >
                <Card sx={{ width: '100%', maxWidth: 450 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mb: 3
                            }}
                        >
                            <LockOutlinedIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
                            <Typography component="h1" variant="h5">
                                Identity Verification
                            </Typography>
                            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                                For your security, please enter your full name as provided to the business to access the payment details.
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleVerification} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="fullName"
                                label="Full Name"
                                name="fullName"
                                autoComplete="name"
                                autoFocus
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={status === 'loading' || status === 'success'}
                            />

                            {status === 'error' && (
                                <Typography color="error" variant="body2" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                    <ErrorOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                                    {error}
                                </Typography>
                            )}

                            {status === 'success' ? (
                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 48 }} />
                                    <Typography color="success.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                                        Verification Successful!
                                    </Typography>
                                    <Typography variant="body2">
                                        Redirecting to payment page...
                                    </Typography>
                                </Box>
                            ) : (
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={status === 'loading'}
                                    sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                                >
                                    {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Verify & Proceed'}
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </ThemeProvider>
    );
};

export default ClientVerificationPage;
