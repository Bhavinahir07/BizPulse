import {
    AppBar, Box, Card, CardContent, Chip, Container, CssBaseline, Drawer, Grid, IconButton,
    List, ListItem, ListItemIcon, ListItemText, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Toolbar, Typography, SpeedDial, SpeedDialAction, SpeedDialIcon, Avatar,
    LinearProgress, Tooltip, Badge, Button, Tab, Tabs, Paper, Divider, Alert, Snackbar, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem, TextField
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon, Receipt as ReceiptIcon,
    QueryStats as QueryStatsIcon, Notifications as NotificationsIcon, Logout as LogoutIcon,
    PersonAdd, Add as AddIcon, TrendingUp, Warning, CheckCircle, Send as SendIcon,
    AttachMoney, ShoppingCart, Schedule, Assessment, AccountBalanceWallet,
    TrendingDown, ArrowUpward, ArrowDownward, Star, Refresh, FilterList, Search,
    Edit, Delete, Visibility, MoreVert, Close, Person as PersonIcon, Save as SaveIcon,
    Close as CloseIcon, Edit as EditIcon
} from '@mui/icons-material';
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddCustomerModal from '../components/AddCustomerModal';
import AddDealModal from '../components/AddDealModal';

// ====================== API CONFIGURATION ======================
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create an Axios instance to automatically include the auth token in every request.
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// User Context for managing user state
const UserContext = createContext();

// User Provider Component
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [businessProfile, setBusinessProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get user profile on mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('access');
            console.log('Token found:', !!token); // Debug: Check if token exists

            if (!token) {
                console.log('No token found, setting loading to false');
                setLoading(false);
                return;
            }

            console.log('Setting authorization header');
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            console.log('Fetching user profile from /user/profile/');
            // Fetch user profile
            const userResponse = await api.get('/user/profile/');
            console.log('User response:', userResponse.data);
            setUser(userResponse.data);

            console.log('Fetching business profile from /profile/');
            // Fetch business profile
            const profileResponse = await api.get('/profile/');
            console.log('Profile response:', profileResponse.data);
            setBusinessProfile(profileResponse.data);

        } catch (error) {
            console.error('Error fetching user profile:', error);
            console.error('Error response:', error.response?.data);
            if (error.response?.status === 401) {
                console.log('401 error, clearing tokens');
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const updateBusinessProfile = (updatedProfile) => {
        setBusinessProfile(updatedProfile);
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setUser(null);
        setBusinessProfile(null);
        window.location.href = '/';
    };

    return (
        <UserContext.Provider value={{
            user,
            businessProfile,
            loading,
            updateUser,
            updateBusinessProfile,
            logout,
            fetchUserProfile
        }}>
            {children}
        </UserContext.Provider>
    );
};

// User Dropdown Component
const UserDropdown = () => {
    const { user, businessProfile, logout } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        setProfileModalOpen(true);
        handleClose();
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

    if (!user) {
        return (
            <Button
                variant="contained"
                onClick={() => window.location.href = '/'}
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '25px',
                    px: 3
                }}
            >
                Login
            </Button>
        );
    }

    const displayName = businessProfile?.business_name || user?.username || 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                    onClick={handleClick}
                    sx={{
                        bgcolor: 'secondary.main',
                        width: 40,
                        height: 40,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'secondary.dark' }
                    }}
                >
                    {initials}
                </Avatar>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {displayName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user.email}
                    </Typography>
                </Box>
                <IconButton onClick={handleClick} sx={{ color: 'text.secondary' }}>
                    <MoreVert />
                </IconButton>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: 'rgba(26, 26, 46, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        mt: 1
                    }
                }}
            >
                <MenuItem onClick={handleProfileClick} sx={{ color: 'text.primary', py: 1.5 }}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Profile Settings
                        </Typography>
                    </ListItemText>
                </MenuItem>

                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                    </ListItemIcon>
                    <ListItemText>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Logout
                        </Typography>
                    </ListItemText>
                </MenuItem>
            </Menu>

            <ProfileModal
                open={profileModalOpen}
                onClose={() => setProfileModalOpen(false)}
                user={user}
                businessProfile={businessProfile}
            />
        </>
    );
};

// Profile Modal Component
const ProfileModal = ({ open, onClose, user, businessProfile }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    const { updateUser, updateBusinessProfile, fetchUserProfile } = useContext(UserContext);

    useEffect(() => {
        if (user || businessProfile) {
            setFormData({
                // User fields
                username: user?.username || '',
                email: user?.email || '',
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',

                // Business profile fields (only the ones that exist in the model)
                full_name: businessProfile?.full_name || '',
                business_name: businessProfile?.business_name || '',
                upi_id: businessProfile?.upi_id || '',
            });
        }
    }, [user, businessProfile]);

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update user profile
            if (user) {
                const userResponse = await api.put('/user/profile/', {
                    username: formData.username,
                    email: formData.email,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                });
                updateUser(userResponse.data);
            }

            // Update business profile (only the fields that exist in the model)
            if (businessProfile) {
                const profileResponse = await api.put('/profile/', {
                    full_name: formData.full_name,
                    business_name: formData.business_name,
                    upi_id: formData.upi_id,
                });
                updateBusinessProfile(profileResponse.data);
            }

            setEditMode(false);
            await fetchUserProfile();
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            full_name: businessProfile?.full_name || '',
            business_name: businessProfile?.business_name || '',
            upi_id: businessProfile?.upi_id || '',
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                }
            }}
        >
            <DialogTitle sx={{ color: 'text.primary', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Profile Settings
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                    <Tab label="User Profile" />
                    <Tab label="Business Profile" />
                </Tabs>

                {/* User Profile Tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={formData.username}
                                    onChange={handleInputChange('username')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={formData.first_name}
                                    onChange={handleInputChange('first_name')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={formData.last_name}
                                    onChange={handleInputChange('last_name')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Business Profile Tab */}
                {activeTab === 1 && (
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Business Name"
                                    value={formData.business_name}
                                    onChange={handleInputChange('business_name')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Business Type"
                                    value={formData.business_type}
                                    onChange={handleInputChange('business_type')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={formData.phone}
                                    onChange={handleInputChange('phone')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    value={formData.address}
                                    onChange={handleInputChange('address')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={formData.city}
                                    onChange={handleInputChange('city')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={formData.state}
                                    onChange={handleInputChange('state')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="ZIP Code"
                                    value={formData.zip_code}
                                    onChange={handleInputChange('zip_code')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Website"
                                    value={formData.website}
                                    onChange={handleInputChange('website')}
                                    disabled={!editMode}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputBase-input': { color: 'text.primary' },
                                        '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                {!editMode ? (
                    <Button
                        onClick={() => setEditMode(true)}
                        variant="contained"
                        startIcon={<EditIcon />}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '25px',
                            px: 4
                        }}
                    >
                        Edit Profile
                    </Button>
                ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            onClick={handleCancel}
                            variant="outlined"
                            sx={{
                                borderColor: 'text.secondary',
                                color: 'text.secondary',
                                borderRadius: '25px',
                                px: 4,
                                '&:hover': {
                                    borderColor: 'text.primary',
                                    backgroundColor: 'rgba(255,255,255,0.05)'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            disabled={saving}
                            startIcon={<SaveIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                borderRadius: '25px',
                                px: 4,
                                '&:disabled': {
                                    background: 'rgba(16, 185, 129, 0.6)',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                }
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                )}
            </DialogActions>
        </Dialog>
    );
};

// ====================== BEAUTIFUL THEME ======================
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#6366f1' },
        secondary: { main: '#ec4899' },
        background: { default: '#0f0f23', paper: '#1a1a2e' },
        text: { primary: '#ffffff', secondary: '#a8a8ff' },
        success: { main: '#10b981' },
        warning: { main: '#f59e0b' },
        error: { main: '#ef4444' },
        info: { main: '#3b82f6' },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h3: { fontWeight: 800, letterSpacing: '-0.02em' },
        h4: { fontWeight: 700 },
        h6: { fontWeight: 600 },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 35, 0.9) 100%)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600,
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: 48,
                    '&.Mui-selected': {
                        color: '#6366f1',
                    }
                }
            }
        }
    },
});

const drawerWidth = 280;

// ====================== DASHBOARD2 COMPONENT ======================
export default function Dashboard2() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Modal states
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [dealModalOpen, setDealModalOpen] = useState(false);

    // Edit state
    const [editCustomer, setEditCustomer] = useState(null);
    const [editDeal, setEditDeal] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Data states
    const [deals, setDeals] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const navigate = useNavigate();

    // Data fetching
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [dealsResponse, customersResponse] = await Promise.all([
                api.get('/deals/'),
                api.get('/customers/')
            ]);
            setDeals(dealsResponse.data);
            setCustomers(customersResponse.data);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Could not load dashboard data. Please try again.");
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    // Modal handlers
    const handleOpenCustomerModal = () => {
        setIsEditMode(false);
        setEditCustomer(null);
        setCustomerModalOpen(true);
    };
    const handleCloseCustomerModal = () => {
        setCustomerModalOpen(false);
        setEditCustomer(null);
        setIsEditMode(false);
    };
    const handleOpenDealModal = () => {
        setIsEditMode(false);
        setEditDeal(null);
        setDealModalOpen(true);
    };
    const handleCloseDealModal = () => {
        setDealModalOpen(false);
        setEditDeal(null);
        setIsEditMode(false);
    };

    // Delete handlers
    const handleDeleteCustomer = async (customerId) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await api.delete(`/customers/${customerId}/`);
                setSnackbar({ open: true, message: 'Customer deleted successfully!', severity: 'success' });
                fetchData();
            } catch (err) {
                console.error('Failed to delete customer:', err);
                setSnackbar({ open: true, message: 'Failed to delete customer. Please try again.', severity: 'error' });
            }
        }
    };

    const handleDeleteDeal = async (dealId) => {
        if (window.confirm('Are you sure you want to delete this deal?')) {
            try {
                await api.delete(`/deals/${dealId}/`);
                setSnackbar({ open: true, message: 'Deal deleted successfully!', severity: 'success' });
                fetchData();
            } catch (err) {
                console.error('Failed to delete deal:', err);
                setSnackbar({ open: true, message: 'Failed to delete deal. Please try again.', severity: 'error' });
            }
        }
    };

    // Edit handlers (basic implementation)
    const handleEditCustomer = (customerId) => {
        const customer = customers.find(c => c.id === customerId);
        setEditCustomer(customer);
        setIsEditMode(true);
        setCustomerModalOpen(true);
    };

    const handleEditDeal = (dealId) => {
        const deal = deals.find(d => d.id === dealId);
        setEditDeal(deal);
        setIsEditMode(true);
        setDealModalOpen(true);
    };

    // Reminder handler
    const handleSendReminder = async (dealId) => {
        try {
            const response = await api.post(`/deals/${dealId}/send_reminder/`);
            setSnackbar({ open: true, message: response.data.success || 'Reminder sent successfully!', severity: 'success' });
        } catch (err) {
            console.error('Failed to send reminder:', err);
            setSnackbar({ open: true, message: err.response?.data?.error || 'Failed to send reminder. Please try again.', severity: 'error' });
        }
    };

    // Drawer toggle
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    // Calculate KPIs
    const totalRevenue = deals.filter(d => d.status === 'Paid').reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const pendingValue = deals.filter(d => d.status === 'Pending').reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const conversionRate = deals.length > 0 ? (deals.filter(d => d.status === 'Paid').length / deals.length) * 100 : 0;

    // Chart data
    const monthlyData = deals.reduce((acc, deal) => {
        const month = new Date(deal.due_date).toLocaleString('default', { month: 'short' });
        if (!acc[month]) acc[month] = { name: month, revenue: 0, deals: 0 };
        if (deal.status === 'Paid') acc[month].revenue += parseFloat(deal.amount);
        acc[month].deals += 1;
        return acc;
    }, {});
    const chartData = Object.values(monthlyData);

    // Priority accounts (overdue deals)
    const today = new Date();
    const priorityAccounts = deals
        .filter(d => d.status === 'Pending' && new Date(d.due_date) < today)
        .map(d => {
            const daysOverdue = Math.floor((today - new Date(d.due_date)) / (1000 * 60 * 60 * 24));
            return {...d, daysOverdue};
        })
        .sort((a, b) => b.daysOverdue - a.daysOverdue);

    // Drawer content
    const drawer = (
        <Box sx={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)',
            height: '100%',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Toolbar sx={{ px: 3, py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        BP
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                            BizPulse
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Business Dashboard
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>

            <List sx={{ px: 2, flexGrow: 1 }}>
                {[
                    { text: 'Overview', icon: <DashboardIcon />, active: activeTab === 0, badge: null },
                    { text: 'Customers', icon: <PeopleIcon />, active: activeTab === 1, badge: customers.length },
                    { text: 'Deals', icon: <ReceiptIcon />, active: activeTab === 2, badge: deals.length },
                    { text: 'Analytics', icon: <QueryStatsIcon />, active: activeTab === 3, badge: null },
                ].map((item, index) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => setActiveTab(index)}
                        sx={{
                            borderRadius: 3,
                            mb: 1,
                            mx: 1,
                            backgroundColor: item.active ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                            color: item.active ? 'primary.main' : 'text.secondary',
                            '&:hover': {
                                backgroundColor: item.active ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.1)',
                                transform: 'translateX(4px)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                            {item.badge ? (
                                <Badge badgeContent={item.badge} color="error">
                                    {item.icon}
                                </Badge>
                            ) : (
                                item.icon
                            )}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>

            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        color: 'error.main',
                        borderColor: 'error.main',
                        '&:hover': {
                            borderColor: 'error.main',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)'
                        }
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    // Tab panels
    const renderTabContent = () => {
        switch (activeTab) {
            case 0: // Overview
                return (
                    <>
                        {/* KPI Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} lg={3}>
                                <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Box sx={{ width: 56, height: 56, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                                                <TrendingUp />
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ArrowUpward sx={{ fontSize: 16 }} />
                                                    +12.5%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    vs last month
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: 'white' }}>
                                            ₹{totalRevenue.toLocaleString('en-IN')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                                            Total Revenue
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
                                <Card sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Box sx={{ width: 56, height: 56, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                                                <PeopleIcon />
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ArrowUpward sx={{ fontSize: 16 }} />
                                                    +8.2%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    vs last month
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: 'white' }}>
                                            {customers.length}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                                            Active Customers
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
                                <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Box sx={{ width: 56, height: 56, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                                                <Warning />
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ArrowDownward sx={{ fontSize: 16 }} />
                                                    -2.1%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    vs last month
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: 'white' }}>
                                            ₹{pendingValue.toLocaleString('en-IN')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                                            Pending Invoices
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
                                <Card sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Box sx={{ width: 56, height: 56, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                                                <CheckCircle />
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ArrowUpward sx={{ fontSize: 16 }} />
                                                    +5.7%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                    vs last month
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, color: 'white' }}>
                                            {conversionRate.toFixed(1)}%
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                                            Conversion Rate
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Charts and Tables */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={8}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Revenue Trend
                                            </Typography>
                                            <Chip label="↗ +18.2% Growth" sx={{ backgroundColor: 'success.main', color: 'white', fontWeight: 600 }} />
                                        </Box>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(26, 26, 46, 0.9)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 12
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#10b981"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorRevenue)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} lg={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                            Priority Accounts
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip label={`${priorityAccounts.length} Overdue`} sx={{ backgroundColor: 'error.main', color: 'white', fontWeight: 600 }} />
                                        </Box>
                                        <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
                                            {priorityAccounts.slice(0, 5).map((account) => (
                                                <Box
                                                    key={account.id}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        p: 2,
                                                        mb: 2,
                                                        borderRadius: 3,
                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                                                    }}
                                                >
                                                    <Avatar sx={{
                                                        bgcolor: 'error.main',
                                                        width: 40,
                                                        height: 40,
                                                        mr: 2,
                                                        fontWeight: 'bold',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {account.customer?.name?.charAt(0) || 'C'}
                                                    </Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {account.customer?.name || 'Unknown Customer'}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                            ₹{parseFloat(account.amount).toLocaleString('en-IN')} • {account.daysOverdue} days overdue
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                );

            case 1: // Customers
                return (
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    All Customers ({customers.length})
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button startIcon={<Refresh />} size="small" onClick={fetchData}>
                                        Refresh
                                    </Button>
                                    <Button startIcon={<PersonAdd />} variant="contained" onClick={handleOpenCustomerModal}>
                                        Add Customer
                                    </Button>
                                </Box>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Name</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Contact</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Deals</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customers.map((customer) => (
                                            <TableRow key={customer.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                            {customer.name.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {customer.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        {customer.email || customer.phone_number || 'No contact info'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {deals.filter(d => d.customer?.id === customer.id).length}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Active" size="small" sx={{ backgroundColor: 'success.main', color: 'white' }} />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => handleEditCustomer(customer.id)}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => handleDeleteCustomer(customer.id)}>
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                );

            case 2: // Deals
                return (
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    All Deals ({deals.length})
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button startIcon={<Refresh />} size="small" onClick={fetchData}>
                                        Refresh
                                    </Button>
                                    <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpenDealModal}>
                                        Add Deal
                                    </Button>
                                </Box>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Customer</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Amount</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Due Date</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {deals.map((deal) => (
                                            <TableRow key={deal.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                                            {deal.customer?.name?.charAt(0) || 'C'}
                                                        </Avatar>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {deal.customer?.name || 'Unknown Customer'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        ₹{parseFloat(deal.amount).toLocaleString('en-IN')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        {new Date(deal.due_date).toLocaleDateString('en-GB')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={deal.status}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: deal.status === 'Paid' ? 'success.main' : 'warning.main',
                                                            color: 'white',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton size="small" sx={{ color: 'primary.main' }} onClick={() => handleEditDeal(deal.id)}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => handleDeleteDeal(deal.id)}>
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                    <Tooltip title="Send Reminder">
                                                        <IconButton size="small" sx={{ color: 'secondary.main' }} onClick={() => handleSendReminder(deal.id)}>
                                                            <SendIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                );

            case 3: // Analytics
                // Calculate advanced analytics data
                const customerAnalytics = customers.reduce((acc, customer) => {
                    const customerDeals = deals.filter(d => d.customer?.id === customer.id);
                    const totalValue = customerDeals.reduce((sum, deal) => sum + parseFloat(deal.amount || 0), 0);
                    const paidDeals = customerDeals.filter(d => d.status === 'Paid').length;

                    acc.push({
                        name: customer.name,
                        totalValue,
                        dealCount: customerDeals.length,
                        conversionRate: customerDeals.length > 0 ? (paidDeals / customerDeals.length) * 100 : 0,
                        avgDealSize: customerDeals.length > 0 ? totalValue / customerDeals.length : 0
                    });
                    return acc;
                }, []).sort((a, b) => b.totalValue - a.totalValue);

                const paymentStatusData = [
                    { name: 'Paid', value: deals.filter(d => d.status === 'Paid').length, color: '#10b981' },
                    { name: 'Pending', value: deals.filter(d => d.status === 'Pending').length, color: '#f59e0b' },
                    { name: 'Overdue', value: priorityAccounts.length, color: '#ef4444' }
                ];

                const monthlyGrowthData = deals.reduce((acc, deal) => {
                    const month = new Date(deal.due_date).toLocaleString('default', { month: 'short', year: 'numeric' });
                    if (!acc[month]) {
                        acc[month] = { name: month, revenue: 0, deals: 0, customers: 0 };
                    }
                    if (deal.status === 'Paid') {
                        acc[month].revenue += parseFloat(deal.amount);
                    }
                    acc[month].deals += 1;
                    return acc;
                }, {});

                const growthChartData = Object.values(monthlyGrowthData).slice(-6); // Last 6 months

                return (
                    <Box>
                        {/* Analytics Header */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                                📊 Advanced Analytics
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                                Deep insights into your business performance and growth trends
                            </Typography>
                        </Box>

                        {/* KPI Summary Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} lg={3}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    borderRadius: 3
                                }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                            ₹{totalRevenue.toLocaleString('en-IN')}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Total Revenue (All Time)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    color: 'white',
                                    borderRadius: 3
                                }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                            {customerAnalytics.length > 0 ? `₹${Math.round(customerAnalytics[0]?.avgDealSize || 0).toLocaleString('en-IN')}` : '₹0'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Avg Deal Value
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    color: 'white',
                                    borderRadius: 3
                                }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                            {conversionRate.toFixed(1)}%
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Conversion Rate
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                    color: 'white',
                                    borderRadius: 3
                                }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                                            {customerAnalytics.length}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Active Customers
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Charts Section */}
                        <Grid container spacing={3}>
                            {/* Revenue Growth Chart */}
                            <Grid item xs={12} lg={8}>
                                <Card sx={{ borderRadius: 3 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                📈 Revenue Growth Trend
                                            </Typography>
                                            <Chip
                                                label={`+${((growthChartData[growthChartData.length - 1]?.revenue || 0) / (growthChartData[0]?.revenue || 1) - 1) * 100 > 0 ?
                                                    '+' : ''}${(((growthChartData[growthChartData.length - 1]?.revenue || 0) / (growthChartData[0]?.revenue || 1) - 1) * 100).toFixed(1)}% Growth`}
                                                sx={{
                                                    backgroundColor: ((growthChartData[growthChartData.length - 1]?.revenue || 0) / (growthChartData[0]?.revenue || 1) - 1) * 100 > 0 ? 'success.main' : 'error.main',
                                                    color: 'white',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={growthChartData}>
                                                <defs>
                                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(26, 26, 46, 0.9)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 12
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#667eea"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                                                    activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Payment Status Distribution */}
                            <Grid item xs={12} lg={4}>
                                <Card sx={{ borderRadius: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                            💳 Payment Status
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={paymentStatusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {paymentStatusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <Box sx={{ mt: 2 }}>
                                            {paymentStatusData.map((item, index) => (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color }} />
                                                        <Typography variant="body2">{item.name}</Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {item.value}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Top Customers */}
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ borderRadius: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                            👑 Top Performing Customers
                                        </Typography>
                                        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                            {customerAnalytics.slice(0, 5).map((customer, index) => (
                                                <Box
                                                    key={customer.name}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        p: 2,
                                                        mb: 2,
                                                        borderRadius: 2,
                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                                                    }}
                                                >
                                                    <Avatar sx={{
                                                        bgcolor: `hsl(${index * 60}, 70%, 50%)`,
                                                        width: 40,
                                                        height: 40,
                                                        mr: 2,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        #{index + 1}
                                                    </Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {customer.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                            {customer.dealCount} deals • {customer.conversionRate.toFixed(1)}% conversion
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                                                            ₹{customer.totalValue.toLocaleString('en-IN')}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            Total Value
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Deal Size Distribution */}
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ borderRadius: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                            📊 Deal Size Analysis
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={[
                                                { range: '₹0-10k', count: deals.filter(d => parseFloat(d.amount) <= 10000).length },
                                                { range: '₹10k-50k', count: deals.filter(d => parseFloat(d.amount) > 10000 && parseFloat(d.amount) <= 50000).length },
                                                { range: '₹50k-100k', count: deals.filter(d => parseFloat(d.amount) > 50000 && parseFloat(d.amount) <= 100000).length },
                                                { range: '₹100k+', count: deals.filter(d => parseFloat(d.amount) > 100000).length }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" />
                                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                                <RechartsTooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(26, 26, 46, 0.9)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 12
                                                    }}
                                                />
                                                <Bar dataKey="count" fill="#667eea" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Summary Statistics */}
                        <Grid container spacing={3} sx={{ mt: 3 }}>
                            <Grid item xs={12} md={4}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    borderRadius: 3
                                }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main', mb: 1 }}>
                                            {Math.round((deals.filter(d => d.status === 'Paid').length / deals.length) * 100)}%
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Payment Success Rate
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    borderRadius: 3
                                }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main', mb: 1 }}>
                                            ₹{Math.round(pendingValue / Math.max(deals.filter(d => d.status === 'Pending').length, 1)).toLocaleString('en-IN')}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Avg Pending Amount
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Card sx={{
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    borderRadius: 3
                                }}>
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                                            {Math.round(totalRevenue / Math.max(customers.length, 1)).toLocaleString('en-IN')}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Revenue per Customer
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <UserProvider>
            <ThemeProvider theme={theme}>
                <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' }}>
                    <CssBaseline />

                    {/* App Bar */}
                    <AppBar position="fixed" sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                        background: 'rgba(15, 15, 35, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Welcome back! 👋
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Here's what's happening with your business today
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Tooltip title="Notifications">
                                    <IconButton sx={{ color: 'text.secondary' }}>
                                        <Badge badgeContent={priorityAccounts.length} color="error">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>

                                <UserDropdown />
                            </Box>
                        </Toolbar>
                    </AppBar>

                    {/* Navigation Drawer */}
                    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                        <Drawer
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{ keepMounted: true }}
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                            }}
                        >
                            {drawer}
                        </Drawer>
                        <Drawer
                            variant="permanent"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' }
                            }}
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Box>

                    {/* Main Content */}
                    <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                        <Toolbar />

                        <Container maxWidth="xl">
                            {/* Tab Navigation */}
                            <Paper sx={{ mb: 3, backgroundColor: 'rgba(26, 26, 46, 0.8)', borderRadius: 3 }}>
                                <Tabs
                                    value={activeTab}
                                    onChange={(e, newValue) => setActiveTab(newValue)}
                                    variant="fullWidth"
                                    sx={{
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: 'primary.main',
                                            height: 3,
                                            borderRadius: 1.5
                                        }
                                    }}
                                >
                                    <Tab label="Overview" />
                                    <Tab label={`Customers (${customers.length})`} />
                                    <Tab label={`Deals (${deals.length})`} />
                                    <Tab label="Analytics" />
                                </Tabs>
                            </Paper>

                            {/* Tab Content */}
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                                    <CircularProgress />
                                </Box>
                            ) : error ? (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            ) : (
                                renderTabContent()
                            )}
                        </Container>
                    </Box>

                    {/* Floating Action Button */}
                    <SpeedDial
                        ariaLabel="Quick Actions"
                        sx={{ position: 'fixed', bottom: 32, right: 32 }}
                        icon={<SpeedDialIcon sx={{ color: 'white' }} />}
                        FabProps={{
                            sx: {
                                bgcolor: 'primary.main',
                                '&:hover': { bgcolor: 'primary.dark' },
                                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                                width: 56,
                                height: 56
                            }
                        }}
                    >
                        {[
                            {
                                icon: <PersonAdd />,
                                name: 'Add Customer',
                                onClick: handleOpenCustomerModal
                            },
                            {
                                icon: <ReceiptIcon />,
                                name: 'Add Deal',
                                onClick: handleOpenDealModal
                            },
                        ].map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={action.onClick}
                                sx={{
                                    bgcolor: 'secondary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'secondary.dark' }
                                }}
                            />
                        ))}
                    </SpeedDial>
                    {/* Modal Components */}
                    <AddCustomerModal
                        open={customerModalOpen}
                        handleClose={handleCloseCustomerModal}
                        refreshData={fetchData}
                        editCustomer={editCustomer}
                        isEdit={isEditMode}
                    />
                    <AddDealModal
                        open={dealModalOpen}
                        handleClose={handleCloseDealModal}
                        customers={customers}
                        refreshData={fetchData}
                        editDeal={editDeal}
                        isEdit={isEditMode}
                    />

                    {/* Snackbar for notifications */}
                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={4000}
                    >
                        <Alert
                            onClose={() => setSnackbar({ ...snackbar, open: false })}
                            severity={snackbar.severity}
                            sx={{ width: '100%' }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Box>
            </ThemeProvider>
        </UserProvider>
    );
}