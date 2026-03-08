import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
                toast.error(t('gallery.error_loading'));
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
                            {t('gallery.title')}
                        </Typography>
                    </Box>

                    {/* Loading State */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : galleryItems.length > 0 ? (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(2, minmax(0, 1fr))',
                                    sm: 'repeat(3, minmax(0, 1fr))',
                                    md: 'repeat(4, minmax(0, 1fr))',
                                },
                                gap: { xs: 2, sm: 3 },
                            }}
                        >
                            {galleryItems.map((item) => (
                                <Card
                                    key={item._id}
                                    sx={{
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
                                            width: '100%',
                                            height: { xs: 140, sm: 160, md: 180 },
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" color="textSecondary">
                                {t('common.no_items')}
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
