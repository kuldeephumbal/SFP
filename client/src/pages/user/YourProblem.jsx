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
    CircularProgress,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const YourProblem = () => {
    const [formData, setFormData] = useState({
        name: '',
        mobile_number: '',
        city: '',
        message: '',
        description: '',
        video_url: '',
    });

    const [documentFile, setDocumentFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
        setDocumentFile(e.target.files[0]);
        if (errors.document) {
            setErrors({
                ...errors,
                document: '',
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.mobile_number.trim()) {
            newErrors.mobile_number = 'Mobile Number is required';
        } else if (!/^\d{10}$/.test(formData.mobile_number)) {
            newErrors.mobile_number = 'Mobile Number must be 10 digits';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.video_url.trim()) {
            newErrors.video_url = 'Video URL is required';
        } else if (!/^https?:\/\/.+/.test(formData.video_url)) {
            newErrors.video_url = 'Please enter a valid URL';
        }

        if (!documentFile) {
            newErrors.document = 'Document is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);
            const data = new FormData();
            data.append('name', formData.name);
            data.append('mobile_number', formData.mobile_number);
            data.append('city', formData.city);
            data.append('message', formData.message);
            data.append('description', formData.description);
            data.append('video_url', formData.video_url);
            data.append('document', documentFile);

            axios.post('http://localhost:5000/api/add-problem', data)
                .then((response) => {
                    toast.success('Problem submitted successfully!');
                    setFormData({
                        name: '',
                        mobile_number: '',
                        city: '',
                        message: '',
                        description: '',
                        video_url: '',
                    });
                    setDocumentFile(null);
                })
                .catch((error) => {
                    console.error('Error submitting problem:', error);
                    toast.error('Error submitting problem. Please try again.');
                })
                .finally(() => {
                    setLoading(false);
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
                                Your Problems
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
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleInputChange}
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
                                        label="Mobile Number *"
                                        name="mobile_number"
                                        placeholder="Enter your mobile number"
                                        value={formData.mobile_number}
                                        onChange={handleInputChange}
                                        error={!!errors.mobile_number}
                                        helperText={errors.mobile_number}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* City */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="City *"
                                        name="city"
                                        placeholder="Enter your city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        error={!!errors.city}
                                        helperText={errors.city}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                {/* Message */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Message *"
                                        name="message"
                                        placeholder="Enter your message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        error={!!errors.message}
                                        helperText={errors.message}
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
                                        placeholder="Enter a description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        error={!!errors.description}
                                        helperText={errors.description}
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                    />
                                </Grid>

                                {/* Video URL */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Video URL *"
                                        name="video_url"
                                        placeholder="Enter video URL"
                                        value={formData.video_url}
                                        onChange={handleInputChange}
                                        error={!!errors.video_url}
                                        helperText={errors.video_url}
                                        variant="outlined"
                                        size="small"
                                        type="url"
                                    />
                                </Grid>

                                {/* Document Upload */}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                        Document *
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        sx={{
                                            justifyContent: 'flex-start',
                                            textTransform: 'none',
                                            borderColor: errors.document ? '#d32f2f' : '#ccc',
                                            color: errors.document ? '#d32f2f' : '#666',
                                        }}
                                    >
                                        {documentFile ? documentFile.name : 'Choose File'}
                                        <input
                                            type="file"
                                            hidden
                                            accept="application/pdf,image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {errors.document && (
                                        <Typography variant="caption" sx={{ color: '#d32f2f' }}>
                                            {errors.document}
                                        </Typography>
                                    )}
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
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
                                            '&:disabled': {
                                                backgroundColor: '#90caf9',
                                            },
                                        }}
                                    >
                                        {loading ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CircularProgress size={20} sx={{ color: 'white' }} />
                                                Submitting...
                                            </Box>
                                        ) : (
                                            'Submit'
                                        )}
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

export default YourProblem;
