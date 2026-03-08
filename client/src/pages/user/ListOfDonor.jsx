import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import api, { IMAGE_BASE_URL } from '../../components/BaseURL';

const ListOfDonor = () => {
    const { t } = useTranslation();
    const [donations, setDonations] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchDonations = () => {
        api.get('/donation')
            .then((response) => {
                setDonations(response.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching donations:', error);
                toast.error(t('donors.error_loading'));
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
                            {t('donors.title')}
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <TextField
                            placeholder={t('common.search')}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{
                                width: '100%',
                                maxWidth: { xs: 340, sm: 400, md: 480 },
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
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(2, minmax(0, 1fr))',
                                    sm: 'repeat(3, minmax(0, 1fr))',
                                    md: 'repeat(4, minmax(0, 1fr))',
                                },
                                gap: { xs: 2, sm: 3 },
                            }}
                        >
                            {filteredDonations.map((donation) => (
                                <Card
                                    key={donation._id}
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
                                        image={donation.photo ? `${IMAGE_BASE_URL}/${donation.photo.replace(/^\/+/, '')}` : '/assets/img/default-profile.jpg'}
                                        alt={donation.full_name}
                                        sx={{
                                            height: { xs: 140, sm: 160, md: 180 },
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
                                                mb: 0.5,
                                                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
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
                                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                            }}
                                        >
                                            ₹{donation.amount}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" color="textSecondary">
                                {t('donors.no_donor')}
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
