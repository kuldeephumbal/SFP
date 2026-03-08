import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api, { IMAGE_BASE_URL } from '../../components/BaseURL';
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
    const { t } = useTranslation();
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
                toast.error(t('team.error_loading'));
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
                            {t('team.title')}
                        </Typography>
                    </Box>

                    {/* Search Bar */}
                    <Box
                        sx={{
                            mb: 4,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
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
                    ) : filteredMembers.length > 0 ? (
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
                            {filteredMembers.map((member) => (
                                <Card
                                    key={member._id}
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
                                        image={member.photo ? `${IMAGE_BASE_URL}/${member.photo.replace(/^\/+/, '')}` : '/assets/img/default-member.png'}
                                        alt={member.name}
                                        sx={{
                                            height: { xs: 200, sm: 220 },
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: '#333',
                                                mb: 0.5,
                                                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' }
                                            }}
                                        >
                                            {member.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#666',
                                                fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
                                            }}
                                        >
                                            ({member.status})
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" color="textSecondary">
                                {t('team.no_user')}
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
