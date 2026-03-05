import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    ThemeProvider,
    createTheme,
    CssBaseline,
    useMediaQuery
} from '@mui/material';
import Header from './components/header';
import Sidebar from './components/Sidebar';

const App = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebarOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [backgroundImage, setBackgroundImage] = useState('');
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width:900px)');

    // Correct theme configuration
    const theme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#0f172a',
                paper: '#1e293b'
            },
            text: {
                primary: '#ffffff'
            }
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    '*::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '*::-webkit-scrollbar-track': {
                        background: 'rgba(0, 0, 0, 0.1)',
                    },
                    '*::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.3)',
                        }
                    }
                }
            }
        }
    });

    useEffect(() => {
        const savedBg = localStorage.getItem('backgroundImage');
        if (savedBg) setBackgroundImage(savedBg);
    }, []);

    const handleSidebarToggle = () => {
        const newState = !sidebarOpen;
        setSidebarOpen(newState);
        localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    };

    const handleThemeToggle = () => setIsDarkMode(!isDarkMode);

    const showLayout = !location.pathname.includes('404');

    if (!showLayout) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
                <Sidebar
                    open={sidebarOpen}
                    onClose={handleSidebarToggle}
                />

                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        // On desktop, the flex container handles the width automatically.
                        // We don't need manual calculated widths or margins here because
                        // the sidebar is a sibling in this flex box.
                        width: '100%',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Header
                        onMenuClick={handleSidebarToggle}
                        isDarkMode={isDarkMode}
                        onThemeToggle={handleThemeToggle}
                        sidebarOpen={sidebarOpen}
                    />

                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: { xs: 2, sm: 3 },
                            pt: { xs: '80px', sm: '88px' },
                            backgroundColor: backgroundImage ? 'transparent' : 'background.default',
                            backgroundImage: backgroundImage ? `url(http://localhost:5000${backgroundImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundAttachment: 'fixed',
                            position: 'relative',
                            overflow: 'auto', // Allow standard scrolling
                            zIndex: 1,
                            '&::before': backgroundImage ? {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: -1
                            } : {}
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default App;
