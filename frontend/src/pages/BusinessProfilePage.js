import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Paper,
    Avatar,
    CircularProgress,
    Alert,
} from '@mui/material'
import { Business, Person, Payment, Phone, AccountBalance } from '@mui/icons-material'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

export default function BusinessProfilePage() {
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [upiId, setUpiId] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [bankAccountNumber, setBankAccountNumber] = useState('')
    const [bankName, setBankName] = useState('')
    const [ifscCode, setIfscCode] = useState('')
    const [upiIdError, setUpiIdError] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const themeColors = {
        background: '#1a1a2e',
        card: '#24243e',
        primaryText: '#ffffff',
        secondaryText: '#b3b3cc',
        accent: '#9a67ff',
        inputBackground: '#1f1f36',
        inputBorder: '#4e4e6a',
        buttonHover: '#b388ff',
        error: '#ff7575',
    }

    const getAuthHeader = () => {
        const token = localStorage.getItem('access') || localStorage.getItem('access_token')
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('access') || localStorage.getItem('access_token')
            if (!token) {
                setFetchLoading(false)
                return
            }
            try {
                const res = await axios.get(`${API_BASE_URL}/profile/`, { headers: getAuthHeader() })
                const p = res.data
                setFullName(p.full_name || '')
                setBusinessName(p.business_name || '')
                setUpiId(p.upi_id || '')
                setPhoneNumber(p.phone_number || '')
                setBankAccountNumber(p.bank_account_number || '')
                setBankName(p.bank_name || '')
                setIfscCode(p.ifsc_code || '')
                setError('')
            } catch (err) {
                if (err.response?.status === 401) setError('Please log in to view your profile.')
                else setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to load profile.')
            } finally {
                setFetchLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const validateUpiId = (id) => {
        if (!id) return true
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
        if (!upiRegex.test(id)) {
            setUpiIdError('Please enter a valid UPI ID (e.g., yourname@bank).')
            return false
        }
        setUpiIdError('')
        return true
    }

    const handleUpiChange = (e) => {
        const newUpiId = e.target.value
        setUpiId(newUpiId)
        validateUpiId(newUpiId)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (!fullName || !businessName) {
            setError('Full name and business name are required.')
            return
        }
        if (!validateUpiId(upiId)) return

            setLoading(true)
        try {
            const res = await axios.put(
                `${API_BASE_URL}/profile/`,
                {
                    full_name: fullName,
                    business_name: businessName,
                    upi_id: upiId || '',
                    phone_number: phoneNumber || '',
                    bank_account_number: bankAccountNumber || '',
                    bank_name: bankName || '',
                    ifsc_code: ifscCode || '',
                },
                { headers: getAuthHeader() }
            )
            setSuccess('Profile saved successfully!')
            if (res.data) {
                setFullName(res.data.full_name || '')
                setBusinessName(res.data.business_name || '')
                setUpiId(res.data.upi_id || '')
                setPhoneNumber(res.data.phone_number || '')
                setBankAccountNumber(res.data.bank_account_number || '')
                setBankName(res.data.bank_name || '')
                setIfscCode(res.data.ifsc_code || '')
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Please log in to save your profile.')
            } else {
                setError(err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join(' ') || 'Failed to save profile.')
            }
        } finally {
            setLoading(false)
        }
    }

    if (fetchLoading) {
        return (
            <Box sx={{ minHeight: '100vh', backgroundColor: themeColors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress sx={{ color: themeColors.accent }} />
            </Box>
        )
    }

    const isLoggedIn = !!(localStorage.getItem('access') || localStorage.getItem('access_token'))

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: themeColors.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, md: 4 },
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    backgroundColor: themeColors.card,
                    borderRadius: '20px',
                    p: { xs: 3, sm: 4, md: 6 },
                    maxWidth: '600px',
                    width: '100%',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar sx={{ bgcolor: themeColors.accent, width: 56, height: 56, margin: '0 auto 16px' }}>
                        <Business />
                    </Avatar>
                    <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: themeColors.primaryText, mb: 1 }}>
                        Business Profile
                    </Typography>
                    <Typography sx={{ color: themeColors.secondaryText }}>
                        Add how customers can pay you: UPI ID, phone number, or bank account. You can update this anytime.
                    </Typography>
                </Box>

                {!isLoggedIn && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Please <Button color="primary" onClick={() => navigate('/login')} sx={{ textTransform: 'none', p: 0, minWidth: 0 }}>log in</Button> to view and save your business profile.
                    </Alert>
                )}

                {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Full Name"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                variant="outlined"
                                sx={inputStyles(themeColors)}
                                InputProps={{
                                    startAdornment: <Person sx={{ color: themeColors.secondaryText, mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Business Name"
                                value={businessName}
                                onChange={e => setBusinessName(e.target.value)}
                                variant="outlined"
                                sx={inputStyles(themeColors)}
                                InputProps={{
                                    startAdornment: <Business sx={{ color: themeColors.secondaryText, mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ color: themeColors.secondaryText, mb: 1 }}>Payment / receiving details (optional)</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="UPI ID"
                                placeholder="yourname@bank"
                                value={upiId}
                                onChange={handleUpiChange}
                                variant="outlined"
                                error={!!upiIdError}
                                helperText={upiIdError}
                                sx={inputStyles(themeColors)}
                                InputProps={{
                                    startAdornment: <Payment sx={{ color: themeColors.secondaryText, mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                placeholder="e.g. +919876543210"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                variant="outlined"
                                sx={inputStyles(themeColors)}
                                InputProps={{
                                    startAdornment: <Phone sx={{ color: themeColors.secondaryText, mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bank Account Number"
                                placeholder="Account number for transfers"
                                value={bankAccountNumber}
                                onChange={e => setBankAccountNumber(e.target.value)}
                                variant="outlined"
                                sx={inputStyles(themeColors)}
                                InputProps={{
                                    startAdornment: <AccountBalance sx={{ color: themeColors.secondaryText, mr: 1 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Bank Name"
                                placeholder="e.g. State Bank of India"
                                value={bankName}
                                onChange={e => setBankName(e.target.value)}
                                variant="outlined"
                                sx={inputStyles(themeColors)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="IFSC Code"
                                placeholder="e.g. SBIN0001234"
                                value={ifscCode}
                                onChange={e => setIfscCode(e.target.value)}
                                variant="outlined"
                                sx={inputStyles(themeColors)}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading || !isLoggedIn}
                        sx={{
                            mt: 4,
                            py: 1.5,
                            backgroundColor: themeColors.accent,
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '1rem',
                            boxShadow: 'none',
                            '&:hover': { backgroundColor: themeColors.buttonHover },
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
                    </Button>
                </form>
            </Paper>
        </Box>
    )
}

const inputStyles = colors => ({
    '& .MuiInputLabel-root': { color: colors.secondaryText },
    '& .MuiInputLabel-root.Mui-focused': { color: colors.accent },
    '& .MuiFormHelperText-root': { color: colors.error, marginLeft: 0 },
    '& .MuiOutlinedInput-root': {
        backgroundColor: colors.inputBackground,
        color: colors.primaryText,
        borderRadius: '8px',
        '& fieldset': { borderColor: colors.inputBorder },
        '&:hover fieldset': { borderColor: colors.accent },
        '&.Mui-focused fieldset': { borderColor: colors.accent },
        '&.Mui-error fieldset': { borderColor: colors.error },
    },
})
