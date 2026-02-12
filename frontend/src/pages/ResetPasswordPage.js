import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Paper,
    useMediaQuery,
    useTheme,
    InputAdornment,
    IconButton,
    Alert,
    AlertTitle,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, ArrowBack, CheckCircle } from '@mui/icons-material';

export default function App() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
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
        errorText: '#ff7575',
    };

    // Validate passwords on change
    useEffect(() => {
        if (password && confirmPassword && password !== confirmPassword) {
            setError("Passwords do not match.");
        } else {
            setError("");
        }
    }, [password, confirmPassword]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password && confirmPassword && password === confirmPassword) {
            // In a real app, you would call your backend API to update the password
            // using the secure token from the URL.
            console.log('Password has been reset successfully.');
            setSubmitted(true);
        } else if (!password || !confirmPassword) {
            setError("Both password fields are required.");
        }
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
                                'url(https://images.unsplash.com/photo-1593428929090-6455164a32a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
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
                                    Set New Password
                                </Typography>
                                <Typography sx={{ color: themeColors.secondaryText, mb: 4 }}>
                                    Your new password must be different from previous ones.
                                </Typography>
                                <form onSubmit={handleSubmit} noValidate>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                required
                                                type={showPassword ? 'text' : 'password'}
                                                label="New Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                variant="outlined"
                                                sx={inputStyles(themeColors)}
                                                InputProps={{
                                                    startAdornment: <Lock sx={{ color: themeColors.secondaryText, mr: 1 }} />,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                                {showPassword ? <VisibilityOff sx={{ color: themeColors.secondaryText }} /> : <Visibility sx={{ color: themeColors.secondaryText }} />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                required
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                label="Confirm New Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                variant="outlined"
                                                error={!!error}
                                                helperText={error}
                                                sx={inputStyles(themeColors)}
                                                InputProps={{
                                                    startAdornment: <Lock sx={{ color: themeColors.secondaryText, mr: 1 }} />,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                                {showConfirmPassword ? <VisibilityOff sx={{ color: themeColors.secondaryText }} /> : <Visibility sx={{ color: themeColors.secondaryText }} />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={!!error || !password || !confirmPassword}
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
                                        Reset Password
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center' }}>
                                <CheckCircle sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
                                <Alert
                                    severity="success"
                                    variant="filled"
                                    sx={{ backgroundColor: '#2e7d32', color: '#fff', mb: 3 }}
                                >
                                    <AlertTitle>Password Reset!</AlertTitle>
                                    Your password has been successfully updated.
                                </Alert>
                                <Button
                                    startIcon={<ArrowBack />}
                                    sx={{
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
    '& .MuiFormHelperText-root': {
        color: colors.errorText,
        marginLeft: 0,
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: colors.inputBackground,
        color: colors.primaryText,
        borderRadius: '8px',
        '& fieldset': { borderColor: colors.inputBorder },
        '&:hover fieldset': { borderColor: colors.accent },
        '&.Mui-focused fieldset': { borderColor: colors.accent },
        '&.Mui-error fieldset': {
            borderColor: colors.errorText,
        },
    },
});
