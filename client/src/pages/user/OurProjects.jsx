import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Paper,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Stack
} from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function OurProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Format date/time for display
    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = hours.toString().padStart(2, '0');
        return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
    };

    const fetchProjects = () => {
        axios
            .get('http://localhost:5000/api/projects')
            .then((response) => {
                setProjects(response.data || []);
            })
            .catch((error) => {
                console.error('Error fetching projects:', error);
                setProjects([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    bgcolor: '#f5f5f5',
                    minHeight: '100vh',
                    py: { xs: 2, sm: 3, md: 4 }
                }}
            >
                <Container maxWidth="lg">
                    {/* Header */}
                    <Paper
                        sx={{
                            bgcolor: '#1976d2',
                            color: 'white',
                            py: { xs: 2, sm: 2.5, md: 3 },
                            px: { xs: 2, sm: 3, md: 4 },
                            mb: 4,
                            borderRadius: 1,
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Our Projects
                        </Typography>
                    </Paper>

                    {/* Content */}
                    <Paper
                        sx={{
                            p: { xs: 2, sm: 3, md: 4 },
                            borderRadius: 1,
                            minHeight: '400px'
                        }}
                    >
                        {loading ? (
                            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '400px' }}>
                                <CircularProgress />
                                <Typography sx={{ mt: 2 }}>Loading projects...</Typography>
                            </Stack>
                        ) : projects.length > 0 ? (
                            <Grid container spacing={3}>
                                {projects.map((project) => (
                                    <Grid item xs={12} key={project.id}>
                                        <Card
                                            sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'column', md: 'row' },
                                                boxShadow: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: 4,
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            {/* Project Image */}
                                            <CardMedia
                                                component="img"
                                                image={`http://localhost:5000${project.photo}`}
                                                alt={project.topic}
                                                sx={{
                                                    width: { xs: '100%', md: '35%' },
                                                    height: { xs: 200, md: 'auto' },
                                                    objectFit: 'cover'
                                                }}
                                            />

                                            {/* Project Details */}
                                            <CardContent
                                                sx={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Box>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 600,
                                                            mb: 1.5,
                                                            color: '#1976d2'
                                                        }}
                                                    >
                                                        {project.topic}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        sx={{
                                                            mb: 2,
                                                            lineHeight: 1.6
                                                        }}
                                                    >
                                                        {project.topic_details}
                                                    </Typography>
                                                </Box>

                                                {/* Last Updated */}
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: '#666',
                                                        fontStyle: 'italic'
                                                    }}
                                                >
                                                    <strong>Last updated:</strong> {formatDateTime(project.created_at)}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '400px' }}>
                                <Typography variant="body1" color="textSecondary">
                                    No projects found.
                                </Typography>
                            </Stack>
                        )}
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
}
