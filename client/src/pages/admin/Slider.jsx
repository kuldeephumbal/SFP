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
    Avatar,
    Chip,
    InputAdornment
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Slideshow,
    Search,
    Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../../components/BaseURL';
import BaseTable from '../../components/BaseTable';

const Slider = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedSlider, setSelectedSlider] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form states
    const [newSlider, setNewSlider] = useState({
        topic: '',
        image: null,
        imagePreview: ''
    });

    const [editSlider, setEditSlider] = useState({
        topic: '',
        image: null,
        imagePreview: ''
    });

    const [sliders, setSliders] = useState([]);

    const fetchSliders = () => {
        setLoading(true);
        api
            .get('/slider')
            .then((res) => {
                const list = res.data.map((s) => ({
                    id: s._id,
                    ...s,
                    created_at: s.createdAt || s.created_at,
                }));
                setSliders(list);
            })
            .catch((err) => {
                console.error('Error fetching sliders', err);
                toast.error('Failed to load sliders');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSliders();
    }, []);

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

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) {
                    setEditSlider({
                        ...editSlider,
                        image: file,
                        imagePreview: reader.result
                    });
                } else {
                    setNewSlider({
                        ...newSlider,
                        image: file,
                        imagePreview: reader.result
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSlider = () => {
        if (!newSlider.topic.trim()) {
            toast.warning('Please enter a topic');
            return;
        }
        if (!newSlider.image) {
            toast.warning('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('topic', newSlider.topic);
        formData.append('image', newSlider.image);

        setLoading(true);

        api
            .post('/slider', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((res) => {
                const slider = {
                    id: res.data.slider._id,
                    ...res.data.slider,
                    created_at: res.data.slider.createdAt,
                };
                setSliders([slider, ...sliders]);
                toast.success('Slider added successfully!');
                setAddDialogOpen(false);
                setNewSlider({ topic: '', image: null, imagePreview: '' });
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Failed to add slider';
                toast.error(message);
                console.error('Add slider error', err);
            })
            .finally(() => setLoading(false));
    };

    const handleEditClick = (slider) => {
        setSelectedSlider(slider);
        setEditSlider({
            topic: slider.topic,
            image: null,
            imagePreview: ''
        });
        setEditDialogOpen(true);
    };

    const handleUpdateSlider = () => {
        if (!editSlider.topic.trim()) {
            toast.warning('Please enter a topic');
            return;
        }

        setSliders(
            sliders.map((s) =>
                (s._id || s.id) === (selectedSlider._id || selectedSlider.id)
                    ? {
                        ...s,
                        topic: editSlider.topic,
                        photo: editSlider.imagePreview || s.photo
                    }
                    : s
            )
        );

        toast.success('Slider updated successfully!');
        setEditDialogOpen(false);
        setSelectedSlider(null);
        setEditSlider({ topic: '', image: null, imagePreview: '' });
    };

    const handleDeleteSlider = (id) => {
        if (window.confirm('Are you sure you want to delete this slider?')) {
            setLoading(true);
            api
                .delete(`/slider/${id}`)
                .then(() => {
                    setSliders(sliders.filter((s) => s._id ? s._id !== id : s.id !== id));
                    toast.success('Slider deleted successfully!');
                })
                .catch((err) => {
                    const message = err.response?.data?.message || 'Failed to delete slider';
                    toast.error(message);
                    console.error('Delete slider error', err);
                })
                .finally(() => setLoading(false));
        }
    };

    const filteredSliders = sliders.filter((slider) =>
        slider.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Slider Management
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage homepage slider images and topics
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
                <CardContent>
                    {/* Action Bar */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search sliders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                minWidth: 250,
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
                            icon={<Slideshow />}
                            label={`Total: ${filteredSliders.length}`}
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
                            Add Slider
                        </Button>
                    </Box>

                    {/* Sliders Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'image',
                                headerName: 'Image',
                                minWidth: '120px',
                                renderCell: (row) => (
                                    <Avatar
                                        src={row.photo.startsWith('http') ? row.photo : `http://localhost:5000${row.photo}`}
                                        alt={row.topic}
                                        variant="rounded"
                                        sx={{ width: 80, height: 60, objectFit: 'cover' }}
                                    />
                                )
                            },
                            {
                                field: 'topic',
                                headerName: 'Topic',
                                minWidth: '300px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'white', fontWeight: 'medium', fontSize: '0.875rem' }}>
                                        {row.topic}
                                    </Typography>
                                )
                            },
                            {
                                field: 'created_at',
                                headerName: 'Created At',
                                minWidth: '180px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {formatDateTime(row.created_at)}
                                    </Typography>
                                )
                            }
                        ]}
                        data={filteredSliders}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => handleEditClick(row)}
                                    title="Edit Slider"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#f87171' }}
                                    onClick={() => handleDeleteSlider(row._id || row.id)}
                                    title="Delete Slider"
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Add Slider Dialog */}
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
                        Add New Slider
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Topic"
                            value={newSlider.topic}
                            onChange={(e) => setNewSlider({ ...newSlider, topic: e.target.value })}
                            sx={{
                                mb: 2,
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
                            {newSlider.image ? newSlider.image.name : 'Select Image'}
                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, false)} />
                        </Button>

                        {newSlider.imagePreview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={newSlider.imagePreview}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
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
                        onClick={handleAddSlider}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Add Slider
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Slider Dialog */}
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
                        Edit Slider
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedSlider && (
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                fullWidth
                                label="Topic"
                                value={editSlider.topic}
                                onChange={(e) => setEditSlider({ ...editSlider, topic: e.target.value })}
                                sx={{
                                    mb: 2,
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

                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                                Current Image: {selectedSlider.photo?.split('/').pop()}
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
                                {editSlider.image ? editSlider.image.name : 'Change Image (Optional)'}
                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, true)} />
                            </Button>

                            {editSlider.imagePreview && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <img
                                        src={editSlider.imagePreview}
                                        alt="Preview"
                                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
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
                        onClick={handleUpdateSlider}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Update Slider
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Slider;
