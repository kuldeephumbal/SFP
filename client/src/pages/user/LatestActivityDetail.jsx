import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardMedia,
    Grid,
    Paper,
    Divider,
    IconButton,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    ArrowBack,
    Share,
    Facebook,
    WhatsApp,
    X as XIcon
} from '@mui/icons-material';
import api from '../../components/BaseURL';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LatestActivityDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/latest-activity/${id}`);
                setActivity(res.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching activity details:', err);
                setError(t('common.activity_not_found'));
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchActivity();
        }
    }, [id]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `${t('common.share_text')} ${activity?.activity_detail}`;

        let shareUrl = '';
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            default:
                if (navigator.share) {
                    navigator.share({
                        title: 'Shankhnad Foundation',
                        text: text,
                        url: url,
                    }).catch(console.error);
                } else {
                    navigator.clipboard.writeText(url);
                    alert(t('common.link_copied'));
                }
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
                <Footer />
            </Box>
        );
    }

    if (error || !activity) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <Container sx={{ flexGrow: 1, py: 8, textAlign: 'center' }}>
                    <Typography variant="h5" color="error" gutterBottom>{error || t('common.no_items')}</Typography>
                    <Button variant="contained" onClick={() => navigate('/')} startIcon={<ArrowBack />}>
                        {t('common.go_back_home')}
                    </Button>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, flexGrow: 1 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3, color: '#1565c0' }}
                >
                    {t('common.back')}
                </Button>

                <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Grid container spacing={0}>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <CardMedia
                                component="img"
                                image={activity.photo?.startsWith('http') ? activity.photo : `http://localhost:5000${activity.photo}`}
                                alt="Activity Image"
                                sx={{
                                    width: '100%',
                                    height: { xs: 300, md: 500 },
                                    objectFit: 'cover'
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#2c3e50' }}>
                                    {t('common.activity_details')}
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, mb: 4, flexGrow: 1 }}>
                                    {activity.activity_detail}
                                </Typography>

                                <Box sx={{ mt: 'auto' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#777' }}>
                                        {t('common.posted_on')} {new Date(activity.createdAt).toLocaleDateString(t('i18n.language') === 'en' ? 'en-US' : (t('i18n.language') === 'gu' ? 'gu-IN' : 'hi-IN'), {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>{t('common.share')}</Typography>
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            onClick={() => handleShare('facebook')}
                                            sx={{ bgcolor: '#3b5998', color: 'white', '&:hover': { bgcolor: '#2d4373', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
                                        >
                                            <Facebook />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleShare('whatsapp')}
                                            sx={{ bgcolor: '#25D366', color: 'white', '&:hover': { bgcolor: '#128C7E', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
                                        >
                                            <WhatsApp />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleShare('twitter')}
                                            sx={{ bgcolor: '#000000', color: 'white', '&:hover': { bgcolor: '#333333', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
                                        >
                                            <XIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleShare('generic')}
                                            sx={{ bgcolor: '#1565c0', color: 'white', '&:hover': { bgcolor: '#0d47a1', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
                                        >
                                            <Share />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default LatestActivityDetail;
