import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Grid,
    Typography,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        topic: '',
        description: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile Number is required';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile Number must be 10 digits';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.topic.trim()) {
            newErrors.topic = 'Topic is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const data = {
                name: formData.name,
                mobile_number: formData.mobile,
                email: formData.email,
                topic: formData.topic,
                description: formData.description,
            };

            axios.post('http://localhost:5000/api/add-contact-us', data)
                .then((response) => {
                    toast.success('Contact submitted successfully!');
                    setFormData({
                        name: '',
                        mobile: '',
                        email: '',
                        topic: '',
                        description: '',
                    });
                })
                .catch((error) => {
                    console.error('Error submitting contact:', error);
                    toast.error('Error submitting contact. Please try again.');
                });
        }
    };

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
                        {/* Header */}
                        <Box
                            sx={{
                                backgroundColor: '#1976d2',
                                color: 'white',
                                textAlign: 'center',
                                py: { xs: 1.5, sm: 2 },
                                mb: 4,
                                borderRadius: 0,
                                mx: { xs: -3, md: -4 },
                                mt: { xs: -3, md: -4 },
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                Contact Us
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                {/* Name */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Name *"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Mobile Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Mobile No. *"
                                        name="mobile"
                                        placeholder="Enter your mobile number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        error={!!errors.mobile}
                                        helperText={errors.mobile}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Email */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        type="email"
                                        label="Email *"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Topic */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Topic *"
                                        name="topic"
                                        placeholder="Enter topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        error={!!errors.topic}
                                        helperText={errors.topic}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Description */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Description *"
                                        name="description"
                                        placeholder="Enter your message"
                                        value={formData.description}
                                        onChange={handleChange}
                                        error={!!errors.description}
                                        helperText={errors.description}
                                        variant="outlined"
                                        multiline
                                        rows={5}
                                    />
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            backgroundColor: '#1976d2',
                                            color: 'white',
                                            px: { xs: 3, sm: 5 },
                                            py: 1.5,
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            textTransform: 'uppercase',
                                            '&:hover': {
                                                backgroundColor: '#1565c0',
                                            },
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default ContactUs;
