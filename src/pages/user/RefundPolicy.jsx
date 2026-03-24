import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Box, Container, Paper, Typography } from '@mui/material';

const RefundPolicy = () => {
    const { t } = useTranslation();

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
                                {t('refund_policy.title')}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#444',
                                lineHeight: 1.8,
                                textAlign: 'justify',
                                whiteSpace: 'pre-line'
                            }}
                        >
                            {t('refund_policy.content')}
                        </Typography>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default RefundPolicy;
