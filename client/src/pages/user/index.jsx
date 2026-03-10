

import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomSlider from '../../components/CustomSlider';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Paper,
    Divider
} from '@mui/material';
import {
    PersonAdd,
    Event,
    Groups,
    ArrowBack,
    ArrowForward,
    YouTube
} from '@mui/icons-material';
import axios from 'axios';
import api, { IMAGE_BASE_URL, getImageUrl } from '../../components/BaseURL';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const UserLandingPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [activities, setActivities] = useState([]);
    const [latestActivities, setLatestActivities] = useState([]);
    const [youtubeVideos, setYoutubeVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const recentActivityRef = useRef(null);

    const defaultSliderImages = [
        { id: 1, photo: '/assets/img/slider-img-01.webp', topic: 'Welcome to Shankhnad Foundation' },
        { id: 2, photo: '/assets/img/slider-img-02.jpg', topic: 'Making a Difference Together' },
        { id: 3, photo: '/assets/img/slider-img-03.jpg', topic: 'Join Us in Our Mission' }
    ];

    const [sliderImages, setSliderImages] = useState(defaultSliderImages);

    useEffect(() => {
        api
            .get('/slider')
            .then((res) => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    const mapped = res.data.map((item, index) => ({
                        id: item._id || index,
                        photo: item.photo,
                        topic: item.topic || ''
                    }));
                    setSliderImages(mapped);
                }
            })
            .catch((err) => {
                console.error('Failed to load slider images', err);
                // Keep defaults on failure
            });
    }, []);

    useEffect(() => {
        api
            .get('/recent-activity')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setActivities(res.data);
                }
            })
            .catch((err) => {
                console.error('Failed to load recent activities', err);
                // Keep empty on failure
            });
    }, []);

    useEffect(() => {
        api
            .get('/latest-activity')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setLatestActivities(res.data);
                }
            })
            .catch((err) => {
                console.error('Failed to load latest activities', err);
                // Keep empty on failure
            });
    }, []);

    useEffect(() => {
        setVideosLoading(true);
        api
            .get('/youtube-video')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setYoutubeVideos(res.data);
                }
            })
            .catch((err) => {
                console.error('Failed to load youtube videos', err);
                setYoutubeVideos([]);
            })
            .finally(() => setVideosLoading(false));
    }, []);

    useEffect(() => {
        api
            .get('/member')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setMembers(res.data);
                }
            })
            .catch((err) => {
                console.error('Error fetching members:', err);
            });
    }, []);

    useEffect(() => {
        api
            .get('/gallery')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setGalleryItems(res.data);
                }
            })
            .catch((err) => {
                console.error('Error fetching gallery items:', err);
            });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (typeof window === 'undefined') return;
            if (typeof window.Event === 'function') {
                window.dispatchEvent(new window.Event('resize'));
                return;
            }
            const legacyEvent = document.createEvent('UIEvents');
            legacyEvent.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(legacyEvent);
        }, 150);
        return () => clearTimeout(timer);
    }, [sliderImages.length, youtubeVideos.length, galleryItems.length]);

    // Auto-scroll logic for Recent Activity - infinite loop
    useEffect(() => {
        const container = recentActivityRef.current;
        if (!container || activities.length === 0) return;

        let intervalId;
        const startScroll = () => {
            intervalId = setInterval(() => {
                container.scrollTop += 0.5; // Very slow speed

                // When we've scrolled past the original content height, reset to top seamlessly
                if (container.scrollTop >= container.scrollHeight / 2) {
                    container.scrollTop = 0;
                }
            }, 30);
        };

        const stopScroll = () => clearInterval(intervalId);

        startScroll();

        // Pause on hover
        container.addEventListener('mouseenter', stopScroll);
        container.addEventListener('mouseleave', startScroll);

        return () => {
            stopScroll();
            container.removeEventListener('mouseenter', stopScroll);
            container.removeEventListener('mouseleave', startScroll);
        };
    }, [activities]);

    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('embed/')) return url;
        let videoId = '';
        if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    const objectives = [
        { title: t('home.obj_social'), image: '/assets/img/social-welfare2.jpg' },
        { title: t('home.obj_health'), image: '/assets/img/H&R2.jpg' },
        { title: t('home.obj_edu'), image: '/assets/img/E&T2.jpg' },
        { title: t('home.obj_human'), image: '/assets/img/HR2.jpg' },
        { title: t('home.obj_crime'), image: '/assets/img/anti-crime.jpg' }
    ];

    const handleModalBackgroundClick = (e) => {
        if (e.target.className.includes("image-modal")) {
            setSelectedImage(null);
        }
    };

    const sectionSpacing = { xs: 3, md: 6 };


    return (
        <>
            <Navbar />
            <Box sx={{
                bgcolor: '#f5f5f5',
                minHeight: '100vh',
                pb: sectionSpacing,
                overflowX: 'hidden'
            }}>

                {/* Hero Slider Section */}
                <Box sx={{ bgcolor: '#f5f5f5', py: { xs: 2, md: 3 } }}>
                    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                        <CustomSlider
                            slidesToShow={1}
                            autoplay
                            autoplaySpeed={5000}
                            dots
                            dotsInside
                            showArrows
                            arrowsInside
                            styledArrows={false}
                        >
                            {sliderImages.map((slider) => (
                                <Box key={slider.id} sx={{ position: 'relative' }}>
                                    <Box
                                        component="img"
                                        src={getImageUrl(slider.photo)}
                                        alt={slider.topic}
                                        sx={{
                                            width: '100%',
                                            height: { xs: 220, sm: 300, md: 400 },
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                        color: 'white',
                                        p: { xs: 2, md: 3 },
                                        display: { xs: 'none', md: 'block' }
                                    }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                            {slider.topic}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </CustomSlider>
                    </Container>
                </Box>

                {/* Quick Action Cards */}
                <Box sx={{ mt: { xs: 2, md: 3 }, mb: sectionSpacing }}>
                    <Container maxWidth="lg">
                        <CustomSlider
                            slidesToShow={4}
                            breakpoints={{
                                320: { slidesToShow: 1 },
                                768: { slidesToShow: 2 },
                                1024: { slidesToShow: 3 },
                                1200: { slidesToShow: 4 },
                            }}
                            showArrows
                        >
                            <Box sx={{ px: 1, height: '100%', py: 0.5 }}>
                                <Card
                                    onClick={() => navigate('/member-apply')}
                                    sx={{
                                        textAlign: 'center',
                                        py: { xs: 4, md: 2 },
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        height: '100%',
                                        borderRadius: 3
                                    }}
                                >
                                    <PersonAdd sx={{ fontSize: { xs: 60, md: 40 }, color: '#1976d2', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', md: '1rem' } }}>{t('navbar.apply')}</Typography>
                                </Card>
                            </Box>
                            <Box sx={{ px: 1, height: '100%', py: 0.5 }}>
                                <Card
                                    onClick={() => navigate('/upcoming-events')}
                                    sx={{
                                        textAlign: 'center',
                                        py: { xs: 4, md: 2 },
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        height: '100%',
                                        borderRadius: 3
                                    }}
                                >
                                    <Event sx={{ fontSize: { xs: 60, md: 40 }, color: '#1976d2', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', md: '1rem' } }}>{t('navbar.services')}</Typography>
                                </Card>
                            </Box>
                            <Box sx={{ px: 1, height: '100%', py: 0.5 }}>
                                <Card
                                    onClick={() => navigate('/our-team')}
                                    sx={{
                                        textAlign: 'center',
                                        py: { xs: 4, md: 2 },
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        height: '100%',
                                        borderRadius: 3
                                    }}
                                >
                                    <Groups sx={{ fontSize: { xs: 60, md: 40 }, color: '#1976d2', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', md: '1rem' } }}>{t('navbar.team')}</Typography>
                                </Card>
                            </Box>
                            <Box sx={{ px: 1, height: '100%', py: 0.5 }}>
                                <Card
                                    onClick={() => navigate('/donate')}
                                    sx={{
                                        textAlign: 'center',
                                        py: { xs: 4, md: 2 },
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        height: '100%',
                                        borderRadius: 3
                                    }}
                                >
                                    <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                                        <Event sx={{ fontSize: { xs: 60, md: 40 }, color: '#1976d2', mb: 2 }} />
                                    </Paper>
                                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', md: '1rem' } }}>{t('navbar.donate')}</Typography>
                                </Card>
                            </Box>
                            <Box sx={{ px: 1, height: '100%', py: 0.5 }}>
                                <Card
                                    onClick={() => navigate('/crowdfunding')}
                                    sx={{
                                        textAlign: 'center',
                                        py: { xs: 4, md: 2 },
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        height: '100%',
                                        borderRadius: 3
                                    }}
                                >
                                    <Groups sx={{ fontSize: { xs: 60, md: 40 }, color: '#1976d2', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', md: '1rem' } }}>{t('navbar.crowdfunding')}</Typography>
                                </Card>
                            </Box>
                        </CustomSlider>
                    </Container>
                </Box>

                {/* Recent Activity Section */}
                <Container maxWidth="lg" sx={{ mt: sectionSpacing, px: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex' }}>
                            <Paper sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', height: { xs: 400, md: 560 } }}>
                                <Box sx={{ bgcolor: '#1565c0', color: 'white', p: 1.5 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{t('home.recent_activity')}</Typography>
                                </Box>
                                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                                    {activities && activities.length > 0 ? (
                                        <Box
                                            ref={recentActivityRef}
                                            sx={{
                                                mb: 2,
                                                flexGrow: 1,
                                                overflowY: 'auto',
                                                pr: 0.5,
                                                // Hide scrollbar but keep functionality
                                                scrollbarWidth: 'none',
                                                '-ms-overflow-style': 'none',
                                                '&::-webkit-scrollbar': {
                                                    display: 'none'
                                                }
                                            }}
                                        >
                                            {/* Render activities twice for infinite scrolling effect */}
                                            {[...activities, ...activities].map((activity, index) => (
                                                <Box
                                                    key={`${activity._id || activity.id}-${index}`}
                                                    sx={{
                                                        pb: 1.5,
                                                        mb: 1.5,
                                                        borderBottom: '1px solid #e0e0e0',
                                                        '&:last-child': {
                                                            borderBottom: 'none'
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1565c0', mb: 0.5 }}>
                                                        {activity.activity_name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(activity.createdAt || activity.created_at).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography color="text.secondary" sx={{ mb: 3 }}>{t('home.no_activity')}</Typography>
                                    )}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<PersonAdd />}
                                        onClick={() => navigate('/member-apply')}
                                        sx={{ bgcolor: '#ff9800', mb: 1.5, py: 1.2, '&:hover': { bgcolor: '#f57c00' } }}
                                    >
                                        {t('home.apply_membership')}
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<Event />}
                                        onClick={() => navigate('/donate')}
                                        sx={{ bgcolor: '#4caf50', py: 1.2, '&:hover': { bgcolor: '#388e3c' } }}
                                    >
                                        {t('home.donation')}
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, md: 9 }} sx={{ display: 'flex' }}>
                            <Paper sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', width: '100%', height: { xs: 500, md: 560 } }}>
                                {latestActivities && latestActivities.length > 0 ? (
                                    <Box sx={{
                                        flexGrow: 1,
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        pr: 1, // spacing for scrollbar
                                        '&::-webkit-scrollbar': {
                                            width: '8px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: '#f1f1f1',
                                            borderRadius: '4px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: '#ccc',
                                            borderRadius: '4px',
                                        },
                                        '&::-webkit-scrollbar-thumb:hover': {
                                            background: '#1976d2',
                                        },
                                    }}>
                                        <Grid container spacing={{ xs: 2, md: 3 }}>
                                            {latestActivities.map((activity) => (
                                                <Grid size={{ xs: 12, md: 6 }} key={activity._id || activity.id}>
                                                    <Card sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        height: '100%',
                                                        borderRadius: 3,
                                                    }}
                                                        onClick={() => navigate(`/latest-activity/${activity._id || activity.id}`)}
                                                    >
                                                        <CardMedia
                                                            component="img"
                                                            sx={{ height: { xs: 180, sm: 200, md: 220 }, objectFit: 'cover' }}
                                                            image={getImageUrl(activity.photo)}
                                                            alt={activity.activity_detail}
                                                        />
                                                        <CardContent sx={{ flexGrow: 1 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                                                <Typography variant="body1" sx={{
                                                                    fontWeight: 600,
                                                                    color: '#2c3e50',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden'
                                                                }}>
                                                                    {activity.activity_detail}
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: 500 }}>
                                                                {new Date(activity.createdAt || activity.created_at).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                ) : (
                                    <Typography variant="body1" color="text.secondary" textAlign="center">
                                        {t('home.no_latest_activities') || 'No latest activities found.'}
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>

                {/* About Us Section */}
                <Container maxWidth="lg" sx={{ mt: sectionSpacing, mb: sectionSpacing, px: { xs: 2, sm: 3 } }}>
                    <Paper sx={{ p: { xs: 2.5, md: 5 }, borderRadius: 3, boxShadow: 3 }}>
                        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="start">
                            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box
                                            component="img"
                                            src="/assets/img/Shankhnad-logo.png"
                                            alt="Shankhnad Foundation"
                                            sx={{ width: '100%', maxWidth: { xs: 180, md: 220 }, display: 'inline-block' }}
                                        />
                                    </Box>
                                    <Box sx={{ maxWidth: { xs: 320, sm: 360, md: 380 }, mx: 'auto', width: '100%' }}>
                                        {members.length > 0 ? (
                                            <CustomSlider
                                                slidesToShow={1}
                                                autoplay
                                                autoplaySpeed={2500}
                                                showArrows={false}
                                            >
                                                {members.map(member => (
                                                    <Box key={member._id} sx={{ textAlign: 'center', p: 1 }}>
                                                        <Card sx={{ p: 2.5, borderRadius: 3, boxShadow: 3, maxWidth: 420, mx: 'auto' }}>
                                                            <CardMedia
                                                                component="img"
                                                                image={member.photo ? `${IMAGE_BASE_URL}/${member.photo.replace(/^\/+/, '')}` : '/assets/img/default-member.png'}
                                                                alt={member.name}
                                                                sx={{
                                                                    width: '100%',
                                                                    maxWidth: { xs: 210, md: 240 },
                                                                    height: { xs: 230, md: 270 },
                                                                    objectFit: 'cover',
                                                                    borderRadius: 3,
                                                                    mx: 'auto',
                                                                    mb: 2
                                                                }}
                                                            />
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', md: '1rem' } }}>{member.name}</Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>{member.status}</Typography>
                                                        </Card>
                                                    </Box>
                                                ))}
                                            </CustomSlider>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                                No members found.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                                <Typography variant="h4" sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: { xs: '1.75rem', md: '2.125rem' },
                                    textAlign: { xs: 'center', md: 'left' }
                                }}>
                                    {t('about_section.title')}
                                </Typography>
                                <Typography paragraph color="text.secondary" sx={{
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    lineHeight: 1.7,
                                    textAlign: 'justify'
                                }}>
                                    {t('about_section.p1')}
                                </Typography>
                                <Typography paragraph color="text.secondary" sx={{
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    lineHeight: 1.7,
                                    textAlign: 'justify'
                                }}>
                                    {t('about_section.p2')}
                                </Typography>
                                <Typography paragraph color="text.secondary" sx={{
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    lineHeight: 1.7,
                                    textAlign: 'justify'
                                }}>
                                    {t('about_section.p3')}
                                </Typography>
                                <Typography paragraph color="text.secondary" sx={{
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    lineHeight: 1.7,
                                    textAlign: 'justify'
                                }}>
                                    {t('about_section.p4')}
                                </Typography>
                                <Typography paragraph color="text.secondary" sx={{
                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                    lineHeight: 1.7,
                                    textAlign: 'justify'
                                }}>
                                    {t('about_section.p5')}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>

                {/* Our Objectives Section */}
                <Container maxWidth="lg" sx={{ mt: sectionSpacing, mb: sectionSpacing, px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ bgcolor: '#1565c0', color: 'white', p: { xs: 1.5, md: 2 }, textAlign: 'center', mb: { xs: 2, md: 3 }, borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{t('home.our_objectives')}</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {objectives.map((obj, index) => (
                            <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={index}>
                                <Card sx={{
                                    cursor: 'pointer',
                                    height: '100%',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 6,
                                        transition: 'all 0.3s'
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ height: { xs: 120, sm: 140 }, objectFit: 'cover' }}
                                        image={obj.image}
                                        alt={obj.title}
                                    />
                                    <CardContent sx={{ p: 1.5 }}>
                                        <Typography variant="body2" textAlign="center" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                            {obj.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                {/* YouTube Videos Section */}
                <Container maxWidth="lg" sx={{ mt: sectionSpacing, mb: sectionSpacing, px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ bgcolor: '#1565c0', color: 'white', p: { xs: 1.5, md: 2 }, textAlign: 'center', mb: { xs: 2, md: 3 }, borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{t('home.youtube_videos')}</Typography>
                    </Box>
                    {videosLoading ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">{t('home.loading_youtube') || 'Loading YouTube videos...'}</Typography>
                        </Paper>
                    ) : youtubeVideos.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">{t('home.no_youtube') || 'No YouTube videos found.'}</Typography>
                        </Paper>
                    ) : (
                        <CustomSlider
                            slidesToShow={3}
                            breakpoints={{
                                320: { slidesToShow: 1 },
                                768: { slidesToShow: 2 },
                                1024: { slidesToShow: 3 }
                            }}
                            showArrows
                        >
                            {youtubeVideos.slice(0, 6).map((video) => (
                                <Box key={video._id || video.id} sx={{ px: 1.5 }}>
                                    <Card sx={{
                                        overflow: 'hidden'
                                    }}>
                                        <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: '#000' }}>
                                            {getEmbedUrl(video.url) && (
                                                <Box
                                                    component="iframe"
                                                    src={getEmbedUrl(video.url)}
                                                    title={video.url}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        border: 0
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                                                    {video.url}
                                                </Typography>
                                                <YouTube sx={{ color: '#ff0000', ml: 1 }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </CustomSlider>
                    )}
                </Container>

                {/* Gallery Section */}
                <Container maxWidth="lg" sx={{ mt: sectionSpacing, mb: sectionSpacing, px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ bgcolor: '#1565c0', color: 'white', p: { xs: 1.5, md: 2 }, textAlign: 'center', mb: { xs: 2, md: 3 }, borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{t('home.gallery')}</Typography>
                    </Box>
                    <CustomSlider
                        slidesToShow={3}
                        breakpoints={{
                            320: { slidesToShow: 1 },
                            768: { slidesToShow: 2 },
                            1024: { slidesToShow: 3 }
                        }}
                        autoplay
                        autoplaySpeed={3000}
                        showArrows
                    >
                        {galleryItems.map(item => (
                            <Box key={item._id} sx={{ px: 1.5, py: 1 }}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: 2
                                    }}
                                    onClick={() => setSelectedImage(item.photo)}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{ height: { xs: 200, md: 220 }, objectFit: 'cover' }}
                                        image={getImageUrl(item.photo)}
                                        alt={t('home.gallery')}
                                    />
                                </Card>
                            </Box>
                        ))}
                    </CustomSlider>
                </Container>

                {/* President Message Section */}
                <Container maxWidth="lg" sx={{ mt: sectionSpacing, mb: sectionSpacing, px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ bgcolor: '#1565c0', color: 'white', p: { xs: 1.5, md: 2 }, textAlign: 'center', mb: { xs: 2, md: 3 }, borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{t('home.president_message')}</Typography>
                    </Box>
                    <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: 3 }}>
                        <Grid container spacing={{ xs: 3, md: 6 }} alignItems="flex-start">
                            {/* President Image & Name */}
                            <Grid size={{ xs: 12, md: 4, lg: 3.5 }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'sticky',
                                    top: '100px'
                                }}>
                                    <Box
                                        component="img"
                                        src="/assets/img/milanMember.png"
                                        alt={t('home.president_message')}
                                        sx={{
                                            width: '100%',
                                            maxWidth: { xs: 220, md: '100%' },
                                            borderRadius: '16px',
                                            boxShadow: 4,
                                            border: '4px solid #fff',
                                            mb: 2.5
                                        }}
                                    />
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1565c0', mb: 0.5 }}>
                                        {t('home.president_name')}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        bgcolor: 'rgba(21, 101, 192, 0.08)',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 4
                                    }}>
                                        {t('home.president_title', 'President')}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* President Message Content */}
                            <Grid size={{ xs: 12, md: 8, lg: 8.5 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#1565c0',
                                            mb: 3,
                                            fontSize: { xs: '1.25rem', md: '1.75rem' },
                                            position: 'relative',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: '-8px',
                                                left: 0,
                                                width: '60px',
                                                height: '4px',
                                                bgcolor: '#1565c0',
                                                borderRadius: 2
                                            }
                                        }}
                                    >
                                        {t('president_message.greeting')}
                                    </Typography>

                                    <Box sx={{ mt: 4 }}>
                                        {[1, 2, 3, 4, 5].map((idx) => (
                                            <Typography
                                                key={idx}
                                                paragraph
                                                color="text.secondary"
                                                sx={{
                                                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                                                    lineHeight: 1.8,
                                                    textAlign: 'justify',
                                                    mb: idx === 5 ? 0 : 2.5
                                                }}
                                            >
                                                {t(`president_message.p${idx}`)}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>

                {selectedImage && (
                    <Box
                        className="image-modal"
                        onClick={handleModalBackgroundClick}
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            bgcolor: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1300
                        }}
                    >
                        <Box sx={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
                            <img
                                src={getImageUrl(selectedImage)}
                                alt="Enlarged"
                                style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
                            />
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(null);
                                }}
                                sx={{
                                    position: 'absolute',
                                    top: { xs: -40, md: -10 },
                                    right: { xs: 0, md: -40 },
                                    bgcolor: 'white',
                                    color: 'black',
                                    '&:hover': { bgcolor: 'grey.300' }
                                }}
                            >
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>✕</Typography>
                            </IconButton>
                        </Box>
                    </Box>
                )}

            </Box>
            <Footer />
        </>
    );
};

export default UserLandingPage;
