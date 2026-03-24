import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import api from '../../components/BaseURL';

const Donate = () => {
    const { t } = useTranslation();
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
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = t('donate.name_required');
        }

        if (!formData.mobileNo.trim()) {
            newErrors.mobileNo = t('donate.mobile_required');
        } else if (!/^\d{10}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = t('donate.mobile_invalid');
        }

        if (!formData.amount.trim()) {
            newErrors.amount = t('donate.amount_required');
        } else if (isNaN(formData.amount) || formData.amount <= 0) {
            newErrors.amount = t('donate.amount_invalid');
        }

        if (!formData.address.trim()) {
            newErrors.address = t('donate.address_required');
        }

        if (!formData.paymentReceipt) {
            newErrors.paymentReceipt = t('donate.receipt_required');
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('donate.email_invalid');
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

            api.post("/donation", submitData)
                .then((response) => {
                    console.log('Donation submitted:', response.data);
                    toast.success(t('donate.success'));
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
                    toast.error(t('donate.error'));
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
                                {t('donate.title')}
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                {/* Full Name */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={t('donate.name')}
                                        required
                                        name="fullName"
                                        placeholder={t('donate.name_placeholder')}
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        error={!!errors.fullName}
                                        helperText={errors.fullName}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Mobile Number */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={t('donate.mobile')}
                                        required
                                        name="mobileNo"
                                        placeholder={t('donate.mobile_placeholder')}
                                        value={formData.mobileNo}
                                        onChange={handleInputChange}
                                        error={!!errors.mobileNo}
                                        helperText={errors.mobileNo}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Email */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={t('donate.email')}
                                        name="email"
                                        placeholder={t('donate.email_placeholder')}
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={t('donate.pancard')}
                                        name="pancard"
                                        placeholder={t('donate.pancard_placeholder')}
                                        value={formData.pancard}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Photo Upload */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{t('donate.photo')}</Typography>
                                    <TextField
                                        fullWidth
                                        type="file"
                                        name="photo"
                                        onChange={handleFileChange}
                                        inputProps={{ accept: "image/*" }}
                                    />
                                </Grid>

                                {/* Payment Receipt Upload */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{t('donate.receipt')}</Typography>
                                    <TextField
                                        fullWidth
                                        type="file"
                                        name="paymentReceipt"
                                        required
                                        onChange={handleFileChange}
                                        inputProps={{ accept: ".pdf,.jpg,.jpeg,.png" }}
                                        error={!!errors.paymentReceipt}
                                        helperText={errors.paymentReceipt}
                                    />
                                </Grid>

                                {/* Amount */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={t('donate.amount')}
                                        required
                                        name="amount"
                                        placeholder={t('donate.amount_placeholder')}
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
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label={t('donate.address')}
                                        required
                                        name="address"
                                        placeholder={t('donate.address_placeholder')}
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        error={!!errors.address}
                                        helperText={errors.address}
                                        variant="outlined"
                                        multiline
                                        rows={3}
                                    />
                                </Grid>

                                {/* UPI QR Code Section */}
                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                            {t('donate.upi_scan')}
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
                                <Grid size={12} sx={{ textAlign: 'center' }}>
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
                                        {t('donate.submit')}
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
