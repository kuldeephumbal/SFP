import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    InputAdornment
} from '@mui/material';
import { Add, Edit, Delete, Event, Image as ImageIcon, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../components/BaseURL';
import BaseTable from '../../components/BaseTable';

const UpcomingEvent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [newEvent, setNewEvent] = useState({
        topic: '',
        topic_details: '',
        location: '',
        event_date: '', // YYYY-MM-DD
        event_time: '', // HH:mm
        image: null,
        imagePreview: ''
    });

    const [editEvent, setEditEvent] = useState({
        topic: '',
        topic_details: '',
        location: '',
        event_date: '',
        event_time: '',
        image: null,
        imagePreview: ''
    });

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        setLoading(true);
        api.get('/upcoming-event')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setEvents(res.data);
                }
            })
            .catch((err) => {
                console.error('Error fetching upcoming events:', err);
                toast.error('Error loading events');
            })
            .finally(() => setLoading(false));
    };

    const formatDateTime = (date, time) => {
        if (!date || !time) return '-';
        const dateParts = date.split('-');
        if (dateParts.length !== 3) return '-';
        const [year, month, day] = dateParts;
        const timeParts = time.split(':');
        if (timeParts.length < 2) return '-';
        const [hoursStr, minutes] = timeParts;

        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const hoursNum = parseInt(hoursStr, 10);
        const minutesNum = parseInt(minutes, 10);

        const datetime = new Date(yearNum, monthNum - 1, dayNum, hoursNum, minutesNum, 0);
        if (isNaN(datetime)) return '-';

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

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) {
                    setEditEvent({ ...editEvent, image: file, imagePreview: reader.result });
                } else {
                    setNewEvent({ ...newEvent, image: file, imagePreview: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const validateEventFields = (evt) => {
        if (!evt.topic.trim() || !evt.topic_details.trim() || !evt.location.trim()) return false;
        if (!evt.event_date || !evt.event_time) return false;
        return true;
    };

    const handleAddEvent = () => {
        if (!validateEventFields(newEvent)) {
            toast.warning('Please fill all event details.');
            return;
        }
        if (!newEvent.image) {
            toast.warning('Photo is required.');
            return;
        }
        const formData = new FormData();
        formData.append('topic', newEvent.topic.trim());
        formData.append('topic_details', newEvent.topic_details.trim());
        formData.append('location', newEvent.location.trim());
        formData.append('event_date', newEvent.event_date);
        formData.append('event_time', newEvent.event_time);
        formData.append('photo', newEvent.image);

        api.post('/upcoming-event', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                setEvents([res.data, ...events]);
                toast.success('Event added successfully!');
                setAddDialogOpen(false);
                setNewEvent({ topic: '', topic_details: '', location: '', event_date: '', event_time: '', image: null, imagePreview: '' });
            })
            .catch((err) => {
                console.error('Error adding event:', err);
                toast.error('Error adding event');
            });
    };

    const handleEditClick = (eventItem) => {
        setSelectedEvent(eventItem);
        setEditEvent({
            topic: eventItem.topic,
            topic_details: eventItem.topic_details,
            location: eventItem.location,
            event_date: eventItem.event_date, // already YYYY-MM-DD in mock
            event_time: eventItem.event_time,
            image: null,
            imagePreview: ''
        });
        setEditDialogOpen(true);
    };

    const handleUpdateEvent = () => {
        if (!validateEventFields(editEvent)) {
            toast.warning('Please fill all event details.');
            return;
        }
        const formData = new FormData();
        formData.append('topic', editEvent.topic.trim());
        formData.append('topic_details', editEvent.topic_details.trim());
        formData.append('location', editEvent.location.trim());
        formData.append('event_date', editEvent.event_date);
        formData.append('event_time', editEvent.event_time);
        if (editEvent.image) {
            formData.append('photo', editEvent.image);
        }

        api.put(`/upcoming-event/${selectedEvent._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                setEvents(
                    events.map((e) => (e._id === selectedEvent._id ? res.data : e))
                );
                toast.success('Event updated successfully!');
                setEditDialogOpen(false);
                setSelectedEvent(null);
                setEditEvent({ topic: '', topic_details: '', location: '', event_date: '', event_time: '', image: null, imagePreview: '' });
            })
            .catch((err) => {
                console.error('Error updating event:', err);
                toast.error('Error updating event');
            });
    };

    const handleDeleteEvent = (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            api.delete(`/upcoming-event/${id}`)
                .then(() => {
                    setEvents(events.filter((e) => e._id !== id));
                    toast.success('Event deleted successfully!');
                })
                .catch((err) => {
                    console.error('Error deleting event:', err);
                    toast.error('Error deleting event');
                });
        }
    };

    const filteredEvents = events.filter(
        (e) =>
            e.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Upcoming Events
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Plan and manage upcoming events
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Card
                sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
            >
                <CardContent sx={{ p: { xs: 1.5, sm: 3 } }}>
                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            placeholder="Search here..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                width: { xs: '100%', sm: 280 },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Box sx={{ flexGrow: 1 }} />

                        <Chip
                            icon={<Event />}
                            label={`Total: ${filteredEvents.length}`}
                            sx={{
                                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                                color: '#60a5fa',
                                fontWeight: 'bold',
                                fontSize: '0.875rem'
                            }}
                        />

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setAddDialogOpen(true)}
                            sx={{
                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                }
                            }}
                        >
                            Add Event
                        </Button>
                    </Box>

                    {/* Events Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'photo',
                                headerName: 'Photo',
                                minWidth: '220px',
                                renderCell: (row) => (
                                    <img
                                        src={`http://localhost:5000/${row.photo.replace(/^\/+/, '')}`}
                                        alt={row.topic}
                                        style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 8 }}
                                    />
                                )
                            },
                            {
                                field: 'topic',
                                headerName: 'Event',
                                minWidth: '220px',
                                renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{row.topic}</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{row.location}</Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'topic_details',
                                headerName: 'Details',
                                minWidth: '420px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {row.topic_details}
                                    </Typography>
                                )
                            },
                            {
                                field: 'datetime',
                                headerName: 'Date & Time',
                                minWidth: '200px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {formatDateTime(row.event_date, row.event_time)}
                                    </Typography>
                                )
                            }
                        ]}
                        data={filteredEvents}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => handleEditClick(row)}
                                    title="Edit Event"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#f87171' }}
                                    onClick={() => handleDeleteEvent(row._id)}
                                    title="Delete Event"
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Add Event Dialog */}
            <Dialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(30, 41, 59, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        color: 'white'
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                        Add Upcoming Event
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <TextField
                            label="Event Topic"
                            value={newEvent.topic}
                            onChange={(e) => setNewEvent({ ...newEvent, topic: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: '#60a5fa' }
                                }
                            }}
                        />
                        <TextField
                            label="Event Details"
                            multiline
                            minRows={3}
                            value={newEvent.topic_details}
                            onChange={(e) => setNewEvent({ ...newEvent, topic_details: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: '#60a5fa' }
                                }
                            }}
                        />
                        <TextField
                            label="Location"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': { color: '#60a5fa' }
                                }
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                label="Event Date"
                                type="date"
                                value={newEvent.event_date}
                                onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Event Time"
                                type="time"
                                value={newEvent.event_time}
                                onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })}
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            startIcon={<ImageIcon />}
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            {newEvent.image ? newEvent.image.name : 'Select Event Photo'}
                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, false)} />
                        </Button>
                        {newEvent.imagePreview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={newEvent.imagePreview}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: '8px' }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setAddDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddEvent}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Add Event
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Event Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(30, 41, 59, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '20px',
                        color: 'white'
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                        Edit Upcoming Event
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedEvent && (
                        <Box sx={{ display: 'grid', gap: 2 }}>
                            <TextField
                                label="Event Topic"
                                value={editEvent.topic}
                                onChange={(e) => setEditEvent({ ...editEvent, topic: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&.Mui-focused': { color: '#60a5fa' }
                                    }
                                }}
                            />
                            <TextField
                                label="Event Details"
                                multiline
                                minRows={3}
                                value={editEvent.topic_details}
                                onChange={(e) => setEditEvent({ ...editEvent, topic_details: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&.Mui-focused': { color: '#60a5fa' }
                                    }
                                }}
                            />
                            <TextField
                                label="Location"
                                value={editEvent.location}
                                onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                        '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&.Mui-focused': { color: '#60a5fa' }
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    label="Event Date"
                                    type="date"
                                    value={editEvent.event_date}
                                    onChange={(e) => setEditEvent({ ...editEvent, event_date: e.target.value })}
                                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#60a5fa' } } }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Event Time"
                                    type="time"
                                    value={editEvent.event_time}
                                    onChange={(e) => setEditEvent({ ...editEvent, event_time: e.target.value })}
                                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#60a5fa' } } }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                                Current Photo: {selectedEvent.photo ? selectedEvent.photo.split('/').pop() : '-'}
                            </Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<ImageIcon />}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                {editEvent.image ? editEvent.image.name : 'Change Photo (Optional)'}
                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, true)} />
                            </Button>
                            {editEvent.imagePreview && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <img
                                        src={editEvent.imagePreview}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: '8px' }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleUpdateEvent}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Update Event
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UpcomingEvent;
