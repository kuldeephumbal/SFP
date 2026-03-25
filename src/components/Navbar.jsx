import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Facebook, X as XIcon, Instagram, YouTube, Menu as MenuIcon } from '@mui/icons-material';

const Navbar = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [aboutAnchorEl, setAboutAnchorEl] = useState(null);
    const [importantAnchorEl, setImportantAnchorEl] = useState(null);
    const [langAnchorEl, setLangAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:900px)');

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
        setLangAnchorEl(null);
        setMobileOpen(false);
    };

    const handleLangOpen = (event) => {
        setLangAnchorEl(event.currentTarget);
    };

    const handleLangClose = () => {
        setLangAnchorEl(null);
    };

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
        <Box
            sx={{
                width: 260,
                maxWidth: '80vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
            role="presentation"
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 2 }}>
                <img src="/assets/img/Shankhnad-logo.png" alt="Logo" style={{ height: 40 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1976d2' }}>
                    {t('foundation_name')}
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List sx={{ py: 0 }}>
                    <ListItemButton onClick={() => handleMobileNavigate('/')}
                        sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.home')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/member-apply')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.apply')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/upcoming-events')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.upcoming_events')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/donate')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.donate')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/donors')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.donors_list')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/gallery')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.gallery')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/contact')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.contact')} />
                    </ListItemButton>
                </List>
                <Divider />
                <List sx={{ py: 0 }}>
                    <ListItemButton onClick={() => handleMobileNavigate('/about')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.about')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/our-team')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.team')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/achievements')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.achievements')} />
                    </ListItemButton>
                </List>
                <Divider />
                <List sx={{ py: 0 }}>
                    <ListItemButton onClick={() => handleMobileNavigate('/crowdfunding')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.crowdfunding')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/your-problems')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.your_problems')} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleMobileNavigate('/projects')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.our_projects')} />
                    </ListItemButton>
                </List>
                <Divider />
                <List sx={{ py: 0 }}>
                    <ListItemButton onClick={() => handleMobileNavigate('/login')} sx={{ py: 1.2 }}>
                        <ListItemText primary={t('navbar.login')} />
                    </ListItemButton>
                </List>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>Language / ભાષા / भाषा</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant={i18n.language === 'en' ? 'contained' : 'outlined'} onClick={() => changeLanguage('en')}>EN</Button>
                    <Button size="small" variant={i18n.language === 'gu' ? 'contained' : 'outlined'} onClick={() => changeLanguage('gu')}>ગુજ</Button>
                    <Button size="small" variant={i18n.language === 'hi' ? 'contained' : 'outlined'} onClick={() => changeLanguage('hi')}>हिन्दी</Button>
                </Box>
            </Box>
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
                        <Box onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                            <img src="/assets/img/Shankhnad-logo.png" alt="Logo" style={{ height: 42 }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', ml: 0.5, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                                {t('foundation_name')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button
                                size="small"
                                onClick={handleLangOpen}
                                sx={{ color: '#1976d2', fontWeight: 600, border: '1px solid #1976d2' }}
                            >
                                {i18n.language === 'en' ? 'English' : i18n.language === 'gu' ? 'ગુજરાતી' : 'हिन्दी'}
                            </Button>
                            <Menu
                                anchorEl={langAnchorEl}
                                open={Boolean(langAnchorEl)}
                                onClose={handleLangClose}
                            >
                                <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
                                <MenuItem onClick={() => changeLanguage('gu')}>ગુજરાતી (Gujarati)</MenuItem>
                                <MenuItem onClick={() => changeLanguage('hi')}>हिन्दी (Hindi)</MenuItem>
                            </Menu>
                            <IconButton component="a" href="https://www.facebook.com/shankhnadnews/" target="_blank" size="small" sx={{ color: '#3b5998', bgcolor: '#f0f0f0' }}>
                                <Facebook />
                            </IconButton>
                            <IconButton component="a" href="https://x.com/NewsShankhnad" target="_blank" size="small" sx={{ color: '#000000', bgcolor: '#f0f0f0' }}>
                                <XIcon />
                            </IconButton>
                            <IconButton component="a" href="https://www.instagram.com/shankhnad_the_voice/" target="_blank" size="small" sx={{ color: '#e4405f', bgcolor: '#f0f0f0' }}>
                                <Instagram />
                            </IconButton>
                            <IconButton component="a" href="https://www.youtube.com/channel/UC-FPnJJ5-YAYTjTrt7P1o4w" target="_blank" size="small" sx={{ color: '#ff0000', bgcolor: '#f0f0f0' }}>
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
                            <Box onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                                <img src="/assets/img/Shankhnad-logo.png" alt="Logo" style={{ height: 28 }} />
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: { xs: '0.75rem', sm: '0.9rem' },
                                    lineHeight: 1.2
                                }}>
                                    {t('foundation_name')}
                                </Typography>
                            </Box>
                            <IconButton onClick={handleDrawerToggle} sx={{ color: 'white', p: 0.5 }}>
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%', justifyContent: 'space-between' }}>
                            <Button
                                onClick={() => navigate('/')}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.home')}
                            </Button>
                            <Button
                                onClick={() => navigate('/member-apply')}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.apply')}
                            </Button>
                            <Button
                                onClick={() => navigate('/upcoming-events')}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.upcoming_events')}
                            </Button>
                            <Button
                                onClick={() => navigate('/donate')}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.donate')}
                            </Button>
                            <Button
                                onClick={() => navigate('/donors')}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.donors_list')}
                            </Button>
                            <Button
                                onClick={() => navigate('/gallery')}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.gallery')}
                            </Button>
                            <Button
                                onClick={() => navigate('/contact')}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.contact')}
                            </Button>
                            <Button
                                id="about-menu-button"
                                onClick={handleAboutOpen}
                                aria-controls={aboutAnchorEl ? 'about-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={aboutAnchorEl ? 'true' : undefined}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.about')}
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
                                <MenuItem onClick={() => handleAboutNavigate('/about')}>{t('navbar.about')}</MenuItem>
                                <MenuItem onClick={() => handleAboutNavigate('/our-team')}>{t('navbar.team')}</MenuItem>
                                <MenuItem onClick={() => handleAboutNavigate('/achievements')}>
                                    {t('navbar.achievements')}
                                </MenuItem>
                            </Menu>
                            <Button
                                id="important-menu-button"
                                onClick={handleImportantOpen}
                                aria-controls={importantAnchorEl ? 'important-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={importantAnchorEl ? 'true' : undefined}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.important_links')}
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
                                <MenuItem onClick={() => handleImportantNavigate('/crowdfunding')}>{t('navbar.crowdfunding')}</MenuItem>
                                <MenuItem onClick={() => handleImportantNavigate('/your-problems')}>{t('navbar.your_problems')}</MenuItem>
                                <MenuItem onClick={() => handleImportantNavigate('/projects')}>{t('navbar.our_projects')}</MenuItem>
                            </Menu>
                            <Button
                                onClick={() => navigate('/login')}
                                sx={{ color: 'white', px: 1.5, py: 2.2, borderRadius: 0, '&:hover': { bgcolor: '#1565c0' }, fontSize: '0.7rem', textTransform: 'uppercase' }}
                            >
                                {t('navbar.login')}
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
