import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Box, Container, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const AboutUs = () => {
    const { t } = useTranslation();

    // Using the translated content from our dictionary
    const aboutParagraphs = [
        t('about_section.p1'),
        t('about_section.p2'),
        t('about_section.p3'),
        t('about_section.p4'),
        t('about_section.p5')
    ];

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
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
                                {t('navbar.about')}
                            </Typography>
                        </Box>

                        {/* Content Section */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                                {t('navbar.about')}
                            </Typography>
                            {aboutParagraphs.map((para, idx) => (
                                <Typography key={idx} variant="body1" sx={{ color: '#444', lineHeight: 1.8, textAlign: 'justify' }}>
                                    {para}
                                </Typography>
                            ))}
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default AboutUs;
