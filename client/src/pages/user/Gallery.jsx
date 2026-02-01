import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../components/BaseURL';
import {
    Box,
    Container,
    Card,
    CardMedia,
    Grid,
    Typography,
    Modal,
    IconButton,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Gallery = () => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    const fetchGalleryItems = () => {
        api.get('/gallery')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setGalleryItems(response.data);
                } else {
                    setGalleryItems([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching gallery items:', error);
                toast.error('Error loading gallery');
                setLoading(false);
            });
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
                            Gallery
                        </Typography>
                    </Box>

                    {/* Loading State */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : galleryItems.length > 0 ? (
                        <Grid container spacing={3}>
                            {galleryItems.map((item) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            boxShadow: 2,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                boxShadow: 4,
                                                transform: 'scale(1.03)',
                                            },
                                        }}
                                        onClick={() => setSelectedImage(item.photo)}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={`http://localhost:5000${item.photo}`}
                                            alt="gallery item"
                                            sx={{
                                                height: 250,
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" color="textSecondary">
                                No gallery items found.
                            </Typography>
                        </Box>
                    )}
                </Container>
            </Box>
            <Footer />

            {/* Modal for Enlarged Image */}
            <Modal
                open={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        onClick={() => setSelectedImage(null)}
                        sx={{
                            position: 'absolute',
                            top: -40,
                            right: 0,
                            color: 'white',
                            zIndex: 1,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 32 }} />
                    </IconButton>

                    {/* Enlarged Image */}
                    {selectedImage && (
                        <img
                            src={`http://localhost:5000/${selectedImage.replace(/^\/+/, '')}`}
                            alt="Enlarged gallery item"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                borderRadius: 2,
                            }}
                        />
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default Gallery;
