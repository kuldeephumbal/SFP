import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Navbar />
            <Container maxWidth="md" sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 8,
                textAlign: 'center'
            }}>
                <Box
                    component="img"
                    src="/assets/img/404-not-found.png"
                    alt="404 Not Found"
                    sx={{
                        width: '100%',
                        maxWidth: 450,
                        height: 'auto',
                        mb: 4,
                        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
                    }}
                />
                
                <Typography variant="h2" sx={{ 
                    fontWeight: 800, 
                    color: '#1e293b',
                    mb: 1,
                    fontSize: { xs: '3rem', md: '4rem' }
                }}>
                    404
                </Typography>
                
                <Typography variant="h5" sx={{ 
                    color: '#64748b', 
                    mb: 4,
                    fontWeight: 500
                }}>
                    {t('not_found.message') || "Oops! The page you're looking for doesn't exist."}
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Home />}
                    onClick={() => navigate('/')}
                    sx={{
                        bgcolor: '#1976d2',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                        '&:hover': {
                            bgcolor: '#1565c0',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
                        }
                    }}
                >
                    {t('not_found.back_home') || "Back to Home"}
                </Button>
            </Container>
            <Footer />
        </Box>
    );
};

export default NotFound;
