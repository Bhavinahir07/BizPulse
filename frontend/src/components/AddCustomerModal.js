import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
    IconButton,
    InputAdornment,
    useTheme,
    useMediaQuery,
    Alert,
    CircularProgress,
    Typography // <-- This was the missing import
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIcon from '@mui/icons-material/Phone';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default function AddCustomerModal({ open, handleClose, refreshData, editCustomer, isEdit = false }) {
    // --- FIX: Use three separate states for the form fields ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Pre-fill form when in edit mode
    useEffect(() => {
        if (isEdit && editCustomer) {
            setName(editCustomer.name || '');
            setEmail(editCustomer.email || '');
            setPhoneNumber(editCustomer.phone_number || '');
        } else {
            setName('');
            setEmail('');
            setPhoneNumber('');
        }
    }, [isEdit, editCustomer]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Customer name is required.');
            return;
        }
        if (!email.trim() && !phoneNumber.trim()) {
            setError('Please provide either an email or a phone number.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                // Update existing customer
                await api.put(`/customers/${editCustomer.id}/`, {
                    name: name.trim(),
                    email: email.trim() || null,
                    phone_number: phoneNumber.trim() || null
                });
            } else {
                // Create new customer
                await api.post('/customers/', {
                    name: name.trim(),
                    email: email.trim() || null,
                    phone_number: phoneNumber.trim() || null
                });
            }

            setSuccess(true);
            // Reset form
            setName('');
            setEmail('');
            setPhoneNumber('');

            // Close modal after a short delay
            setTimeout(() => {
                handleClose();
                setSuccess(false);
                if (refreshData) refreshData();
            }, 1500);

        } catch (err) {
            console.error(isEdit ? 'Failed to update customer:' : 'Failed to create customer:', err);
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                const errorMessages = Object.values(errorData).flat().join(' ');
                setError(errorMessages || (isEdit ? 'Failed to update customer. Please try again.' : 'Failed to create customer. Please try again.'));
            } else {
                setError('Network error. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        if (!loading) {
            // Reset form state on close
            setName('');
            setEmail('');
            setPhoneNumber('');
            setError('');
            setSuccess(false);
            handleClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseModal}
            fullScreen={fullScreen}
            PaperProps={{ sx: { backgroundColor: '#1a1a2e', color: '#ffffff', borderRadius: '20px', border: '1px solid #4F46E533' } }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" sx={{fontWeight: 600}}>{isEdit ? 'Edit Customer' : 'Add New Customer'}</Typography>
                <IconButton aria-label="close" onClick={handleCloseModal} disabled={loading} sx={{ color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: '#4F46E533' }}>
                {error && <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7' }}>Customer {isEdit ? 'updated' : 'created'} successfully!</Alert>}
                
                <Box component="form" noValidate autoComplete="off" sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 1}}>
                    <TextField
                        autoFocus
                        id="name"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon sx={{ color: '#a8a8ff' }} /></InputAdornment>) }}
                    />
                    {/* --- FIX: New separate email field --- */}
                    <TextField
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><AlternateEmailIcon sx={{ color: '#a8a8ff' }} /></InputAdornment>) }}
                    />
                    {/* --- FIX: New separate phone number field --- */}
                    <TextField
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        fullWidth
                        variant="outlined"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={loading}
                        placeholder="+919876543210"
                        InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon sx={{ color: '#a8a8ff' }} /></InputAdornment>) }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' }}>
                <Button onClick={handleCloseModal} disabled={loading} sx={{ color: '#a8a8ff' }}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{ backgroundColor: '#6366f1', '&:hover': { backgroundColor: '#4F46E5' } }}
                >
                    {loading ? 'Saving...' : (isEdit ? 'Update Customer' : 'Save Customer')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

