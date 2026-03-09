import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Paper,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function RequestResetPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1 = email, 2 = OTP
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const otpRefs = useRef([]);

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

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your email.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/forgot-password/`, { email: email.trim().toLowerCase() });
            setStep(2);
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpStr = otp.join('');
        if (otpStr.length !== 6) {
            setError('Enter all 6 digits.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/verify-reset-otp/`, {
                email: email.trim().toLowerCase(),
                otp: otpStr,
            });
            navigate('/reset-password', { state: { email: res.data.email, reset_token: res.data.reset_token } });
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: themeColors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, fontFamily: 'Inter, sans-serif' }}>
            <Paper elevation={12} sx={{ display: 'flex', maxWidth: '960px', width: '100%', borderRadius: '20px', overflow: 'hidden', backgroundColor: themeColors.card, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                {!isMobile && (
                    <Grid item md={6} sx={{ backgroundImage: 'url(https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=764&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 4, color: 'white' }}>
                        <Typography variant="h6" fontWeight="bold">BizPulse</Typography>
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: { xs: 3, sm: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: themeColors.primaryText, mb: 1 }}>
                            Forgot Password?
                        </Typography>
                        <Typography sx={{ color: themeColors.secondaryText, mb: 4 }}>
                            {step === 1 ? "We'll send a 6-digit OTP to your registered email. Only real accounts can receive it." : `Enter the OTP sent to ${email}`}
                        </Typography>

                        {error && <Typography sx={{ color: '#f44336', mb: 2 }}>{error}</Typography>}

                        {step === 1 ? (
                            <form onSubmit={handleSubmitEmail} noValidate>
                                <TextField fullWidth required type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" sx={inputStyles(themeColors)} InputProps={{ startAdornment: <Email sx={{ color: themeColors.secondaryText, mr: 1 }} /> }} />
                                <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, py: 1.5, backgroundColor: themeColors.accent, borderRadius: '8px', textTransform: 'none', fontSize: '1rem', '&:hover': { backgroundColor: themeColors.buttonHover } }}>
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} noValidate>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <TextField key={i} inputRef={(el) => (otpRefs.current[i] = el)} value={otp[i]} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.2rem' } }} sx={{ width: 48, ...inputStyles(themeColors) }} />
                                    ))}
                                </Box>
                                <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5, backgroundColor: themeColors.accent, borderRadius: '8px', textTransform: 'none', '&:hover': { backgroundColor: themeColors.buttonHover } }}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </Button>
                            </form>
                        )}

                        <Button startIcon={<ArrowBack />} sx={{ mt: 2, color: themeColors.secondaryText, textTransform: 'none', alignSelf: 'center' }} onClick={() => navigate('/login')}>
                            Back to Login
                        </Button>
                    </Box>
                </Grid>
            </Paper>
        </Box>
    );
}
