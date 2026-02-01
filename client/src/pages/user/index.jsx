import { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
import api from '../../components/BaseURL';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const UserLandingPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [activities, setActivities] = useState([]);
    const [latestActivities, setLatestActivities] = useState([]);
    const [youtubeVideos, setYoutubeVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);

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
                        photo: item.photo?.startsWith('http') ? item.photo : `http://localhost:5000${item.photo}`,
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
        { title: 'Social Welfare', image: '/assets/img/social-welfare2.jpg' },
        { title: 'Health & Research', image: '/assets/img/H&R2.jpg' },
        { title: 'Education & Training', image: '/assets/img/E&T2.jpg' },
        { title: 'Human Rights', image: '/assets/img/HR2.jpg' },
        { title: 'Anti Crime', image: '/assets/img/anti-crime.jpg' }
    ];

    const handleModalBackgroundClick = (e) => {
        if (e.target.className.includes("image-modal")) {
            setSelectedImage(null);
        }
    };

    // Slider settings
    const heroSliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true
    };

    const quickActionSettings = {
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        arrows: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    const memberSliderSettings = {
        infinite: true,
        speed: 200,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: false
    };

    const gallerySliderSettings = {
        infinite: true,
        speed: 200,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1, autoplay: false } }
        ]
    };

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>

                {/* Hero Slider Section */}
                <Box sx={{ bgcolor: '#f5f5f5', py: 3 }}>
                    <Container maxWidth="lg">
                        <Box sx={{
                            position: 'relative',
                            bgcolor: 'white',
                            borderRadius: 2,
                            overflow: 'hidden',
                            '& .slick-prev, & .slick-next': {
                                zIndex: 1,
                                '&:before': {
                                    fontSize: '30px'
                                }
                            },
                            '& .slick-prev': {
                                left: '10px'
                            },
                            '& .slick-next': {
                                right: '10px'
                            },
                            '& .slick-dots': {
                                bottom: '20px',
                                '& li button:before': {
                                    fontSize: '12px',
                                    color: 'white'
                                },
                                '& li.slick-active button:before': {
                                    color: 'white'
                                }
                            }
                        }}>
                            <Slider {...heroSliderSettings}>
                                {sliderImages.map((slider) => (
                                    <Box key={slider.id} sx={{ position: 'relative' }}>
                                        <img
                                            src={slider.photo}
                                            alt={slider.topic}
                                            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                                        />
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                            color: 'white',
                                            p: 3,
                                            display: { xs: 'none', md: 'block' }
                                        }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                                {slider.topic}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Slider>
                        </Box>
                    </Container>
                </Box>

                {/* Quick Action Cards */}
                <Container maxWidth="lg" sx={{
                    mt: -3,
                    position: 'relative',
                    zIndex: 1,
                    '& .slick-prev, & .slick-next': {
                        '&:before': {
                            color: '#1976d2',
                            fontSize: '30px'
                        }
                    },
                    '& .slick-prev': {
                        left: '-30px'
                    },
                    '& .slick-next': {
                        right: '-30px'
                    }
                }}>
                    <Slider {...quickActionSettings}>
                        <Box sx={{ px: 1 }}>
                            <Card sx={{ textAlign: 'center', py: 2, cursor: 'pointer', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
                                <PersonAdd sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="body1" fontWeight={500}>Add person</Typography>
                            </Card>
                        </Box>
                        <Box sx={{ px: 1 }}>
                            <Card sx={{ textAlign: 'center', py: 2, cursor: 'pointer', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
                                <Event sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="body1" fontWeight={500}>Upcoming events</Typography>
                            </Card>
                        </Box>
                        <Box sx={{ px: 1 }}>
                            <Card sx={{ textAlign: 'center', py: 2, cursor: 'pointer', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
                                <Groups sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="body1" fontWeight={500}>Management team</Typography>
                            </Card>
                        </Box>
                        <Box sx={{ px: 1 }}>
                            <Card sx={{ textAlign: 'center', py: 2, cursor: 'pointer', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
                                <YouTube sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="body1" fontWeight={500}>Donate</Typography>
                            </Card>
                        </Box>
                        <Box sx={{ px: 1 }}>
                            <Card sx={{ textAlign: 'center', py: 2, cursor: 'pointer', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
                                <Groups sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="body1" fontWeight={500}>Crowd funding</Typography>
                            </Card>
                        </Box>
                    </Slider>
                </Container>

                {/* Recent Activity Section */}
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Paper sx={{ p: 0, overflow: 'hidden' }}>
                                <Box sx={{ bgcolor: '#1565c0', color: 'white', p: 1.5 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Activity</Typography>
                                </Box>
                                <Box sx={{ p: 2 }}>
                                    {activities && activities.length > 0 ? (
                                        <Box sx={{ mb: 2, maxHeight: '200px', overflowY: 'auto' }}>
                                            {activities.slice(0, 5).map((activity) => (
                                                <Box
                                                    key={activity._id || activity.id}
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
                                        <Typography color="text.secondary" sx={{ mb: 3 }}>No recent activity found.</Typography>
                                    )}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<PersonAdd />}
                                        sx={{ bgcolor: '#ff9800', mb: 1.5, py: 1.2, '&:hover': { bgcolor: '#f57c00' } }}
                                    >
                                        Apply for Membership
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<Event />}
                                        sx={{ bgcolor: '#4caf50', py: 1.2, '&:hover': { bgcolor: '#388e3c' } }}
                                    >
                                        Donation
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, md: 9 }}>
                            <Paper sx={{ p: 3, minHeight: 200 }}>
                                {latestActivities && latestActivities.length > 0 ? (
                                    <Grid container spacing={3}>
                                        {latestActivities.map((activity) => (
                                            <Grid size={{ xs: 12, md: 6 }} key={activity._id || activity.id}>
                                                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="200"
                                                        image={activity.photo?.startsWith('http') ? activity.photo : `http://localhost:5000${activity.photo}`}
                                                        alt={activity.activity_detail}
                                                        sx={{ objectFit: 'cover' }}
                                                    />
                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                                                            {activity.activity_detail}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
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
                                ) : (
                                    <Typography variant="body1" color="text.secondary" textAlign="center">
                                        No latest activities found.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>

                {/* About Us Section */}
                <Container maxWidth="lg" sx={{ mt: 5 }}>
                    <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: 3 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1.05fr' },
                                gap: { xs: 3, md: 4 },
                                alignItems: 'start'
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} lg={3}>
                                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                    <img
                                        src="/assets/img/Shankhnad-logo.png"
                                        alt="Shankhnad Foundation"
                                        style={{ width: '100%', maxWidth: 180, display: 'inline-block' }}
                                    />
                                </Box>
                                <Box sx={{ maxWidth: 200 }}>
                                    {members.length > 0 ? (
                                        <Slider {...memberSliderSettings}>
                                            {members.map(member => (
                                                <Box key={member._id} sx={{ textAlign: 'center' }}>
                                                    <Card sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                                                        <CardMedia
                                                            component="img"
                                                            image={member.photo ? `http://localhost:5000/${member.photo.replace(/^\/+/, '')}` : '/assets/img/default-member.png'}
                                                            alt={member.name}
                                                            sx={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 2, mx: 'auto', mb: 1 }}
                                                        />
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{member.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">{member.status}</Typography>
                                                    </Card>
                                                </Box>
                                            ))}
                                        </Slider>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" textAlign="center">
                                            No members found.
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            <Box lg={9}>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>About Us</Typography>
                                <Typography paragraph color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </Typography>
                                <Typography paragraph color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                                    Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Container>

                {/* Our Objectives Section */}
                <Container maxWidth="lg" sx={{ mt: 5 }}>
                    <Box sx={{ bgcolor: '#1565c0', color: 'white', p: 2, textAlign: 'center', mb: 3, borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Our Objectives</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {objectives.map((obj, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
                                <Card sx={{
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 6,
                                        transition: 'all 0.3s'
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={obj.image}
                                        alt={obj.title}
                                    />
                                    <CardContent>
                                        <Typography variant="body2" textAlign="center" fontWeight={500}>
                                            {obj.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                {/* YouTube Videos Section */}
                <Container maxWidth="lg" sx={{ mt: 5 }}>
                    <Box sx={{ bgcolor: '#1565c0', color: 'white', p: 2, textAlign: 'center', mb: 3, borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Youtube Videos</Typography>
                    </Box>
                    {videosLoading ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">Loading YouTube videos...</Typography>
                        </Paper>
                    ) : youtubeVideos.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No YouTube videos found.</Typography>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {youtubeVideos.slice(0, 6).map((video) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video._id || video.id}>
                                    <Card sx={{
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                            transition: 'all 0.3s'
                                        }
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
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                                    {video.url}
                                                </Typography>
                                                <YouTube sx={{ color: '#ff0000', ml: 1 }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>

                {/* Gallery Section */}
                <Container maxWidth="lg" sx={{ mt: 5 }}>
                    <Box sx={{ bgcolor: '#1565c0', color: 'white', p: 2, textAlign: 'center', mb: 3, borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gallery</Typography>
                    </Box>
                    <Box sx={{
                        '& .slick-prev, & .slick-next': {
                            '&:before': {
                                color: '#1976d2',
                                fontSize: '30px'
                            }
                        }
                    }}>
                        <Slider {...gallerySliderSettings}>
                            {galleryItems.map(item => (
                                <Box key={item._id} sx={{ px: 1 }}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { transform: 'scale(1.05)', transition: 'all 0.3s' }
                                        }}
                                        onClick={() => setSelectedImage(item.photo)}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={`http://localhost:5000/${item.photo.replace(/^\/+/, '')}`}
                                            alt="Gallery item"
                                        />
                                    </Card>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
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
                                    src={selectedImage}
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
                                        top: -10,
                                        right: -10,
                                        bgcolor: 'white',
                                        '&:hover': { bgcolor: 'grey.300' }
                                    }}
                                >
                                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>✕</Typography>
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Container>

                {/* President Message Section */}
                <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
                    <Box sx={{ bgcolor: '#1565c0', color: 'white', p: 2, textAlign: 'center', mb: 3, borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>President Message</Typography>
                    </Box>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Box sx={{ textAlign: 'center', bgcolor: 'white', p: 3, borderRadius: 2 }}>
                                <img
                                    src="/assets/img/kuldeepMember.png"
                                    alt="President"
                                    style={{ width: '100%', maxWidth: 200, borderRadius: '8px' }}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 9 }}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1565c0', mb: 1 }}>
                                    Dear Friends,
                                </Typography>
                                <Typography paragraph color="text.secondary">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </Typography>
                                <Typography paragraph color="text.secondary">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.
                                </Typography>
                                <Typography paragraph color="text.secondary">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.
                                </Typography>
                                <Typography paragraph color="text.secondary">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.
                                </Typography>
                                <Typography paragraph color="text.secondary">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit amet consectetur.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>

            </Box>
            <Footer />
        </>
    );
};

export default UserLandingPage;
