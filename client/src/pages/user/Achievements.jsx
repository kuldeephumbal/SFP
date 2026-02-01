import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
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

const achievements = [
    {
        year: '2024',
        title: 'Community Health Camp',
        description:
            'Organized a multi-specialty camp offering free checkups and medicines to over 1,200 villagers in rural Bhavnagar.',
        highlight: '1,200+ beneficiaries',
        impact: 'Medical support, awareness, early diagnosis',
    },
    {
        year: '2024',
        title: 'Student Scholarship Drive',
        description:
            'Funded tuition and supplies for 85 students from low-income families to continue higher education.',
        highlight: '₹9.5L in aid',
        impact: 'Education continuity, reduced dropouts',
    },
    {
        year: '2023',
        title: 'Blood Donation Marathon',
        description:
            'Hosted a district-wide blood donation initiative partnering with local hospitals and volunteers.',
        highlight: '430 units collected',
        impact: 'Emergency readiness, hospital reserves strengthened',
    },
    {
        year: '2023',
        title: 'Women Skill Upliftment',
        description:
            'Conducted tailoring and micro-entrepreneurship workshops enabling women to start home businesses.',
        highlight: '60+ women trained',
        impact: 'Income generation, community resilience',
    },
    {
        year: '2022',
        title: 'Tree Plantation Week',
        description:
            'Collaborated with schools to plant and adopt saplings, promoting environmental stewardship.',
        highlight: '2,500 saplings',
        impact: 'Greener neighborhoods, student awareness',
    },
    {
        year: '2022',
        title: 'Flood Relief Support',
        description:
            'Distributed ration kits, hygiene packs, and temporary shelter materials to affected families.',
        highlight: '900 families reached',
        impact: 'Immediate relief, safer recovery',
    },
];

const Achievements = () => {
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
                                Achievements
                            </Typography>
                        </Box>

                        {/* Intro */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.7 }}>
                                A snapshot of milestones powered by our volunteers, donors, and partners. Each achievement
                                reflects the collective effort to uplift communities with health, education, and dignity.
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
