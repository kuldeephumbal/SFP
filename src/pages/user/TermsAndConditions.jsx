import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Box, Container, Paper, Typography } from '@mui/material';

const TermsAndConditions = () => {
    const { t } = useTranslation();
    const foundationName = t('foundation_name');
    const opts = { foundation: foundationName };

    const sections = [
        { titleKey: 'terms_conditions.section_acceptance', contentKey: 'terms_conditions.acceptance' },
        { titleKey: 'terms_conditions.section_registration', contentKey: 'terms_conditions.registration' },
        { titleKey: 'terms_conditions.section_using', contentKey: 'terms_conditions.using' },
        { titleKey: 'terms_conditions.section_content', contentKey: 'terms_conditions.content' },
        { titleKey: 'terms_conditions.section_feedback', contentKey: 'terms_conditions.feedback' },
        { titleKey: 'terms_conditions.section_social', contentKey: 'terms_conditions.social' },
        { titleKey: 'terms_conditions.section_availability', contentKey: 'terms_conditions.availability' },
        { titleKey: 'terms_conditions.section_links', contentKey: 'terms_conditions.links' },
        { titleKey: 'terms_conditions.section_ads', contentKey: 'terms_conditions.ads' },
        { titleKey: 'terms_conditions.section_personal', contentKey: 'terms_conditions.personal' },
        { titleKey: 'terms_conditions.section_limitation', contentKey: 'terms_conditions.limitation' },
        { titleKey: 'terms_conditions.section_misc', contentKey: 'terms_conditions.misc' }
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
                                {t('terms_conditions.title')}
                            </Typography>
                        </Box>

                        {/* Content Sections */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {sections.map((section, idx) => (
                                <Box key={idx}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#1976d2' }}>
                                        {t(section.titleKey, opts)}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#444',
                                            lineHeight: 1.8,
                                            textAlign: 'justify',
                                            whiteSpace: 'pre-line'
                                        }}
                                    >
                                        {t(section.contentKey, opts)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default TermsAndConditions;
