import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api, { IMAGE_BASE_URL, getImageUrl } from '../../components/BaseURL';
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
import { toast } from 'react-toastify';

const Gallery = () => {
    const { t } = useTranslation();
    const [galleryItems, setGalleryItems] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch gallery items from the API
    const fetchGallery = () => {
        api.get('/gallery')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setGalleryItems(response.data);
                } else {
                    console.warn('Unexpected API response format:', response.data);
                    setGalleryItems([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching gallery:', error);
                toast.error(t('gallery.error_loading'));
                setGalleryItems([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    // Handle opening image in modal
    const handleImageClick = (photo) => {
        setSelectedImage(photo);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">

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
                    ) : galleryItems.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" color="textSecondary">
                                {t('common.no_items')}
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {galleryItems.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item._id}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            boxShadow: 2,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: 6,
                                                transform: { xs: 'none', md: 'scale(1.02)' },
                                                transition: 'all 0.3s ease-in-out',
                                            },
                                        }}
                                        onClick={() => handleImageClick(item.photo)}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={getImageUrl(item.photo)}
                                            alt={item.title || 'Gallery Image'}
                                            sx={{
                                                height: 250,
                                                objectFit: 'cover',
                                            }}
                                        />
                                        {item.title && (
                                            <Box sx={{ p: 1.5, textAlign: 'center' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {item.title}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Image Modal */}
                    <Modal
                        open={!!selectedImage}
                        onClose={handleCloseModal}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                bgcolor: 'white',
                                boxShadow: 24,
                                p: 1,
                                borderRadius: 1,
                                outline: 'none',
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                            }}
                        >
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    },
                                    zIndex: 1,
                                }}
                                onClick={handleCloseModal}
                            >
                                <CloseIcon />
                            </IconButton>

                            {selectedImage && (
                                <Box
                                    component="img"
                                    src={getImageUrl(selectedImage)}
                                    alt="Gallery Preview"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: 'calc(90vh - 20px)',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            )}
                        </Box>
                    </Modal>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default Gallery;
