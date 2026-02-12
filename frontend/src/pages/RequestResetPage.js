import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Paper,
    useMediaQuery,
    useTheme,
    Alert,
    AlertTitle,
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';

export default function App() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const themeColors = {
        background: '#12121e',
        card: '#1e1e2f',
        primaryText: '#ffffff',
        secondaryText: '#b3b3cc',
        accent: '#9a67ff',
        inputBackground: '#2a2a3e',
        inputBorder: '#4e4e6a',
        buttonHover: '#b388ff',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would add logic here to call your backend API
        // to send the password reset email.
        console.log('Password reset requested for:', email);
        setSubmitted(true);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: themeColors.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <Paper
                elevation={12}
                sx={{
                    display: 'flex',
                    maxWidth: '960px',
                    width: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: themeColors.card,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                }}
            >
                {/* Left Panel - Image */}
                {!isMobile && (
                    <Grid
                        item
                        md={6}
                        sx={{
                            backgroundImage:
                                'url(https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            p: 4,
                            color: 'white',
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold">AMU</Typography>
                        {/* You can add a relevant quote or text here */}
                    </Grid>
                )}

                {/* Right Panel - Form */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            p: { xs: 3, sm: 5 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        {!submitted ? (
                            <>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    fontWeight="bold"
                                    sx={{ color: themeColors.primaryText, mb: 1 }}
                                >
                                    Forgot Password?
                                </Typography>
                                <Typography sx={{ color: themeColors.secondaryText, mb: 4 }}>
                                    No worries, we'll send you reset instructions.
                                </Typography>
                                <form onSubmit={handleSubmit} noValidate>
                                    <TextField
                                        fullWidth
                                        required
                                        type="email"
                                        label="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        variant="outlined"
                                        sx={inputStyles(themeColors)}
                                        InputProps={{
                                            startAdornment: (
                                                <Email sx={{ color: themeColors.secondaryText, mr: 1 }} />
                                            ),
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            mt: 3,
                                            py: 1.5,
                                            backgroundColor: themeColors.accent,
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            '&:hover': { backgroundColor: themeColors.buttonHover },
                                        }}
                                    >
                                        Send Reset Link
                                    </Button>
                                </form>
                                <Button
                                    startIcon={<ArrowBack />}
                                    sx={{
                                        mt: 2,
                                        color: themeColors.secondaryText,
                                        textTransform: 'none',
                                        alignSelf: 'center',
                                    }}
                                    onClick={() => { /* Add navigation to login page */ }}
                                >
                                    Back to Login
                                </Button>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center' }}>
                                <Alert
                                    severity="success"
                                    variant="filled"
                                    sx={{ backgroundColor: '#2e7d32', color: '#fff' }}
                                >
                                    <AlertTitle>Check your email</AlertTitle>
                                    If an account with that email exists, we've sent instructions to reset your password.
                                </Alert>
                                <Button
                                    startIcon={<ArrowBack />}
                                    sx={{
                                        mt: 3,
                                        color: themeColors.secondaryText,
                                        textTransform: 'none',
                                    }}
                                    onClick={() => { /* Add navigation to login page */ }}
                                >
                                    Back to Login
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Paper>
        </Box>
    );
}

// Helper function for consistent input styles
const inputStyles = (colors) => ({
    '& .MuiInputLabel-root': { color: colors.secondaryText },
    '& .MuiInputLabel-root.Mui-focused': { color: colors.accent },
    '& .MuiOutlinedInput-root': {
        backgroundColor: colors.inputBackground,
        color: colors.primaryText,
        borderRadius: '8px',
        '& fieldset': { borderColor: colors.inputBorder },
        '&:hover fieldset': { borderColor: colors.accent },
        '&.Mui-focused fieldset': { borderColor: colors.accent },
    },
});
