import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import api from '../../components/BaseURL';

const ContactUs = () => {
    const { t } = useTranslation();
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

            api.post('/enquiry', data)
                .then((response) => {
                    toast.success(t('contact.success'));
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
                    toast.error(t('contact.error'));
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
                                {t('contact.title')}
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                {/* Name */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        label={t('contact.name')}
                                        name="name"
                                        placeholder={t('contact.name_placeholder')}
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Mobile Number */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        label={t('contact.mobile')}
                                        name="mobile"
                                        placeholder={t('contact.mobile_placeholder')}
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        error={!!errors.mobile}
                                        helperText={errors.mobile}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Email */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        type="email"
                                        label={t('contact.email')}
                                        name="email"
                                        placeholder={t('contact.email_placeholder')}
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Topic */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        label={t('contact.topic')}
                                        name="topic"
                                        placeholder={t('contact.topic_placeholder')}
                                        value={formData.topic}
                                        onChange={handleChange}
                                        error={!!errors.topic}
                                        helperText={errors.topic}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Description */}
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        label={t('contact.description')}
                                        name="description"
                                        placeholder={t('contact.description_placeholder')}
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
                                <Grid size={12} sx={{ textAlign: 'center' }}>
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
                                        {t('contact.submit')}
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
