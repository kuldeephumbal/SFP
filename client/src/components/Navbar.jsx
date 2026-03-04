import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Container,
    Box,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, YouTube, Menu as MenuIcon } from '@mui/icons-material';

const Navbar = () => {
    const navigate = useNavigate();
    const [aboutAnchorEl, setAboutAnchorEl] = useState(null);
    const [importantAnchorEl, setImportantAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:900px)');

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

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    const handleMobileNavigate = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const drawerContent = (
        <Box sx={{ width: 260 }} role="presentation">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 2 }}>
                <img src="/assets/img/Shankhnad-logo.png" alt="Logo" style={{ height: 40 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1976d2' }}>
                    Shankhnad Foundation
                </Typography>
            </Box>
            <Divider />
            <List sx={{ py: 0 }}>
                <ListItemButton onClick={() => handleMobileNavigate('/')}
                    sx={{ py: 1.2 }}>
                    <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/member-apply')} sx={{ py: 1.2 }}>
                    <ListItemText primary="Member Apply" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/upcoming-events')} sx={{ py: 1.2 }}>
                    <ListItemText primary="Upcoming Events" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/donate')} sx={{ py: 1.2 }}>
                    <ListItemText primary="Donate" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/donors')} sx={{ py: 1.2 }}>
                    <ListItemText primary="List of donors" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/gallery')} sx={{ py: 1.2 }}>
                    <ListItemText primary="Gallery" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/contact')} sx={{ py: 1.2 }}>
                    <ListItemText primary="Contact Us" />
                </ListItemButton>
            </List>
            <Divider />
            <List sx={{ py: 0 }}>
                <ListItemButton onClick={() => handleMobileNavigate('/about')} sx={{ py: 1.2 }}>
                    <ListItemText primary="About Us" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/our-team')} sx={{ pl: 4, py: 1 }}>
                    <ListItemText primary="Our Team" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/achievements')} sx={{ pl: 4, py: 1 }}>
                    <ListItemText primary="Achievements" />
                </ListItemButton>
            </List>
            <Divider />
            <List sx={{ py: 0 }}>
                <ListItemButton onClick={() => handleMobileNavigate('/crowdfunding')} sx={{ py: 1.2 }}>
                    <ListItemText primary="Crowdfunding" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/your-problems')} sx={{ py: 1.2 }}>
                    <ListItemText primary="Your problems" />
                </ListItemButton>
                <ListItemButton onClick={() => handleMobileNavigate('/projects')} sx={{ py: 1.2 }}>
                    <ListItemText primary="Our projects" />
                </ListItemButton>
            </List>
            <Divider />
            <List sx={{ py: 0 }}>
                <ListItemButton onClick={() => handleMobileNavigate('/login')} sx={{ py: 1.2 }}>
                    <ListItemText primary="Login" />
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <>
            {/* Top Social Bar */}
            <Box sx={{ bgcolor: 'white', py: { xs: 1, md: 1 }, borderBottom: '1px solid #e0e0e0', display: { xs: 'none', md: 'block' } }}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 1, md: 0 }
                    }}>
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
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Toolbar sx={{ justifyContent: 'space-between', gap: 0, minHeight: '56px !important', py: 0 }}>
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <img src="/assets/img/Shankhnad-logo.png" alt="Logo" style={{ height: 32 }} />
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: { xs: '0.85rem', sm: '1rem' },
                                    lineHeight: 1.2
                                }}>
                                    Shankhnad Foundation
                                </Typography>
                            </Box>
                            <IconButton onClick={handleDrawerToggle} sx={{ color: 'white', p: 0.5 }}>
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', justifyContent: 'space-between' }}>
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
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Navbar;
