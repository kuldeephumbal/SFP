import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Box, Container, Paper, Typography } from '@mui/material';

const Disclaimer = () => {
    const { t } = useTranslation();
    const opts = {
        foundation: t('foundation_name'),
        address: t('footer.footer_address')
    };

    const sections = [
        { titleKey: 'disclaimer.section_access', contentKey: 'disclaimer.access_content' },
        { titleKey: 'disclaimer.section_use', contentKey: 'disclaimer.use_content' },
        { titleKey: 'disclaimer.section_address', contentKey: 'disclaimer.address_content' }
    ];

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
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
                                {t('disclaimer.title')}
                            </Typography>
                        </Box>
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

export default Disclaimer;
