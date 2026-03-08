import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api, { IMAGE_BASE_URL, getImageUrl } from '../../components/BaseURL';
import {
    Box,
    Container,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    CircularProgress,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpcomingEvents = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch upcoming events from the API
    const fetchEvents = () => {
        api.get('/upcoming-event')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setEvents(response.data);
                } else {
                    console.warn('Unexpected API response format:', response.data);
                    setEvents([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
                toast.error(t('events.error_loading'));
                setEvents([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Format date and time as "DD/MM/YYYY, HH:MM AM/PM"
    const formatDateTime = (date, time) => {
        const dateParts = date.split('-'); // Expect "YYYY-MM-DD"
        if (dateParts.length !== 3) return 'Invalid Date';
        const [year, month, day] = dateParts;

        const timeParts = time.split(':'); // Expect "HH:mm"
        if (timeParts.length < 2) return 'Invalid Date';
        const [hoursStr, minutes] = timeParts;

        // Parse integers
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const hoursNum = parseInt(hoursStr, 10);
        const minutesNum = parseInt(minutes, 10);

        const datetime = new Date(yearNum, monthNum - 1, dayNum, hoursNum, minutesNum, 0);
        if (isNaN(datetime)) return 'Invalid Date';

        const dd = datetime.getDate().toString().padStart(2, '0');
        const mm = (datetime.getMonth() + 1).toString().padStart(2, '0');
        const yyyy = datetime.getFullYear();

        let hrs = datetime.getHours();
        const mins = datetime.getMinutes().toString().padStart(2, '0');
        const ampm = hrs >= 12 ? 'PM' : 'AM';
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        hrs = hrs.toString().padStart(2, '0');

        return `${dd}/${mm}/${yyyy}, ${hrs}:${mins} ${ampm}`;
    };

    // Format datetime from ISO string
    const formatDateTime2 = (datetime) => {
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
                            {t('events.title')}
                        </Typography>
                    </Box>

                    {/* Loading State */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : events.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" color="textSecondary">
                                {t('common.no_items')}
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {events.map((event) => (
                                <Grid item xs={12} key={event._id}>
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', md: 'row' },
                                            boxShadow: 2,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: 4,
                                                transition: 'box-shadow 0.3s ease-in-out',
                                            },
                                        }}
                                    >
                                        {/* Image Section */}
                                        <CardMedia
                                            component="img"
                                            image={getImageUrl(event.photo)}
                                            alt={event.topic}
                                            sx={{
                                                width: { xs: '100%', md: '40%' },
                                                height: { xs: 250, md: 'auto' },
                                                objectFit: 'cover',
                                            }}
                                        />

                                        {/* Content Section */}
                                        <CardContent
                                            sx={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            {/* Location and Date */}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#666',
                                                    mb: 1,
                                                    fontWeight: 500,
                                                }}
                                            >
                                                📍 {t('events.location')}: <strong>{event.location}</strong> | 📅 {t('events.date')}:{' '}
                                                <strong>{formatDateTime(event.event_date, event.event_time)}</strong>
                                            </Typography>

                                            {/* Title */}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    mb: 1,
                                                    color: '#333',
                                                }}
                                            >
                                                {event.topic}
                                            </Typography>

                                            {/* Description */}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#555',
                                                    mb: 2,
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {event.topic_details}
                                            </Typography>

                                            {/* Last Updated */}
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: '#999',
                                                }}
                                            >
                                                <strong>{t('common.last_updated')}</strong> {formatDateTime2(event.createdAt)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default UpcomingEvents;
