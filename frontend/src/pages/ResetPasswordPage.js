import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { email, reset_token } = location.state || {};

    useEffect(() => {
        if (!email || !reset_token) {
            setError('Invalid or expired link. Please use Forgot Password again.');
        }
    }, [email, reset_token]);

    useEffect(() => {
        if (password && confirmPassword && password !== confirmPassword) setError('Passwords do not match.');
        else if (error === 'Passwords do not match.') setError('');
    }, [password, confirmPassword]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            setError('Both password fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!email || !reset_token) {
            setError('Invalid session. Please use Forgot Password again.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/reset-password/`, {
                email,
                reset_token,
                new_password: password,
            });
            if (res.data.access) {
                localStorage.setItem('access', res.data.access);
                localStorage.setItem('refresh', res.data.refresh);
            }
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = (colors) => ({
        '& .MuiInputLabel-root': { color: colors.secondaryText },
        '& .MuiInputLabel-root.Mui-focused': { color: colors.accent },
        '& .MuiFormHelperText-root': { color: colors.errorText, marginLeft: 0 },
        '& .MuiOutlinedInput-root': {
            backgroundColor: colors.inputBackground,
            color: colors.primaryText,
            borderRadius: '8px',
            '& fieldset': { borderColor: colors.inputBorder },
            '&:hover fieldset': { borderColor: colors.accent },
            '&.Mui-focused fieldset': { borderColor: colors.accent },
            '&.Mui-error fieldset': { borderColor: colors.errorText },
        },
    });

    if (!email || !reset_token) {
        return (
            <Box sx={{ minHeight: '100vh', backgroundColor: themeColors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Paper sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
                    <Typography color="error" sx={{ mb: 2 }}>Invalid or expired link. Please request a new password reset.</Typography>
                    <Button variant="contained" onClick={() => navigate('/forgot-password')}>Forgot Password</Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: themeColors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, fontFamily: 'Inter, sans-serif' }}>
            <Paper elevation={12} sx={{ display: 'flex', maxWidth: '960px', width: '100%', borderRadius: '20px', overflow: 'hidden', backgroundColor: themeColors.card, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                {!isMobile && (
                    <Grid item md={6} sx={{ backgroundImage: 'url(https://images.unsplash.com/photo-1593428929090-6455164a32a9?auto=format&fit=crop&w=687&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                )}
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        {!submitted ? (
                            <>
                                <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: themeColors.primaryText, mb: 1 }}>
                                    Set New Password
                                </Typography>
                                <Typography sx={{ color: themeColors.secondaryText, mb: 4 }}>
                                    Your new password must be different from previous ones.
                                </Typography>
                                {error && <Typography sx={{ color: '#f44336', mb: 2 }}>{error}</Typography>}
                                <form onSubmit={handleSubmit} noValidate>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField fullWidth required type={showPassword ? 'text' : 'password'} label="New Password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" sx={inputStyles(themeColors)}
                                                InputProps={{ startAdornment: <Lock sx={{ color: themeColors.secondaryText, mr: 1 }} />, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff sx={{ color: themeColors.secondaryText }} /> : <Visibility sx={{ color: themeColors.secondaryText }} />}</IconButton></InputAdornment> }} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth required type={showConfirmPassword ? 'text' : 'password'} label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} variant="outlined" error={!!error} helperText={error} sx={inputStyles(themeColors)}
                                                InputProps={{ startAdornment: <Lock sx={{ color: themeColors.secondaryText, mr: 1 }} />, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOff sx={{ color: themeColors.secondaryText }} /> : <Visibility sx={{ color: themeColors.secondaryText }} />}</IconButton></InputAdornment> }} />
                                        </Grid>
                                    </Grid>
                                    <Button type="submit" fullWidth variant="contained" disabled={!!error || !password || !confirmPassword || loading} sx={{ mt: 3, py: 1.5, backgroundColor: themeColors.accent, borderRadius: '8px', textTransform: 'none', fontSize: '1rem', '&:hover': { backgroundColor: themeColors.buttonHover } }}>
                                        {loading ? 'Updating...' : 'Reset Password'}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center' }}>
                                <CheckCircle sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
                                <Alert severity="success" variant="filled" sx={{ backgroundColor: '#2e7d32', color: '#fff', mb: 3 }}>
                                    <AlertTitle>Password reset</AlertTitle>
                                    Your password has been updated. You are logged in — going to dashboard.
                                </Alert>
                                <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ backgroundColor: themeColors.accent, '&:hover': { backgroundColor: themeColors.buttonHover } }}>
                                    Go to Dashboard
                                </Button>
                                <Button startIcon={<ArrowBack />} sx={{ mt: 2, display: 'block', mx: 'auto', color: themeColors.secondaryText, textTransform: 'none' }} onClick={() => navigate('/login')}>
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
