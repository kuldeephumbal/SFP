import { Box, Container, Grid, Typography, IconButton, Link, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube, LocationOn, Phone, Email } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: '#2c3e50', color: 'white', py: 5 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2 }}>
                                <img
                                    src="/assets/img/Shankhnad-logo.png"
                                    alt="Shankhnad Foundation"
                                    style={{ width: 100 }}
                                />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Follow Us</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton sx={{ bgcolor: '#3b5998', color: 'white', '&:hover': { bgcolor: '#2d4373' } }}>
                                    <Facebook />
                                </IconButton>
                                <IconButton sx={{ bgcolor: '#1da1f2', color: 'white', '&:hover': { bgcolor: '#0c85d0' } }}>
                                    <Twitter />
                                </IconButton>
                                <IconButton sx={{ bgcolor: '#e4405f', color: 'white', '&:hover': { bgcolor: '#c13584' } }}>
                                    <Instagram />
                                </IconButton>
                                <IconButton sx={{ bgcolor: '#ff0000', color: 'white', '&:hover': { bgcolor: '#cc0000' } }}>
                                    <YouTube />
                                </IconButton>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 2 }}>
                            <LocationOn sx={{ color: '#1976d2' }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Address</Typography>
                                <Typography variant="body2">
                                    Shankhnad Farm House - Sihor, Bhavnagar, Gujarat
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 2 }}>
                            <Phone sx={{ color: '#1976d2' }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Call Us</Typography>
                                <Typography variant="body2">+91 9725863699</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                            <Email sx={{ color: '#1976d2' }} />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Email</Typography>
                                <Typography variant="body2">shankhnad.tv.news@gmail.com</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Useful Links</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>Home</Link>
                            <Link href="/member-apply" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>Member Apply</Link>
                            <Link href="/our-team" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>Team Member</Link>
                            <Link href="/donors" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>List Of Donors</Link>
                            <Link href="/contact" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>Contact Us</Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 4 }}>
                            <Link href="/upcoming-events" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>Latest Event</Link>
                            <Link href="/donate" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>Donation</Link>
                            <Link href="/gallery" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>Gallery</Link>
                            <Link href="/projects" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>Our projects</Link>
                            <Link href="/about" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>About Us</Link>
                        </Box>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Copyright © 2025, All Right Reserved{' '}
                        <Link href="/" color="#42a5f5" underline="hover" sx={{ fontWeight: 600 }}>
                            Shankhnad Foundation
                        </Link>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>
                            Terms & Condition
                        </Link>
                        <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>
                            Privacy Policy
                        </Link>
                        <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>
                            Disclaimer
                        </Link>
                        <Link href="#" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>
                            Refund Policy
                        </Link>
                    </Box>
                    <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        Website Designed By - Kuldeep Humbal, Mob. - 9725863699
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
