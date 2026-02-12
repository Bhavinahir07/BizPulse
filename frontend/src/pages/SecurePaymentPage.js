import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Radio,
    FormControlLabel,
    RadioGroup,
    Divider,
    Snackbar,
    Alert,
    TextField, // New: Import TextField for input fields
} from '@mui/material';
import { Home } from '@mui/icons-material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// --- THEME COLORS ---
const themeColors = {
    background: '#12121e',
    card: '#2a2a3e', 
    // Card Text Colors (Using white text for dark background inputs)
    inputFieldText: '#ffffff', 
    inputFieldBg: '#1e1e2e', // A slightly lighter dark for input fields
    
    // Payment Option Selection Colors
    selectedPaymentOptionBg: '#e0e0e0',
    selectedPaymentOptionText: '#12121e', 
    
    primaryText: '#ffffff', 
    secondaryText: '#b3b3cc', 
    accent: '#9a67ff', 
    ctaButton: '#FF8C00',
    inputBorder: '#4e4e6a', 
};

// --- SIMULATED DEAL DATA ---
const getSimulatedDeal = (dealId) => ({
    id: dealId,
    description: "T-45 Flour",
    quantity: 2, // Updated quantity to match your image
    amount: 290.00, // Updated amount to match your image
    shipping_address: "Rajkot sukhadevsinhtow ship34525 shilpark",
    phone: "9265293073",
});

export default function SecurePaymentPage() {
    const location = useLocation();
    const dealId = new URLSearchParams(location.search).get('dealId') || '101'; 
    
    const [selectedDeal] = useState(getSimulatedDeal(dealId));
    // Default payment method is set to COD based on the initial screenshot
    const [paymentMethod, setPaymentMethod] = useState('cod'); 
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // --- FORM DATA STATE ---
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
    const [upiId, setUpiId] = useState('');

    // --- CALCULATED VALUES ---
    const subtotal = selectedDeal.amount;
    const shippingFee = 'Free'; // Based on your image
    const total = subtotal; // Total is subtotal when shipping is free

    const handlePayment = async () => {
        setLoading(true);
        // In a real app, you'd send paymentMethod and form data to the server
        const API_URL = `/api/simulate-payment/${dealId}/`; 

        try {
            const response = await axios.post(API_URL);
            
            if (response.data.success) {
                setSnackbarMessage('Payment successfully initiated!');
                setSnackbarSeverity('success');
            } else {
                 setSnackbarMessage('Payment failed. Please try again.');
                 setSnackbarSeverity('warning');
            }
        } catch (error) {
            setSnackbarMessage("Error processing payment.");
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setSnackbarOpen(true);
        }
    };
    
    // Helper component to render the dynamic forms
    const renderPaymentForm = () => {
        switch (paymentMethod) {
            case 'card':
                return (
                    <Box sx={{ p: 2 }}>
                        <TextField 
                            fullWidth 
                            label="Card Number" 
                            variant="filled"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            inputProps={{ maxLength: 19 }}
                            sx={inputFieldStyle}
                        />
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={6}>
                                <TextField 
                                    fullWidth 
                                    label="Expiry Date (MM/YY)" 
                                    variant="filled"
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                    inputProps={{ maxLength: 5 }}
                                    sx={inputFieldStyle}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField 
                                    fullWidth 
                                    label="CVV" 
                                    variant="filled"
                                    type="password"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                    inputProps={{ maxLength: 4 }}
                                    sx={inputFieldStyle}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            case 'upi':
                return (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="caption" color={themeColors.secondaryText} sx={{ mb: 1, display: 'block' }}>
                            Enter UPI ID
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField 
                                fullWidth 
                                placeholder="yourname@bank" 
                                variant="filled"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                sx={inputFieldStyle}
                            />
                            <Button 
                                variant="contained" 
                                sx={{ backgroundColor: '#4e4e6a', color: themeColors.primaryText, '&:hover': { backgroundColor: '#5a5a75' } }}
                            >
                                Verify
                            </Button>
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: themeColors.background,
                color: themeColors.primaryText,
                p: 4,
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, maxWidth: 'lg', margin: '0 auto', px: { xs: 2, md: 0 } }}>
                <Typography variant="h5" fontWeight="bold" color={themeColors.primaryText}>
                    Checkout
                </Typography>
                <Button 
                    variant="outlined" 
                    startIcon={<Home />} 
                    sx={{ color: themeColors.secondaryText, borderColor: themeColors.secondaryText }}
                    onClick={() => window.location.href = '/'}
                >
                    Back to Home
                </Button>
            </Box>

            {/* --- PAYMENT LAYOUT (Two-Column) --- */}
            <Grid container spacing={4} maxWidth="lg" sx={{ margin: '0 auto', fontFamily: 'Roboto, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center', }}>
                
                {/* 1. Payment Method Column (Left) */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={8} sx={{ p: 4, borderRadius: '12px', backgroundColor: themeColors.card }}>
                        <Typography variant="h6" color={themeColors.primaryText} sx={{ mb: 2 }}>
                            Choose Payment Method
                        </Typography>
                        
                        <RadioGroup
                            name="payment-method-group"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            
                            {/* Credit/Debit Card Option */}
                            <Paper variant="outlined" sx={paymentOptionStyle(paymentMethod, 'card')}>
                                <FormControlLabel
                                    value="card"
                                    control={<Radio checked={paymentMethod === 'card'} sx={{ color: themeColors.accent }} />}
                                    label={
                                        <Box>
                                            <Typography 
                                                variant="body1" 
                                                color={paymentMethod === 'card' ? themeColors.selectedPaymentOptionText : themeColors.primaryText}
                                            >
                                                Credit/Debit Card
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                color={paymentMethod === 'card' ? themeColors.selectedPaymentOptionText : themeColors.secondaryText}
                                            >
                                                Secure payment with Visa, MasterCard, etc.
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Paper>

                             {/* Conditionally render the Card fields */}
                            {paymentMethod === 'card' && renderPaymentForm()}
                            
                            {/* UPI Option */}
                            <Paper variant="outlined" sx={paymentOptionStyle(paymentMethod, 'upi')}>
                                <FormControlLabel
                                    value="upi"
                                    control={<Radio checked={paymentMethod === 'upi'} sx={{ color: themeColors.accent }} />}
                                    label={
                                        <Box>
                                            <Typography 
                                                variant="body1" 
                                                color={paymentMethod === 'upi' ? themeColors.selectedPaymentOptionText : themeColors.primaryText}
                                            >
                                                UPI
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                color={paymentMethod === 'upi' ? themeColors.selectedPaymentOptionText : themeColors.secondaryText}
                                            >
                                                Pay with any UPI app like GPay, PhonePe.
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Paper>

                            {/* Conditionally render the UPI fields */}
                            {paymentMethod === 'upi' && renderPaymentForm()}
                        </RadioGroup>

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3, 
                                py: 1.5,
                                backgroundColor: themeColors.ctaButton, 
                                '&:hover': { backgroundColor: '#FF7500' },
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Confirm and Pay ₹${total.toFixed(2)}`}
                        </Button>
                    </Paper>
                </Grid>

            </Grid>
            
            {/* Snackbar for Notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box>
    );
}

// --- HELPER COMPONENTS AND STYLES ---

// Style for the Payment Option Papers
const paymentOptionStyle = (currentMethod, optionValue) => ({
    mt: 2,
    p: 1,
    borderRadius: '8px',
    backgroundColor: currentMethod === optionValue ? themeColors.selectedPaymentOptionBg : themeColors.card,
    borderColor: currentMethod === optionValue ? themeColors.accent : themeColors.inputBorder,
    borderWidth: currentMethod === optionValue ? '2px' : '1px',
    transition: 'all 0.3s',
    cursor: 'pointer',
    '&:hover': {
        borderColor: themeColors.accent,
    },
});

// Row for displaying price breakdown
const PriceRow = ({ label, value, color, variant = 'body1', fontWeight = 'normal' }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant={variant} color={themeColors.secondaryText} fontWeight={fontWeight}>
            {label}
        </Typography>
        <Typography variant={variant} color={color} fontWeight={fontWeight}>
            {value}
        </Typography>
    </Box>
);

// Style for the text field inputs (dark mode compatible)
const inputFieldStyle = {
    // Override filled input default colors for dark mode
    '& .MuiFilledInput-root': {
        backgroundColor: themeColors.inputFieldBg,
        color: themeColors.inputFieldText,
        '&:hover': {
            backgroundColor: themeColors.inputFieldBg,
        },
        '&.Mui-focused': {
            backgroundColor: themeColors.inputFieldBg,
            borderBottom: `2px solid ${themeColors.accent}`,
        },
    },
    '& .MuiInputLabel-filled': {
        color: themeColors.secondaryText,
        '&.Mui-focused': {
            color: themeColors.accent,
        },
    },
};
