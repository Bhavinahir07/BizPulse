import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function SignUp() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 = form, 2 = OTP
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        setUsername(`${firstName}${lastName}`.toLowerCase().replace(/\s+/g, ''));
    }, [firstName, lastName]);

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) setError('Passwords do not match');
        else if (error === 'Passwords do not match') setError('');
    }, [password, confirmPassword]);

    const handleClickShowPassword = () => setShowPassword((s) => !s);
    const handleMouseDownPassword = (e) => e.preventDefault();

    const handleSendOtp = async (e) => {
        e?.preventDefault();
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/send-signup-otp/`, {
                email: email.trim().toLowerCase(),
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                password,
            });
            setStep(2);
            setSuccess('OTP sent to your email. Enter it below.');
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to send OTP. Try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const otpRefs = React.useRef([]);
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
        e?.preventDefault();
        const otpStr = otp.join('');
        if (otpStr.length !== 6) {
            setError('Enter all 6 digits');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/verify-signup-otp/`, {
                email: email.trim().toLowerCase(),
                otp: otpStr,
            });
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired OTP. Try again.');
        } finally {
            setLoading(false);
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

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: themeColors.background, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, fontFamily: 'Inter, sans-serif' }}>
            <Grid container sx={{ maxWidth: '1200px', width: '100%', backgroundColor: themeColors.card, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 5 }}>
                    <Button component="a" href="/" variant="contained" startIcon={<ArrowBack />}>Back to Home</Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: { xs: 3, sm: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: themeColors.primaryText, mb: 1 }}>
                            {step === 1 ? 'Create an account' : 'Verify your email'}
                        </Typography>
                        <Typography sx={{ color: themeColors.secondaryText, mb: 4 }}>
                            {step === 1 ? (
                                <>Already have an account? <a href="/login" style={{ color: themeColors.accent, textDecoration: 'none' }}>Log in</a></>
                            ) : (
                                <>We sent a 6-digit code to <strong>{email}</strong>. Enter it below.</>
                            )}
                        </Typography>

                        {error && <Typography sx={{ color: '#f44336', mb: 2, textAlign: 'center' }}>{error}</Typography>}
                        {success && <Typography sx={{ color: '#4caf50', mb: 2, textAlign: 'center' }}>{success}</Typography>}

                        {step === 1 ? (
                            <form onSubmit={handleSendOtp} noValidate>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth placeholder="First name" variant="outlined" sx={inputStyles(themeColors)} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth placeholder="Last name" variant="outlined" sx={inputStyles(themeColors)} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth type="email" placeholder="Email" variant="outlined" sx={inputStyles(themeColors)} value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Password" variant="outlined" sx={inputStyles(themeColors)}
                                            InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" sx={{ color: themeColors.secondaryText }}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Confirm password" variant="outlined" sx={inputStyles(themeColors)} error={!!error && error.includes('match')} helperText={error && error.includes('match') ? error : ''} FormHelperTextProps={{ sx: { color: '#f44336' } }} />
                                    </Grid>
                                </Grid>
                                <FormControlLabel control={<Checkbox sx={{ color: themeColors.inputBorder, '&.Mui-checked': { color: themeColors.accent } }} />} label={<Typography sx={{ color: themeColors.secondaryText, fontSize: '0.875rem' }}>I agree to the Terms & Conditions</Typography>} sx={{ mt: 1, mb: 2 }} />
                                <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ py: 1.5, backgroundColor: themeColors.accent, borderRadius: '8px', textTransform: 'none', fontSize: '1rem', boxShadow: 'none', '&:hover': { backgroundColor: themeColors.buttonHover }, mb: 2 }}>
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} noValidate>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <TextField key={i} inputRef={(el) => (otpRefs.current[i] = el)} value={otp[i]} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.2rem' } }} sx={{ width: 48, ...inputStyles(themeColors) }} />
                                    ))}
                                </Box>
                                <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ py: 1.5, backgroundColor: themeColors.accent, borderRadius: '8px', textTransform: 'none', fontSize: '1rem', '&:hover': { backgroundColor: themeColors.buttonHover }, mb: 2 }}>
                                    {loading ? 'Verifying...' : 'Verify & Create account'}
                                </Button>
                                <Button fullWidth variant="text" sx={{ color: themeColors.secondaryText, textTransform: 'none' }} onClick={() => { setStep(1); setError(''); setSuccess(''); }}>
                                    Change email
                                </Button>
                            </form>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
