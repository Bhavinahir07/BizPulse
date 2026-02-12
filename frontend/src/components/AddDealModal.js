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
    MenuItem,
    useTheme,
    useMediaQuery,
    Alert,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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

export default function AddDealModal({ open, handleClose, customers = [], refreshData, editDeal, isEdit = false }) {
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Format today's date for the date input min attribute
    const today = new Date().toISOString().split('T')[0];

    // Pre-fill form when in edit mode
    useEffect(() => {
        if (isEdit && editDeal) {
            setSelectedCustomer(editDeal.customer?.id || '');
            setDescription(editDeal.description || '');
            setAmount(editDeal.amount || '');
            setDueDate(editDeal.due_date || '');
        } else {
            setSelectedCustomer('');
            setDescription('');
            setAmount('');
            setDueDate('');
        }
    }, [isEdit, editDeal]);

    const handleSubmit = async () => {
        if (!selectedCustomer) {
            setError('Please select a customer');
            return;
        }

        if (!description.trim()) {
            setError('Description is required');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!dueDate) {
            setError('Due date is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                // Update existing deal
                await api.put(`/deals/${editDeal.id}/`, {
                    customer_id: parseInt(selectedCustomer),
                    description: description.trim(),
                    amount: parseFloat(amount),
                    due_date: dueDate
                });
            } else {
                // Create new deal
                await api.post('/deals/', {
                    customer_id: parseInt(selectedCustomer),
                    description: description.trim(),
                    amount: parseFloat(amount),
                    due_date: dueDate
                });
            }

            // Show success message
            setSuccess(true);

            // Reset form
            setSelectedCustomer('');
            setDescription('');
            setAmount('');
            setDueDate('');

            // Close modal after short delay
            setTimeout(() => {
                handleClose();
                setSuccess(false);
                // Refresh dashboard data if callback provided
                if (refreshData) refreshData();
            }, 1500);

        } catch (err) {
            console.error(isEdit ? 'Failed to update deal:' : 'Failed to create deal:', err);
            if (err.response && err.response.data) {
                if (err.response.data.customer_id) {
                    setError(err.response.data.customer_id[0]);
                } else if (err.response.data.description) {
                    setError(err.response.data.description[0]);
                } else if (err.response.data.amount) {
                    setError(err.response.data.amount[0]);
                } else if (err.response.data.due_date) {
                    setError(err.response.data.due_date[0]);
                } else {
                    setError('Failed to create deal. Please try again.');
                }
            } else {
                setError('Network error. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        if (!loading) {
            setSelectedCustomer('');
            setDescription('');
            setAmount('');
            setDueDate('');
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
            PaperProps={{
                sx: {
                    backgroundColor: '#1E1E1E',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #444'
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {isEdit ? 'Edit Deal' : 'Create New Deal'}
                <IconButton aria-label="close" onClick={handleCloseModal} disabled={loading} sx={{ color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: '#444' }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7' }}>
                        Deal {isEdit ? 'updated' : 'created'} successfully!
                    </Alert>
                )}
                <Box component="form" noValidate autoComplete="off">
                    {/* Customer Dropdown */}
                    <TextField
                        select
                        autoFocus
                        margin="dense"
                        id="customer"
                        label="Customer"
                        fullWidth
                        variant="outlined"
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><PeopleIcon sx={{ color: '#9e9e9e' }} /></InputAdornment>),
                            sx: { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                        }}
                        InputLabelProps={{ sx: { color: '#9e9e9e' } }}
                    >
                        {customers.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Description */}
                    <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><DescriptionIcon sx={{ color: '#9e9e9e' }} /></InputAdornment>),
                            sx: { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                        }}
                        InputLabelProps={{ sx: { color: '#9e9e9e' } }}
                    />

                    {/* Amount */}
                    <TextField
                        margin="dense"
                        id="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><AttachMoneyIcon sx={{ color: '#9e9e9e' }} /></InputAdornment>),
                            sx: { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                        }}
                        InputLabelProps={{ sx: { color: '#9e9e9e' } }}
                    />

                    {/* Due Date */}
                    <TextField
                        margin="dense"
                        id="dueDate"
                        label="Due Date"
                        type="date"
                        fullWidth
                        variant="outlined"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        disabled={loading}
                        InputProps={{
                            inputProps: { min: today },
                            startAdornment: (<InputAdornment position="start"><CalendarTodayIcon sx={{ color: '#9e9e9e' }} /></InputAdornment>),
                            sx: { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                        }}
                        InputLabelProps={{ shrink: true, sx: { color: '#9e9e9e' } }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' }}>
                <Button
                    onClick={handleCloseModal}
                    disabled={loading}
                    sx={{ color: '#bdbdbd' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{
                        backgroundColor: loading ? '#666' : '#4F46E5',
                        '&:hover': { backgroundColor: loading ? '#666' : '#4338CA' }
                    }}
                >
                    {loading ? 'Saving...' : (isEdit ? 'Update Deal' : 'Save Deal')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
