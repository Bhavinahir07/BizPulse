import React, { useState } from 'react'
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Paper,
    Avatar,
} from '@mui/material'
import { Business, Person, Payment } from '@mui/icons-material'

export default function App() {
    const [fullName, setFullName] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [upiId, setUpiId] = useState('')
    const [upiIdError, setUpiIdError] = useState('')

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

    const validateUpiId = (id) => {
        // Simple UPI ID validation regex: something@something
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        if (!id) {
            setUpiIdError('UPI ID is required.');
            return false;
        }
        if (!upiRegex.test(id)) {
            setUpiIdError('Please enter a valid UPI ID (e.g., yourname@bank).');
            return false;
        }
        setUpiIdError('');
        return true;
    }

    const handleUpiChange = (e) => {
        const newUpiId = e.target.value;
        setUpiId(newUpiId);
        validateUpiId(newUpiId);
    }

    const handleSubmit = e => {
        e.preventDefault()

        const isUpiValid = validateUpiId(upiId);

        if (fullName && businessName && isUpiValid) {
            // Handle form submission logic here
            console.log({
                fullName,
                businessName,
                upiId,
            })
            alert('Profile saved successfully!')
        }
    }

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
                    <Avatar
                        sx={{
                            bgcolor: themeColors.accent,
                            width: 56,
                            height: 56,
                            margin: '0 auto 16px',
                        }}
                    >
                        <Business />
                    </Avatar>
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="bold"
                        sx={{ color: themeColors.primaryText, mb: 1 }}
                    >
                        Business Profile
                    </Typography>
                    <Typography sx={{ color: themeColors.secondaryText }}>
                        Complete your profile to get started with your CRM dashboard.
                    </Typography>
                </Box>

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
                                    startAdornment: (
                                        <Person sx={{ color: themeColors.secondaryText, mr: 1 }} />
                                    ),
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
                                    startAdornment: (
                                        <Business
                                            sx={{ color: themeColors.secondaryText, mr: 1 }}
                                        />
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="UPI ID"
                                placeholder="yourname@bank"
                                value={upiId}
                                onChange={handleUpiChange}
                                variant="outlined"
                                error={!!upiIdError}
                                helperText={upiIdError}
                                sx={inputStyles(themeColors)}
                                InputProps={{
                                    startAdornment: (
                                        <Payment sx={{ color: themeColors.secondaryText, mr: 1 }} />
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
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
                        Save and Continue
                    </Button>
                </form>
            </Paper>
        </Box>
    )
}

// Helper function for consistent input styles
const inputStyles = colors => ({
    '& .MuiInputLabel-root': {
        color: colors.secondaryText,
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: colors.accent,
    },
    '& .MuiFormHelperText-root': {
        color: colors.error,
        marginLeft: 0,
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: colors.inputBackground,
        color: colors.primaryText,
        borderRadius: '8px',
        '& fieldset': {
            borderColor: colors.inputBorder,
        },
        '&:hover fieldset': {
            borderColor: colors.accent,
        },
        '&.Mui-focused fieldset': {
            borderColor: colors.accent,
        },
        '&.Mui-error fieldset': {
            borderColor: colors.error,
        },
    },
})

