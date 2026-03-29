import { Box, Container, Grid, Typography, IconButton, Link as MuiLink, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, X as XIcon, Instagram, YouTube, LocationOn, Phone, Email } from '@mui/icons-material';

const Footer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <Box sx={{ bgcolor: '#2c3e50', color: 'white', py: 5 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent={{ xs: 'center', md: 'space-between' }} alignItems="flex-start">
                    {/* Logo & Follow Us Section */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                            <Box sx={{ 
                                width: '100%', 
                                maxWidth: '320px', 
                                display: 'flex', 
                                flexDirection: { xs: 'row', md: 'column' }, 
                                alignItems: { xs: 'center', md: 'flex-start' }, 
                                gap: { xs: 3, md: 2 } 
                            }}>
                                <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: 2, flexShrink: 0 }}>
                                    <img
                                        src="/assets/img/Shankhnad-logo.png"
                                        alt={t('foundation_name')}
                                        style={{ width: 80 }}
                                    />
                                </Box>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{t('footer.follow_us')}</Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton component="a" href="https://www.facebook.com/shankhnadnews/" target="_blank" size="small" sx={{ bgcolor: '#3b5998', color: 'white', p: 0.8, '&:hover': { bgcolor: '#2d4373' } }}>
                                            <Facebook fontSize="small" />
                                        </IconButton>
                                        <IconButton component="a" href="https://x.com/NewsShankhnad" target="_blank" size="small" sx={{ bgcolor: '#000000', color: 'white', p: 0.8, '&:hover': { bgcolor: '#333333' } }}>
                                            <XIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton component="a" href="https://www.instagram.com/shankhnad_the_voice/" target="_blank" size="small" sx={{ bgcolor: '#e4405f', color: 'white', p: 0.8, '&:hover': { bgcolor: '#c13584' } }}>
                                            <Instagram fontSize="small" />
                                        </IconButton>
                                        <IconButton component="a" href="https://www.youtube.com/channel/UC-FPnJJ5-YAYTjTrt7P1o4w" target="_blank" size="small" sx={{ bgcolor: '#ff0000', color: 'white', p: 0.8, '&:hover': { bgcolor: '#cc0000' } }}>
                                            <YouTube fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Contact Info Section - Address last */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 3, 
                            width: '100%', 
                            alignItems: { xs: 'center', md: 'flex-start' }, 
                            textAlign: 'left' 
                        }}>
                            {/* Grouping for perfect vertical alignment of icons while centering the group */}
                            <Box sx={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
                                    <Phone sx={{ color: '#ecf0f1', fontSize: '1.5rem', mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{t('footer.call_us')}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>+91 98792 75333</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
                                    <Email sx={{ color: '#ecf0f1', fontSize: '1.5rem', mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{t('footer.email')}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>shanknadfs@gmail.com</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
                                    <LocationOn sx={{ color: '#ecf0f1', fontSize: '1.5rem', mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{t('footer.address')}</Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: '280px' }}>
                                            {t('footer.footer_address', 'Shankhanad News, 402-Dwarkesh Flat, Sihor Pin - 364240')}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Useful Links Section */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, textAlign: 'left' }}>
                            <Box sx={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, pb: 1, borderBottom: '2px solid rgba(255,255,255,0.1)', width: '100%' }}>{t('footer.useful_links')}</Typography>
                                <Grid container spacing={2} sx={{ width: '100%' }}>
                                <Grid size={{ xs: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, alignItems: 'flex-start' }}>
                                        <MuiLink component={Link} to="/" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.home')}</MuiLink>
                                        <MuiLink component={Link} to="/member-apply" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.apply')}</MuiLink>
                                        <MuiLink component={Link} to="/our-team" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.team')}</MuiLink>
                                        <MuiLink component={Link} to="/donors" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.donors_list')}</MuiLink>
                                        <MuiLink component={Link} to="/contact" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.contact')}</MuiLink>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, alignItems: 'flex-start' }}>
                                        <MuiLink component={Link} to="/upcoming-events" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.upcoming_events')}</MuiLink>
                                        <MuiLink component={Link} to="/donate" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.donate')}</MuiLink>
                                        <MuiLink component={Link} to="/gallery" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.gallery')}</MuiLink>
                                        <MuiLink component={Link} to="/projects" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.our_projects')}</MuiLink>
                                        <MuiLink component={Link} to="/about" color="inherit" underline="hover" sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}>{t('navbar.about')}</MuiLink>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                </Grid>
                <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Copyright © 2025, {t('footer.rights')}{' '}
                        <MuiLink component={Link} to="/" color="#42a5f5" underline="hover" sx={{ fontWeight: 600 }}>
                            {t('foundation_name')}
                        </MuiLink>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <MuiLink
                            component="button"
                            onClick={() => navigate('/terms')}
                            color="inherit"
                            underline="hover"
                            sx={{ fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                        >
                            {t('footer.terms')}
                        </MuiLink>
                        <MuiLink
                            component="button"
                            onClick={() => navigate('/privacy')}
                            color="inherit"
                            underline="hover"
                            sx={{ fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                        >
                            {t('footer.privacy')}
                        </MuiLink>
                        <MuiLink
                            component="button"
                            onClick={() => navigate('/disclaimer')}
                            color="inherit"
                            underline="hover"
                            sx={{ fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                        >
                            {t('footer.disclaimer')}
                        </MuiLink>
                        <MuiLink
                            component="button"
                            onClick={() => navigate('/refund')}
                            color="inherit"
                            underline="hover"
                            sx={{ fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                        >
                            {t('footer.refund')}
                        </MuiLink>
                    </Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        {t('footer.designed_by')}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
