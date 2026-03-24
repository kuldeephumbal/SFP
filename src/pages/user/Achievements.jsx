import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../components/BaseURL';
import { toast } from 'react-toastify';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
    Divider,
} from '@mui/material';

const Achievements = () => {
    const { t } = useTranslation();
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await api.get('/achievement');
            setAchievements(response.data || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
            toast.error(t('achievements.error_loading'));
            setAchievements([]);
        }
    };
    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
                        {/* Header */}
                        <Box
                            sx={{
                                backgroundColor: '#1976d2',
                                color: 'white',
                                textAlign: 'center',
                                py: { xs: 1.5, sm: 2 },
                                mb: 4,
                                borderRadius: 1,
                                mx: { xs: -3, md: -4 },
                                mt: { xs: -3, md: -4 },
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {t('achievements.title')}
                            </Typography>
                        </Box>

                        {/* Intro */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.7 }}>
                                {t('achievements.intro')}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {/* Achievements Grid */}
                        <Grid container spacing={3}>
                            {achievements.map((item, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={`${item.title}-${idx}`}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                            boxShadow: 2,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                boxShadow: 4,
                                                transform: 'translateY(-4px)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                backgroundColor: '#e3f2fd',
                                                color: '#1565c0',
                                                px: 2,
                                                py: 1,
                                                fontWeight: 700,
                                                letterSpacing: 0.4,
                                            }}
                                        >
                                            {item.year}
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', lineHeight: 1.3 }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                                                {item.description}
                                            </Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 'auto', flexWrap: 'wrap', gap: 1 }}>
                                                <Chip label={item.highlight} color="primary" size="small" sx={{ fontWeight: 600 }} />
                                                <Chip
                                                    label={item.impact}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ borderColor: '#90caf9', color: '#1565c0', fontWeight: 600 }}
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default Achievements;
