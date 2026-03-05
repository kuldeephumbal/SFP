import React, { useState, useEffect } from 'react';
import {
    Box,
    ThemeProvider,
    createTheme,
    CssBaseline,
    useMediaQuery
} from '@mui/material';
import Header from '../components/header';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
    // Initialize sidebar as open by default
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebarOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [isDarkMode, setIsDarkMode] = useState(true);
    const isMobile = useMediaQuery('(max-width:900px)');
    const [backgroundImage, setBackgroundImage] = useState('');

    // Load background image from localStorage
    useEffect(() => {
        const savedBg = localStorage.getItem('backgroundImage');
        if (savedBg) {
            setBackgroundImage(savedBg);
        }
    }, []);

    // Listen for background image changes
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'backgroundImage') {
                setBackgroundImage(e.newValue || '');
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom event for same-tab updates
        const handleBgChange = (e) => {
            setBackgroundImage(e.detail);
        };
        window.addEventListener('backgroundImageChange', handleBgChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('backgroundImageChange', handleBgChange);
        };
    }, []);

    // Save sidebar state to localStorage
    const handleSidebarToggle = () => {
        const newState = !sidebarOpen;
        setSidebarOpen(newState);
        localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    };

    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            background: {
                default: isDarkMode ? '#0f172a' : '#f8fafc',
                paper: isDarkMode ? '#1e293b' : '#ffffff'
            },
            text: {
                primary: isDarkMode ? '#ffffff' : '#1e293b'
            }
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }
    });

    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
                <Header
                    onMenuClick={handleSidebarToggle}
                    sidebarOpen={sidebarOpen}
                    isDarkMode={isDarkMode}
                    onThemeToggle={handleThemeToggle}
                />

                <Sidebar
                    open={sidebarOpen}
                    onClose={handleSidebarToggle}
                    isDarkMode={isDarkMode}
                />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        mt: 8,
                        backgroundColor: backgroundImage ? 'transparent' : 'background.default',
                        backgroundImage: backgroundImage ? `url(http://localhost:5000${backgroundImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        minHeight: 'calc(100vh - 64px)',
                        // Manually position content next to fixed sidebar
                        marginLeft: !isMobile && sidebarOpen ? '280px' : 0,
                        width: !isMobile && sidebarOpen ? 'calc(100% - 280px)' : '100%',
                        transition: 'margin 0.3s ease, width 0.3s ease',
                        overflowX: 'auto',
                        overflowY: 'auto',
                        position: 'relative',
                        boxSizing: 'border-box',
                        '&::before': backgroundImage ? {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 0
                        } : {},
                        '& > *': {
                            position: 'relative',
                            zIndex: 1
                        },
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px'
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '10px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgba(255, 255, 255, 0.3)', // Brighter thumb
                            borderRadius: '10px',
                            border: '2px solid transparent',
                            backgroundClip: 'padding-box',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.4)',
                                border: '2px solid transparent',
                                backgroundClip: 'padding-box'
                            }
                        }
                    }}
                >
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default MainLayout;
