import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
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

const ListOfDonor = () => {
    const [donations, setDonations] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchDonations = () => {
        axios.get('http://localhost:5000/api/donation')
            .then((response) => {
                setDonations(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching donations:', error);
                toast.error('Error loading donors');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // Filter donations based on donor full_name
    const filteredDonations = donations.filter((donation) =>
        donation.full_name.toLowerCase().includes(searchText.toLowerCase())
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
                            List of Donors
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            placeholder="🔍 Search donor by name..."
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
                    ) : filteredDonations.length > 0 ? (
                        <Grid container spacing={3}>
                            {filteredDonations.map((donation) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={donation.id}>
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
                                        {/* Donor Image */}
                                        <CardMedia
                                            component="img"
                                            image={`http://localhost:5000${donation.photo}`}
                                            alt={donation.full_name}
                                            sx={{
                                                height: 200,
                                                objectFit: 'cover',
                                            }}
                                        />

                                        {/* Card Content */}
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            {/* Donor Name */}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#333',
                                                    mb: 1,
                                                }}
                                            >
                                                {donation.full_name}
                                            </Typography>

                                            {/* Amount */}
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#4caf50',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                ₹{donation.amount}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" color="textSecondary">
                                No donor registered by this name.
                            </Typography>
                        </Box>
                    )}
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default ListOfDonor;
