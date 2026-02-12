import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import axios from 'axios';

// ====================== API BASE URL ======================
const API_BASE_URL = 'http://127.0.0.1:8000/api'; // replace with your backend URL

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // This state is not needed for an input field anymore, but is useful for sending to the backend
    const [username, setUsername] = useState('');

    // Automatically generate username when firstName or lastName changes
    useEffect(() => {
        const generatedUser = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, '');
        setUsername(generatedUser);
    }, [firstName, lastName]);

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setError("Passwords do not match");
        } else {
            setError('');
        }
    }, [password, confirmPassword]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleRegister = async () => {
        // Updated validation to remove the username check, since it's auto-generated
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError('');
        setSuccess('');
        try {
            // *** FIX: Changed keys to 'first_name' and 'last_name' ***
            // This is a common convention for Django/Python backends.
            // This ensures the data is saved to the correct columns in your 'auth_user' table.
            await axios.post(`${API_BASE_URL}/register/`, {
                first_name: firstName,
                last_name: lastName,
                username: username,
                email,
                password,
            });


            setSuccess('Registration successful! You can now log in.');
            setFirstName('');
            setLastName('');
            // No need to setUsername here, useEffect will handle it
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // To show more specific errors from the backend if they exist
                const errorData = err.response.data;
                const errorMessages = Object.values(errorData).flat().join(' ');
                setError(errorMessages || 'Failed to register. Please check your details.');
            } else {
                setError('Failed to register. Make sure your email is unique.');
            }
        }
    };

    const themeColors = {
        background: '#1a1a2e',
        card: '#24243e',
        primaryText: '#ffffff',
        secondaryText: '#b3b3cc',
        accent: '#9a67ff',
        inputBackground: '#1f1f36',
        inputBorder: '#4e4e6a',
        buttonHover: '#b388ff',
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: themeColors.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            fontFamily: 'Inter, sans-serif'
        }}>
            <Grid container sx={{
                maxWidth: '1200px',
                width: '100%',
                backgroundColor: themeColors.card,
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
            }}>
                <Grid item xs={12} md={6} sx={{
                    backgroundColor: themeColors.card,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 5,
                    position: 'relative'
                }}>
                    <Box sx={{
                        textAlign: 'center',
                        maxWidth: '400px',
                        width: '100%',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <Button
                            component="a"
                            href="/"
                            variant="contained"
                            startIcon={<ArrowBack />}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ p: { xs: 3, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: themeColors.primaryText, mb: 1 }}>
                            Create an account
                        </Typography>
                        <Typography sx={{ color: themeColors.secondaryText, mb: 4 }}>
                            Already have an account? <a href="/login" style={{ color: themeColors.accent, textDecoration: 'none' }}>Log in</a>
                        </Typography>

                        {error && <Typography sx={{ color: '#f44336', mb: 2, textAlign: 'center' }}>{error}</Typography>}
                        {success && <Typography sx={{ color: '#4caf50', mb: 2, textAlign: 'center' }}>{success}</Typography>}

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    placeholder="First name"
                                    variant="outlined"
                                    sx={inputStyles(themeColors)}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    placeholder="Last name"
                                    variant="outlined"
                                    sx={inputStyles(themeColors)}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Grid>
                            {/* --- REMOVED: The username text field is no longer needed here --- */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    placeholder="Email"
                                    variant="outlined"
                                    sx={inputStyles(themeColors)}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    variant="outlined"
                                    sx={inputStyles(themeColors)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    sx={{ color: themeColors.secondaryText }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    variant="outlined"
                                    sx={inputStyles(themeColors)}
                                    error={!!error && error.includes('match')} // Only show error state for password mismatch
                                    helperText={error && error.includes('match') ? error : ''}
                                    FormHelperTextProps={{ sx: { color: '#f44336' } }}
                                />
                            </Grid>
                        </Grid>

                        <FormControlLabel
                            control={<Checkbox sx={{ color: themeColors.inputBorder, '&.Mui-checked': { color: themeColors.accent } }} />}
                            label={
                                <Typography sx={{ color: themeColors.secondaryText, fontSize: '0.875rem' }}>
                                    I agree to the <a href="#" style={{ color: themeColors.accent, textDecoration: 'none' }}>Terms & Conditions</a>
                                </Typography>
                            }
                            sx={{ mt: 1, mb: 2 }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ py: 1.5, backgroundColor: themeColors.accent, borderRadius: '8px', textTransform: 'none', fontSize: '1rem', boxShadow: 'none', '&:hover': { backgroundColor: themeColors.buttonHover }, mb: 2 }}
                            onClick={handleRegister}
                        >
                            Create account
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

const inputStyles = (colors) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: colors.inputBackground,
        color: colors.primaryText,
        borderRadius: '8px',
        '& fieldset': { borderColor: colors.inputBorder },
        '&:hover fieldset': { borderColor: colors.accent },
        '&.Mui-focused fieldset': { borderColor: colors.accent },
    },
    '& .MuiInputBase-input::placeholder': { color: colors.secondaryText, opacity: 1 },
});
