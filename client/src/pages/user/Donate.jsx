import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
    Container,
    Paper,
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    Input,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Donate = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNo: '',
        email: '',
        pancard: '',
        photo: null,
        address: '',
        amount: '',
        paymentReceipt: null,
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
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

    const handleFileChange = (e) => {
        const { name } = e.target;
        setFormData({
            ...formData,
            [name]: e.target.files[0],
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
        }

        if (!formData.mobileNo.trim()) {
            newErrors.mobileNo = 'Mobile Number is required';
        } else if (!/^\d{10}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = 'Mobile Number must be 10 digits';
        }

        if (!formData.amount.trim()) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(formData.amount) || formData.amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const submitData = new FormData();
            submitData.append("full_name", formData.fullName);
            submitData.append("mobile_number", formData.mobileNo);
            submitData.append("email", formData.email);
            submitData.append("pancard_number", formData.pancard);
            submitData.append("address", formData.address);
            submitData.append("amount", formData.amount);

            if (formData.photo) {
                submitData.append("image", formData.photo);
            }
            if (formData.paymentReceipt) {
                submitData.append("payment_receipt", formData.paymentReceipt);
            }

            axios.post("http://localhost:5000/api/donate", submitData)
                .then((response) => {
                    console.log('Donation submitted:', response.data);
                    toast.success('Donation submitted successfully!');
                    setFormData({
                        fullName: '',
                        mobileNo: '',
                        email: '',
                        pancard: '',
                        photo: null,
                        address: '',
                        amount: '',
                        paymentReceipt: null,
                    });
                })
                .catch((error) => {
                    console.error('Error submitting donation:', error.response?.data || error.message);
                    toast.error('There was an error submitting your donation. Please try again.');
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
                                Donate
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                {/* Full Name */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name*"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        error={!!errors.fullName}
                                        helperText={errors.fullName}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Mobile Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Mobile No.*"
                                        name="mobileNo"
                                        placeholder="Enter your mobile number"
                                        value={formData.mobileNo}
                                        onChange={handleInputChange}
                                        error={!!errors.mobileNo}
                                        helperText={errors.mobileNo}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Email */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email (optional)"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        variant="outlined"
                                        type="email"
                                        size="small"
                                    />
                                </Grid>

                                {/* Pancard Number */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Pancard No. (optional)"
                                        name="pancard"
                                        placeholder="Enter your pancard number"
                                        value={formData.pancard}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Photo Upload */}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Photo (optional)</Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                    >
                                        {formData.photo ? formData.photo.name : 'Choose File'}
                                        <input
                                            type="file"
                                            hidden
                                            name="photo"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </Button>
                                </Grid>

                                {/* Amount */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Amount*"
                                        name="amount"
                                        placeholder="Enter donation amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        error={!!errors.amount}
                                        helperText={errors.amount}
                                        variant="outlined"
                                        type="number"
                                        size="small"
                                    />
                                </Grid>

                                {/* Address */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address*"
                                        name="address"
                                        placeholder="Enter your address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        error={!!errors.address}
                                        helperText={errors.address}
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                    />
                                </Grid>

                                {/* Payment Receipt Upload */}
                                <Grid item xs={12}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Payment Receipt Upload*</Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        required
                                        sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                    >
                                        {formData.paymentReceipt ? formData.paymentReceipt.name : 'Choose File'}
                                        <input
                                            type="file"
                                            hidden
                                            name="paymentReceipt"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                    </Button>
                                </Grid>

                                {/* UPI QR Code Section */}
                                <Grid item xs={12} sm={6}>
                                    <Box
                                        sx={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 1,
                                            p: 2,
                                            textAlign: 'center',
                                            backgroundColor: '#f9f9f9',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600, mb: 1.5, color: '#333' }}
                                        >
                                            UPI SCAN:
                                        </Typography>
                                        <Box
                                            sx={{
                                                width: '120px',
                                                height: '120px',
                                                mx: 'auto',
                                                backgroundColor: '#e0e0e0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ color: '#999' }}>
                                                QR Code Image
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            px: { xs: 3, sm: 5 },
                                            py: 1.5,
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            textTransform: 'uppercase',
                                            '&:hover': {
                                                backgroundColor: '#45a049',
                                            },
                                        }}
                                    >
                                        Donation
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

export default Donate;
