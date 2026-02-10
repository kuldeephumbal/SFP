import React, { useState, useEffect } from 'react';
import {
    Box,
    ThemeProvider,
    createTheme,
    CssBaseline
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
            <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
                <Header
                    onMenuClick={handleSidebarToggle}
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
                        width: '100%',
                        overflow: 'auto',
                        position: 'relative',
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
                            display: 'none !important',
                            width: '0 !important',
                            height: '0 !important'
                        },
                        scrollbarWidth: 'none !important',
                        msOverflowStyle: 'none !important',
                        '& *::-webkit-scrollbar': {
                            display: 'none !important',
                            width: '0 !important',
                            height: '0 !important'
                        },
                        '& *': {
                            scrollbarWidth: 'none !important',
                            msOverflowStyle: 'none !important'
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
