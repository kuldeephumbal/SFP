import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../components/BaseURL';
import {
    Box,
    Container,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    TextField,
    CircularProgress,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OurTeam = () => {
    const [members, setMembers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = () => {
        api.get('/member')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setMembers(response.data);
                } else {
                    setMembers([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching members:', error);
                toast.error('Error loading team');
                setLoading(false);
            });
    };

    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <ToastContainer position="top-right" autoClose={3000} />

                    {/* Header */}
                    <Box
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            textAlign: 'center',
                            py: { xs: 1.5, sm: 2 },
                            mb: 4,
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Our Team
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            placeholder="🔍 Search here..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{
                                width: { xs: '100%', sm: '80%', md: '50%' },
                                backgroundColor: 'white',
                                borderRadius: 1,
                            }}
                        />
                    </Box>

                    {/* Loading State */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredMembers.length > 0 ? (
                        <Grid container spacing={3}>
                            {filteredMembers.map((member) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={member._id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textAlign: 'center',
                                            boxShadow: 2,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                boxShadow: 4,
                                                transform: 'translateY(-5px)',
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={member.photo ? `http://localhost:5000/${member.photo.replace(/^\/*/, '')}` : '/assets/img/default-member.png'}
                                            alt={member.name}
                                            sx={{ height: 200, objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}
                                            >
                                                {member.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                ({member.status})
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" color="textSecondary">
                                No user registered by this name.
                            </Typography>
                        </Box>
                    )}
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default OurTeam;
