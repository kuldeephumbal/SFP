import { useState } from 'react';
import { AppBar, Toolbar, Button, Container, Box, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';

const Navbar = () => {
    const navigate = useNavigate();
    const [aboutAnchorEl, setAboutAnchorEl] = useState(null);
    const [importantAnchorEl, setImportantAnchorEl] = useState(null);

    const handleAboutOpen = (event) => {
        setAboutAnchorEl(event.currentTarget);
    };

    const handleAboutClose = () => {
        setAboutAnchorEl(null);
    };

    const handleAboutNavigate = (path) => {
        navigate(path);
        handleAboutClose();
    };

    const handleImportantOpen = (event) => {
        setImportantAnchorEl(event.currentTarget);
    };

    const handleImportantClose = () => {
        setImportantAnchorEl(null);
    };

    const handleImportantNavigate = (path) => {
        navigate(path);
        handleImportantClose();
    };

    return (
        <>
            {/* Top Social Bar */}
            <Box sx={{ bgcolor: 'white', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <img src="/assets/img/Shankhnad-logo.png" alt="Logo" style={{ height: 50 }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                            Shankhnad Foundation
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" sx={{ color: '#3b5998', bgcolor: '#f0f0f0' }}>
                                <Facebook />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#1da1f2', bgcolor: '#f0f0f0' }}>
                                <Twitter />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#e4405f', bgcolor: '#f0f0f0' }}>
                                <Instagram />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#ff0000', bgcolor: '#f0f0f0' }}>
                                <YouTube />
                            </IconButton>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Header/Navbar */}
            <AppBar position="sticky" sx={{ bgcolor: '#1976d2', color: 'white', boxShadow: 0 }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between', gap: 0, minHeight: '40px !important', py: 0 }}>
                        <Button
                            onClick={() => navigate('/')}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            Home
                        </Button>
                        <Button
                            onClick={() => navigate('/member-apply')}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            Member Apply
                        </Button>
                        <Button
                            onClick={() => navigate('/upcoming-events')}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            Upcoming Events
                        </Button>
                        <Button
                            onClick={() => navigate('/donate')}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            Donate
                        </Button>
                        <Button
                            onClick={() => navigate('/donors')}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            List of donors
                        </Button>
                        <Button
                            onClick={() => navigate('/gallery')}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            Gallery
                        </Button>
                        <Button
                            onClick={() => navigate('/contact')}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            Contact us
                        </Button>
                        <Button
                            id="about-menu-button"
                            onClick={handleAboutOpen}
                            aria-controls={aboutAnchorEl ? 'about-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={aboutAnchorEl ? 'true' : undefined}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            About Us
                        </Button>
                        <Menu
                            id="about-menu"
                            anchorEl={aboutAnchorEl}
                            open={Boolean(aboutAnchorEl)}
                            onClose={handleAboutClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            MenuListProps={{ 'aria-labelledby': 'about-menu-button' }}
                        >
                            <MenuItem onClick={() => handleAboutNavigate('/about')}>About Us</MenuItem>
                            <MenuItem onClick={() => handleAboutNavigate('/our-team')}>Our Team</MenuItem>
                            <MenuItem onClick={() => handleAboutNavigate('/achievements')}>
                                Achievements
                            </MenuItem>
                        </Menu>
                        <Button
                            id="important-menu-button"
                            onClick={handleImportantOpen}
                            aria-controls={importantAnchorEl ? 'important-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={importantAnchorEl ? 'true' : undefined}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            Important links
                        </Button>
                        <Menu
                            id="important-menu"
                            anchorEl={importantAnchorEl}
                            open={Boolean(importantAnchorEl)}
                            onClose={handleImportantClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            MenuListProps={{ 'aria-labelledby': 'important-menu-button' }}
                        >
                            <MenuItem onClick={() => handleImportantNavigate('/crowdfunding')}>Crowdfunding</MenuItem>
                            <MenuItem onClick={() => handleImportantNavigate('/your-problems')}>Your problems</MenuItem>
                            <MenuItem onClick={() => handleImportantNavigate('/projects')}>Our projects</MenuItem>
                        </Menu>
                        <Button
                            onClick={() => navigate('/login')}
                            sx={{ color: 'white', px: 1.5, py: 1, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                        >
                            Login
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Navbar;
