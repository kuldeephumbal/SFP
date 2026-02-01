import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Grid,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        axios
            .post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password
            })
            .then((response) => {
                if (response.data.token) {
                    sessionStorage.setItem('token', response.data.token);
                    sessionStorage.setItem('user', JSON.stringify(response.data.user));
                    toast.success(response.data.message || 'Login successful!');

                    setTimeout(() => {
                        navigate('/admin/dashboard');
                    }, 1500);
                }
            })
            .catch((error) => {
                const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
                toast.error(message);
                console.error('Login error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    bgcolor: '#f5f5f5',
                    minHeight: '100vh',
                    py: { xs: 2, sm: 3, md: 4 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Container maxWidth="sm">
                    <Card
                        sx={{
                            boxShadow: 3,
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <Paper
                            sx={{
                                bgcolor: '#1976d2',
                                color: 'white',
                                py: 3,
                                px: 3,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                User Login
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Sign in to your account
                            </Typography>
                        </Paper>

                        {/* Form */}
                        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2.5}>
                                    {/* Email Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            name="email"
                                            type="email"
                                            label="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={Boolean(errors.email)}
                                            helperText={errors.email}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email sx={{ color: '#1976d2', mr: 1 }} />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: '#1976d2'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    {/* Password Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            label="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            error={Boolean(errors.password)}
                                            helperText={errors.password}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock sx={{ color: '#1976d2', mr: 1 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={togglePasswordVisibility}
                                                            edge="end"
                                                            disabled={loading}
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: '#1976d2'
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    {/* Submit Button */}
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            disabled={loading}
                                            sx={{
                                                py: 1.5,
                                                bgcolor: '#1976d2',
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: '#1565c0',
                                                    boxShadow: 3
                                                },
                                                '&:disabled': {
                                                    bgcolor: '#90caf9',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            {loading ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CircularProgress size={20} sx={{ color: 'white' }} />
                                                    Signing in...
                                                </Box>
                                            ) : (
                                                'Login'
                                            )}
                                        </Button>
                                    </Grid>

                                    {/* Forgot Password Link */}
                                    <Grid item xs={12}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="body2">
                                                <a
                                                    href="/forgot-password"
                                                    style={{
                                                        color: '#1976d2',
                                                        textDecoration: 'none',
                                                        fontWeight: 500,
                                                        transition: 'color 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => (e.target.style.color = '#1565c0')}
                                                    onMouseLeave={(e) => (e.target.style.color = '#1976d2')}
                                                >
                                                    Forgot Password?
                                                </a>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
            <Footer />
        </>
    );
}
