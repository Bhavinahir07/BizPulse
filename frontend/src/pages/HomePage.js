import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    AppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    Grid,
    TextField,
    Paper,
    CssBaseline,
    ThemeProvider,
    createTheme,
    useMediaQuery,
    Divider,
    Card,
    CardContent,
    CardActions,
    Chip,
    Avatar,
    Fade,
    Slide,
    useScrollTrigger,
    Fab,
    Zoom,
} from '@mui/material';
import logo from '../assets/logo.png';
import officeImage from '../assets/office.jpg';
import MenuIcon from '@mui/icons-material/Menu';
import PaymentsIcon from '@mui/icons-material/Payments';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SpeedIcon from '@mui/icons-material/Speed';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Define a modern theme with gradient backgrounds
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#ff6b35',
            light: '#ff8a65',
            dark: '#e64a19',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#666666',
        },
        gradient: {
            primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2.8rem',
            fontWeight: 700,
            marginBottom: '2rem',
        },
        h3: {
            fontSize: '1.8rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.4rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1.1rem',
            lineHeight: 1.7,
        },
        body2: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    padding: '12px 24px',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15)',
                        transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                    },
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }
            }
        }
    },
});

// Scroll to top component
function ScrollTop(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
        if (anchor) {
            anchor.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <Zoom in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                {children}
            </Box>
        </Zoom>
    );
}

// Main App Component
export default function App() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    // Contact form state
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const aboutRef = useRef(null);
    const contactRef = useRef(null);
    const testimonialsRef = useRef(null);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
        setMobileOpen(false);
    };

    // Contact form handlers
    const handleContactFormChange = (field) => (event) => {
        setContactForm(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleContactFormSubmit = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.subject.trim() || !contactForm.message.trim()) {
            setFormMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactForm.email)) {
            setFormMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setFormLoading(true);
        setFormMessage({ type: '', text: '' });

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/contact/', {
                name: contactForm.name.trim(),
                email: contactForm.email.trim(),
                subject: contactForm.subject.trim(),
                message: contactForm.message.trim()
            });

            if (response.data.success) {
                setFormMessage({ type: 'success', text: response.data.message });
                setContactForm({ name: '', email: '', subject: '', message: '' }); // Clear form
            } else {
                setFormMessage({ type: 'error', text: response.data.error || 'Failed to send message.' });
            }
        } catch (error) {
            console.error('Contact form error:', error);
            if (error.response?.data?.error) {
                setFormMessage({ type: 'error', text: error.response.data.error });
            } else {
                setFormMessage({ type: 'error', text: 'Failed to send message. Please try again later.' });
            }
        } finally {
            setFormLoading(false);
        }
    };

    const navItems = [
        { text: 'Features', ref: featuresRef },
        { text: 'About Us', ref: aboutRef },
        { text: 'Testimonials', ref: testimonialsRef },
        { text: 'Contact', ref: contactRef },
    ];

    const drawer = (
        <Box sx={{ textAlign: 'center', minHeight: '100vh', background: theme.palette.gradient.primary }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6" sx={{ my: 2, color: 'white', fontWeight: 'bold' }}>
                    BizPulse
                </Typography>
                <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            sx={{
                                textAlign: 'center',
                                color: 'white',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                            }}
                            onClick={() => scrollToSection(item.ref)}
                        >
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton
                        sx={{
                            textAlign: 'center',
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                        onClick={() => navigate('/signup')}
                    >
                        <ListItemText primary="Sign In" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Enhanced Navigation Bar */}
                <AppBar
                    component="nav"
                    position="sticky"
                    elevation={0}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 1.5,
                            px: { xs: 0, md: 2 }
                        }}>
                            {/* Left Side: Enhanced Logo and Brand */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexShrink: 0
                            }}>
                                <Box sx={{
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -4,
                                        left: -4,
                                        right: -4,
                                        bottom: -4,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '50%',
                                        opacity: 0.1,
                                        zIndex: 0,
                                    }
                                }}>
                                    <Box
                                        component="img"
                                        src={logo}
                                        alt="BizPulse Logo"
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '12px',
                                            position: 'relative',
                                            zIndex: 1,
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        sx={{
                                            fontWeight: 800,
                                            color: 'text.primary',
                                            letterSpacing: '-0.02em',
                                            lineHeight: 1.2
                                        }}
                                    >
                                        BizPulse
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}
                                    >
                                        Business CRM
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Center: Enhanced Navigation Links (Desktop) */}
                            <Box sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                gap: 1,
                                mx: 4
                            }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.text}
                                        onClick={() => scrollToSection(item.ref)}
                                        sx={{
                                            color: 'text.primary',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            px: 2.5,
                                            py: 1.2,
                                            borderRadius: '25px',
                                            textTransform: 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                zIndex: -1,
                                            },
                                            '&:hover': {
                                                color: 'white',
                                                transform: 'translateY(-2px)',
                                                '&::before': {
                                                    opacity: 1,
                                                }
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {item.text}
                                    </Button>
                                ))}
                            </Box>

                            {/* Right Side: Enhanced CTA Button & Mobile Menu */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                flexShrink: 0
                            }}>
                                <Button
                                    variant="contained"
                                    startIcon={<LoginIcon />}
                                    onClick={() => navigate('/signup')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        px: 3,
                                        py: 1.3,
                                        borderRadius: '25px',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Sign Up
                                </Button>

                                <IconButton
                                    aria-label="open drawer"
                                    edge="end"
                                    onClick={handleDrawerToggle}
                                    sx={{
                                        display: { md: 'none' },
                                        color: 'text.primary',
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                        }
                                    }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Mobile Navigation Drawer */}
                <nav>
                    <Drawer
                        anchor="right"
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: 280,
                                background: theme.palette.gradient.primary,
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>
                </nav>

                {/* Main Content */}
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <Toolbar />

                    {/* Enhanced Hero Section */}
                    <Fade in={fadeIn} timeout={1000}>
                        <Box
                            ref={heroRef}
                            id="back-to-top-anchor"
                            sx={{
                                minHeight: '90vh',
                                display: 'flex',
                                alignItems: 'center',
                                textAlign: 'center',
                                background: `
                                    linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%),
                                    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                                    radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
                                `,
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                    opacity: 0.1,
                                    animation: 'float 20s ease-in-out infinite',
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '10%',
                                    left: '10%',
                                    width: '100px',
                                    height: '100px',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                    borderRadius: '50%',
                                    animation: 'pulse 4s ease-in-out infinite',
                                },
                                '@keyframes float': {
                                    '0%, 100%': { transform: 'translateY(0px)' },
                                    '50%': { transform: 'translateY(-20px)' },
                                },
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                                    '50%': { opacity: 0.6, transform: 'scale(1.2)' },
                                }
                            }}
                        >
                            <Container maxWidth="lg">
                                <Typography
                                    variant="h1"
                                    component="h1"
                                    sx={{
                                        mb: 4,
                                        color: 'white',
                                        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                        position: 'relative',
                                        zIndex: 1,
                                        fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                        fontWeight: 800,
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.1,
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Stop Chasing Payments.<br />
                                    <Box
                                        component="span"
                                        sx={{
                                            background: 'linear-gradient(135deg, #ffd700 0%, #ff6b35 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Start Growing.
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 6,
                                        maxWidth: '900px',
                                        mx: 'auto',
                                        opacity: 0.95,
                                        position: 'relative',
                                        zIndex: 1,
                                        fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                                        fontWeight: 400,
                                        lineHeight: 1.6,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    BizPulse is the lightweight CRM for small businesses that automates payment reminders and tracks deals, replacing messy spreadsheets and manual follow-ups.
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 3,
                                    mt: 4,
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    {/* Enhanced CTA Section */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 3,
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '20px',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                    }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 600,
                                                mr: 2
                                            }}
                                        >
                                            🚀 Ready to transform your business?
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={() => navigate('/signup')}
                                            sx={{
                                                background: 'linear-gradient(135deg, #ff6b35 0%, #f093fb 100%)',
                                                color: 'white',
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: '25px',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                textTransform: 'none',
                                                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #e55a2b 0%, #e785f0 100%)',
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)',
                                                },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            Start Free Trial
                                        </Button>
                                    </Box>

                                    {/* Trust Indicators */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        opacity: 0.8
                                    }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h3" sx={{ color: '#ffd700', fontWeight: 800 }}>
                                                10k+
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                Happy Users
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 800 }}>
                                                99.9%
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                Uptime
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h3" sx={{ color: '#2196f3', fontWeight: 800 }}>
                                                24/7
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                Support
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Container>
                        </Box>
                    </Fade>

                    {/* Enhanced Features Section */}
                    <Box ref={featuresRef} sx={{
                        py: { xs: 12, md: 18 },
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%)',
                        }
                    }}>
                        <Container maxWidth="lg">
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    textAlign: 'center',
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    fontWeight: 800,
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Everything You Need, Nothing You Don't
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: 'center',
                                    mb: 10,
                                    color: 'text.secondary',
                                    maxWidth: '700px',
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                    lineHeight: 1.6,
                                    fontWeight: 400,
                                }}
                            >
                                Powerful features designed specifically for small businesses and freelancers
                            </Typography>
                            <Grid container spacing={4}>
                                {[
                                    {
                                        icon: <PaymentsIcon sx={{ fontSize: 60 }} />,
                                        title: 'Automated Reminders',
                                        description: 'Set up automatic payment reminders for your clients and get paid on time, every time. Never miss a payment again.',
                                        color: '#10b981',
                                        bgColor: 'rgba(16, 185, 129, 0.05)',
                                        borderColor: 'rgba(16, 185, 129, 0.2)'
                                    },
                                    {
                                        icon: <TrackChangesIcon sx={{ fontSize: 60 }} />,
                                        title: 'Simple Deal Tracking',
                                        description: 'Visualize your sales pipeline and track deals from lead to close with an intuitive drag-and-drop interface.',
                                        color: '#3b82f6',
                                        bgColor: 'rgba(59, 130, 246, 0.05)',
                                        borderColor: 'rgba(59, 130, 246, 0.2)'
                                    },
                                    {
                                        icon: <SpeedIcon sx={{ fontSize: 60 }} />,
                                        title: 'Lightweight & Fast',
                                        description: 'No more bloated spreadsheets. Get a clear overview of your business in a clean, fast dashboard.',
                                        color: '#f59e0b',
                                        bgColor: 'rgba(245, 158, 11, 0.05)',
                                        borderColor: 'rgba(245, 158, 11, 0.2)'
                                    }
                                ].map((feature, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Card sx={{
                                            height: '100%',
                                            textAlign: 'center',
                                            p: 4,
                                            background: `linear-gradient(135deg, ${feature.bgColor} 0%, rgba(255,255,255,0.8) 100%)`,
                                            border: `2px solid ${feature.borderColor}`,
                                            borderRadius: '20px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: `0 20px 40px ${feature.borderColor.replace('0.2', '0.15')}`,
                                                '&::before': {
                                                    opacity: 1,
                                                }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: `linear-gradient(135deg, ${feature.color}08 0%, ${feature.color}05 100%)`,
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                zIndex: 0,
                                            }
                                        }}>
                                            <CardContent sx={{
                                                position: 'relative',
                                                zIndex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 2
                                            }}>
                                                <Box sx={{
                                                    color: feature.color,
                                                    mb: 2,
                                                    p: 2,
                                                    borderRadius: '50%',
                                                    background: `${feature.bgColor}`,
                                                    boxShadow: `0 8px 20px ${feature.borderColor.replace('0.2', '0.15')}`,
                                                }}>
                                                    {feature.icon}
                                                </Box>
                                                <Typography variant="h4" sx={{
                                                    mb: 2,
                                                    fontWeight: 700,
                                                    color: 'text.primary',
                                                    fontSize: { xs: '1.3rem', md: '1.5rem' }
                                                }}>
                                                    {feature.title}
                                                </Typography>
                                                <Typography color="text.secondary" sx={{
                                                    lineHeight: 1.6,
                                                    fontSize: { xs: '0.9rem', md: '1rem' }
                                                }}>
                                                    {feature.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </Box>

                    {/* Enhanced About Us Section */}
                    <Box ref={aboutRef} sx={{
                        py: { xs: 12, md: 18 },
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%)',
                        }
                    }}>
                        <Container maxWidth="lg">
                            <Grid container spacing={8} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <Box sx={{
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -20,
                                            left: -20,
                                            right: -20,
                                            bottom: -20,
                                            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
                                            borderRadius: '30px',
                                            zIndex: 0,
                                        }
                                    }}>
                                        <Typography
                                            variant="h2"
                                            component="h2"
                                            sx={{
                                                mb: 4,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                                fontWeight: 800,
                                                letterSpacing: '-0.02em',
                                                lineHeight: 1.2,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            Built for Small Businesses, by a Small Business
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            mb: 4,
                                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                            lineHeight: 1.7,
                                            color: 'text.secondary',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}>
                                            We understand the hustle. BizPulse was created out of our own need to simplify client management without the complexity and cost of enterprise CRM software. Our mission is to empower small businesses and freelancers to streamline their workflow, improve cash flow, and focus on what they do best.
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            mb: 6,
                                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                            lineHeight: 1.7,
                                            color: 'text.secondary',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}>
                                            Before BizPulse, our days were filled with scattered spreadsheets, endless calendar reminders, and the constant worry of a missed follow-up. We knew there had to be a better way to manage client relationships and track payments that didn't involve a steep learning curve or a hefty price tag.
                                        </Typography>

                                        {/* Enhanced Feature Chips */}
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 2,
                                            flexWrap: 'wrap',
                                            mt: 4,
                                            position: 'relative',
                                            zIndex: 1,
                                        }}>
                                            {[
                                                { icon: <BusinessIcon />, label: 'Small Business Focused', color: '#667eea' },
                                                { icon: <PeopleIcon />, label: 'User-Friendly Design', color: '#764ba2' },
                                                { icon: <TrendingUpIcon />, label: 'Growth-Oriented', color: '#f093fb' }
                                            ].map((chip, index) => (
                                                <Chip
                                                    key={index}
                                                    icon={chip.icon}
                                                    label={chip.label}
                                                    sx={{
                                                        background: `linear-gradient(135deg, ${chip.color}15 0%, ${chip.color}08 100%)`,
                                                        border: `2px solid ${chip.color}30`,
                                                        color: chip.color,
                                                        fontWeight: 600,
                                                        fontSize: '0.9rem',
                                                        px: 2,
                                                        py: 1,
                                                        borderRadius: '25px',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            background: `linear-gradient(135deg, ${chip.color}25 0%, ${chip.color}15 100%)`,
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: `0 8px 20px ${chip.color}25`,
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -10,
                                            left: -10,
                                            right: 10,
                                            bottom: 10,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '25px',
                                            opacity: 0.1,
                                            zIndex: 0,
                                        }
                                    }}>
                                        <Box
                                            component="img"
                                            src={officeImage}
                                            alt="BizPulse Office"
                                            sx={{
                                                width: '100%',
                                                height: { xs: 350, md: 450 },
                                                objectFit: 'cover',
                                                borderRadius: '20px',
                                                position: 'relative',
                                                zIndex: 1,
                                                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.02) rotate(1deg)',
                                                    boxShadow: '0 35px 70px rgba(0,0,0,0.2)',
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>

                    {/* Enhanced Testimonials Section */}
                    <Box ref={testimonialsRef} sx={{
                        py: { xs: 12, md: 18 },
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%)',
                        }
                    }}>
                        <Container maxWidth="lg">
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    textAlign: 'center',
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    fontWeight: 800,
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                What Our Customers Say
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: 'center',
                                    mb: 10,
                                    color: 'text.secondary',
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                    lineHeight: 1.6,
                                }}
                            >
                                Don't just take our word for it - hear from our satisfied customers
                            </Typography>

                            <Grid container spacing={4}>
                                {[
                                    {
                                        name: 'Sarah Johnson',
                                        role: 'Freelance Designer',
                                        content: 'BizPulse has completely transformed how I manage my clients. The automated reminders alone have increased my on-time payments by 80%.',
                                        rating: 5,
                                        avatarColor: '#667eea'
                                    },
                                    {
                                        name: 'Mike Chen',
                                        role: 'Small Business Owner',
                                        content: 'Finally, a CRM that doesn\'t overwhelm me with features I don\'t need. Simple, effective, and exactly what I was looking for.',
                                        rating: 5,
                                        avatarColor: '#764ba2'
                                    },
                                    {
                                        name: 'Emily Rodriguez',
                                        role: 'Consultant',
                                        content: 'The deal tracking feature is a game-changer. I can see my entire pipeline at a glance and never lose track of a potential client.',
                                        rating: 5,
                                        avatarColor: '#f093fb'
                                    }
                                ].map((testimonial, index) => (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Card sx={{
                                            height: '100%',
                                            p: 4,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                                            border: '2px solid rgba(102, 126, 234, 0.1)',
                                            borderRadius: '25px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 25px 50px rgba(102, 126, 234, 0.15)',
                                                border: '2px solid rgba(102, 126, 234, 0.2)',
                                                '&::before': {
                                                    opacity: 1,
                                                }
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: `linear-gradient(135deg, ${testimonial.avatarColor}08 0%, ${testimonial.avatarColor}05 100%)`,
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                zIndex: 0,
                                            },
                                            '&::after': {
                                                content: '"\\""',
                                                position: 'absolute',
                                                top: 20,
                                                right: 20,
                                                fontSize: '4rem',
                                                color: `${testimonial.avatarColor}20`,
                                                fontFamily: 'serif',
                                                lineHeight: 1,
                                                zIndex: 0,
                                            }
                                        }}>
                                            <CardContent sx={{
                                                position: 'relative',
                                                zIndex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 3
                                            }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    mb: 2,
                                                    justifyContent: 'center'
                                                }}>
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            sx={{
                                                                color: '#ffd700',
                                                                fontSize: 24,
                                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                                            }}
                                                        />
                                                    ))}
                                                </Box>

                                                <Typography variant="body1" sx={{
                                                    fontStyle: 'italic',
                                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                                    lineHeight: 1.6,
                                                    color: 'text.primary',
                                                    textAlign: 'center',
                                                    mb: 2
                                                }}>
                                                    "{testimonial.content}"
                                                </Typography>

                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 2,
                                                    mt: 'auto'
                                                }}>
                                                    <Avatar sx={{
                                                        bgcolor: testimonial.avatarColor,
                                                        width: 50,
                                                        height: 50,
                                                        boxShadow: `0 8px 20px ${testimonial.avatarColor}30`,
                                                    }}>
                                                        {testimonial.name.charAt(0)}
                                                    </Avatar>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="subtitle1" sx={{
                                                            fontWeight: 700,
                                                            color: 'text.primary',
                                                            fontSize: '1rem'
                                                        }}>
                                                            {testimonial.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{
                                                            color: 'text.secondary',
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            {testimonial.role}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                    </Box>

                    {/* Enhanced Contact Section */}
                    <Box ref={contactRef} sx={{
                        py: { xs: 12, md: 18 },
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%)',
                        }
                    }}>
                        <Container maxWidth="lg">
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    textAlign: 'center',
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    fontWeight: 800,
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Get In Touch
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: 'center',
                                    mb: 10,
                                    color: 'text.secondary',
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                                    lineHeight: 1.6,
                                }}
                            >
                                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </Typography>

                            <Grid container spacing={6}>
                                <Grid item xs={12} md={8}>
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
                                        border: '2px solid rgba(102, 126, 234, 0.1)',
                                        borderRadius: '25px',
                                        p: { xs: 3, md: 5 },
                                        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23667eea" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                            opacity: 0.5,
                                        }
                                    }}>
                                        <form onSubmit={handleContactFormSubmit}>
                                            {/* Form Message Display */}
                                            {formMessage.text && (
                                                <Box sx={{
                                                    mb: 3,
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    backgroundColor: formMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    border: `1px solid ${formMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                                    color: formMessage.type === 'success' ? 'success.main' : 'error.main',
                                                    textAlign: 'center'
                                                }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {formMessage.text}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Your Name"
                                                        variant="outlined"
                                                        required
                                                        value={contactForm.name}
                                                        onChange={handleContactFormChange('name')}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '15px',
                                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                                '& fieldset': {
                                                                    borderColor: 'rgba(102, 126, 234, 0.2)',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'rgba(102, 126, 234, 0.4)',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#667eea',
                                                                    borderWidth: '2px',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Your Email"
                                                        type="email"
                                                        variant="outlined"
                                                        required
                                                        value={contactForm.email}
                                                        onChange={handleContactFormChange('email')}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '15px',
                                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                                '& fieldset': {
                                                                    borderColor: 'rgba(102, 126, 234, 0.2)',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'rgba(102, 126, 234, 0.4)',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#667eea',
                                                                    borderWidth: '2px',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Subject"
                                                        variant="outlined"
                                                        required
                                                        value={contactForm.subject}
                                                        onChange={handleContactFormChange('subject')}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '15px',
                                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                                '& fieldset': {
                                                                    borderColor: 'rgba(102, 126, 234, 0.2)',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'rgba(102, 126, 234, 0.4)',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#667eea',
                                                                    borderWidth: '2px',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Message"
                                                        multiline
                                                        rows={5}
                                                        variant="outlined"
                                                        required
                                                        value={contactForm.message}
                                                        onChange={handleContactFormChange('message')}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '15px',
                                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                                '& fieldset': {
                                                                    borderColor: 'rgba(102, 126, 234, 0.2)',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'rgba(102, 126, 234, 0.4)',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: '#667eea',
                                                                    borderWidth: '2px',
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        size="large"
                                                        disabled={formLoading}
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            color: 'white',
                                                            px: 8,
                                                            py: 2,
                                                            borderRadius: '25px',
                                                            fontWeight: 600,
                                                            fontSize: '1.1rem',
                                                            textTransform: 'none',
                                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                                                transform: 'translateY(-3px)',
                                                                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                                                            },
                                                            '&:disabled': {
                                                                background: 'rgba(102, 126, 234, 0.6)',
                                                                color: 'rgba(255, 255, 255, 0.7)',
                                                            },
                                                            transition: 'all 0.3s ease',
                                                        }}
                                                    >
                                                        {formLoading ? 'Sending...' : 'Send Message'}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4,
                                        p: 3,
                                    }}>
                                        {[
                                            {
                                                icon: <EmailIcon sx={{ fontSize: 40, color: '#667eea' }} />,
                                                title: 'Email',
                                                content: 'hello@bizpulse.com',
                                                description: 'Send us an email anytime!'
                                            },
                                            {
                                                icon: <PhoneIcon sx={{ fontSize: 40, color: '#764ba2' }} />,
                                                title: 'Phone',
                                                content: '+1 (555) 123-4567',
                                                description: 'Mon-Fri from 8am to 6pm'
                                            },
                                            {
                                                icon: <LocationOnIcon sx={{ fontSize: 40, color: '#f093fb' }} />,
                                                title: 'Address',
                                                content: '123 Business St\nSuite 100\nNew York, NY 10001',
                                                description: 'Come say hello at our office'
                                            }
                                        ].map((item, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 3,
                                                    p: 3,
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.6) 100%)',
                                                    borderRadius: '20px',
                                                    border: '2px solid rgba(102, 126, 234, 0.1)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 15px 30px rgba(102, 126, 234, 0.15)',
                                                        border: '2px solid rgba(102, 126, 234, 0.2)',
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    p: 2,
                                                    borderRadius: '15px',
                                                    background: `linear-gradient(135deg, ${item.icon.props.color}15 0%, ${item.icon.props.color}08 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    {item.icon}
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" sx={{
                                                        fontWeight: 700,
                                                        color: 'text.primary',
                                                        mb: 1,
                                                        fontSize: '1.1rem'
                                                    }}>
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{
                                                        color: 'text.primary',
                                                        fontWeight: 600,
                                                        mb: 1,
                                                        lineHeight: 1.4,
                                                        whiteSpace: 'pre-line'
                                                    }}>
                                                        {item.content}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{
                                                        color: 'text.secondary',
                                                        fontSize: '0.85rem',
                                                        lineHeight: 1.4
                                                    }}>
                                                        {item.description}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </Box>
                </Box>

                {/* Footer */}
                <Box
                    component="footer"
                    sx={{
                        background: theme.palette.gradient.primary,
                        color: 'white',
                        py: 6
                    }}
                >
                    <Container maxWidth="lg">
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box
                                        component="img"
                                        src={logo}
                                        alt="BizPulse Logo"
                                        sx={{ width: 40, height: 40, mr: 1.5 }}
                                    />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        BizPulse
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                                    Empowering small businesses with simple, effective CRM solutions.
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                    © {new Date().getFullYear()} BizPulse. All rights reserved.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Quick Links
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {navItems.map((item) => (
                                        <Button
                                            key={item.text}
                                            onClick={() => scrollToSection(item.ref)}
                                            sx={{
                                                color: 'white',
                                                justifyContent: 'flex-start',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                }
                                            }}
                                        >
                                            {item.text}
                                        </Button>
                                    ))}
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Scroll to Top Button */}
                <ScrollTop>
                    <Fab
                        color="primary"
                        size="medium"
                        aria-label="scroll back to top"
                        sx={{
                            background: theme.palette.gradient.primary,
                            '&:hover': {
                                background: theme.palette.gradient.secondary,
                            }
                        }}
                    >
                        <KeyboardArrowUpIcon />
                    </Fab>
                </ScrollTop>
            </Box>
        </ThemeProvider>
    );
}
