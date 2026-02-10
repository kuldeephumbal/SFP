import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../components/BaseURL';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Stack,
    Chip,
    CircularProgress,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDateTime = (datetime) => {
    const d = new Date(datetime);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours.toString().padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
};

const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const CrowdFunding = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCrowdfunding = () => {
        api.get('/crowdfunding')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setItems(response.data);
                } else {
                    setItems([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching crowdfunding items:', error);
                toast.error('Error loading crowdfunding items');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCrowdfunding();
    }, []);

    const handleDonate = (id) => {
        sessionStorage.setItem('crowdFundingId', id);
        navigate('/donate');
    };

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <ToastContainer position="top-right" autoClose={3000} />

                    {/* Header */}
                    <Box
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            textAlign: 'center',
                            py: { xs: 1.5, sm: 2 },
                            mb: 4,
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            CrowdFunding Projects
                        </Typography>
                    </Box>

                    {/* Loading */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : items.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" color="textSecondary">
                                No crowdfunding items found.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {items.map((item) => (
                                <Grid item xs={12} key={item._id}>
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', md: 'row' },
                                            boxShadow: 2,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                boxShadow: 4,
                                                transform: 'translateY(-3px)',
                                            },
                                        }}
                                    >
                                        {/* Image */}
                                        <CardMedia
                                            component="img"
                                            image={`http://localhost:5000/${item.photo.replace(/^\/+/, '')}`}
                                            alt={item.topic}
                                            sx={{
                                                width: { xs: '100%', md: '35%' },
                                                height: { xs: 220, md: '100%' },
                                                objectFit: 'cover',
                                            }}
                                        />

                                        {/* Content */}
                                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {item.location && <Chip label={item.location} size="small" color="primary" />}
                                                {item.end_date && (
                                                    <Chip label={`End: ${formatDate(item.end_date)}`} size="small" variant="outlined" />
                                                )}
                                            </Stack>

                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', lineHeight: 1.3 }}>
                                                {item.topic}
                                            </Typography>

                                            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                                                {item.topic_details}
                                            </Typography>

                                            <Typography variant="caption" sx={{ color: '#999' }}>
                                                <strong>Last updated:</strong> {formatDateTime(item.createdAt)}
                                            </Typography>

                                            <Box sx={{ mt: 1.5 }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleDonate(item._id)}
                                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                                >
                                                    Donate
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default CrowdFunding;
