import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Box, Container, Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const sections = [
    {
        title: 'Shankhnad Foundation',
        items: [
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.',
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.',
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.',
        ],
    },
    {
        title: 'Foundation Goal',
        items: [
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.',
        ],
    },
    {
        title: 'Foundation Importance',
        items: [
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.',
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.',
        ],
    },
    {
        title: 'Our Value',
        items: [
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.',
        ],
    },
    {
        title: 'Our Impact',
        items: [
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.',
        ],
    },
    {
        title: 'Join Us',
        items: [
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione exercitationem explicabo beatae odio molestiae vero deserunt quo, esse numquam cupiditate aperiam nulla earum tempore ea odit at amet quod.',
        ],
    },
];

const AboutUs = () => {
    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
                        {/* Header */}
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
                                About us
                            </Typography>
                        </Box>

                        {/* Content Sections */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {sections.map((section, idx) => (
                                <Box key={section.title}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
                                        {section.title}
                                    </Typography>
                                    <List sx={{ pl: 2, py: 0 }}>
                                        {section.items.map((item, itemIdx) => (
                                            <ListItem key={itemIdx} sx={{ py: 0.5, alignItems: 'flex-start' }}>
                                                <ListItemText
                                                    primaryTypographyProps={{ variant: 'body2', sx: { color: '#444', lineHeight: 1.6 } }}
                                                    primary={`> ${item}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                    {idx !== sections.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default AboutUs;
