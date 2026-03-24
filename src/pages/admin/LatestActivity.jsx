import React, { useState, useEffect } from 'react';
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
    Article,
    Search,
    Image as ImageIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api, { IMAGE_BASE_URL, getImageUrl } from '../../components/BaseURL';
import BaseTable from '../../components/BaseTable';

const LatestActivity = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form states
    const [newActivity, setNewActivity] = useState({
        detail: '',
        image: null,
        imagePreview: ''
    });

    const [editActivity, setEditActivity] = useState({
        detail: '',
        image: null,
        imagePreview: ''
    });

    const [activities, setActivities] = useState([]);

    const fetchActivities = () => {
        setLoading(true);
        api
            .get('/latest-activity')
            .then((res) => {
                const list = res.data.map((a) => ({
                    id: a._id,
                    ...a,
                    created_at: a.createdAt || a.created_at,
                }));
                setActivities(list);
            })
            .catch((err) => {
                console.error('Error fetching latest activities', err);
                toast.error('Failed to load latest activities');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchActivities();
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
                    setEditActivity({
                        ...editActivity,
                        image: file,
                        imagePreview: reader.result
                    });
                } else {
                    setNewActivity({
                        ...newActivity,
                        image: file,
                        imagePreview: reader.result
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddActivity = () => {
        if (!newActivity.detail.trim()) {
            toast.warning('Please enter activity detail');
            return;
        }
        if (!newActivity.image) {
            toast.warning('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('activity_detail', newActivity.detail);
        formData.append('image', newActivity.image);

        setLoading(true);

        api
            .post('/latest-activity', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((res) => {
                const activity = {
                    id: res.data.activity._id,
                    ...res.data.activity,
                    created_at: res.data.activity.createdAt,
                };
                setActivities([activity, ...activities]);
                toast.success('Activity added successfully!');
                setAddDialogOpen(false);
                setNewActivity({ detail: '', image: null, imagePreview: '' });
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Failed to add activity';
                toast.error(message);
                console.error('Add activity error', err);
            })
            .finally(() => setLoading(false));
    };

    const handleEditClick = (activity) => {
        setSelectedActivity(activity);
        setEditActivity({
            detail: activity.activity_detail,
            image: null,
            imagePreview: ''
        });
        setEditDialogOpen(true);
    };

    const handleUpdateActivity = () => {
        if (!editActivity.detail.trim()) {
            toast.warning('Please enter activity detail');
            return;
        }

        const formData = new FormData();
        formData.append('activity_detail', editActivity.detail);
        if (editActivity.image) {
            formData.append('image', editActivity.image);
        }

        setLoading(true);

        api
            .put(`/latest-activity/${selectedActivity._id || selectedActivity.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((res) => {
                setActivities(
                    activities.map((a) =>
                        (a._id || a.id) === (selectedActivity._id || selectedActivity.id)
                            ? {
                                id: res.data.activity._id,
                                ...res.data.activity,
                                created_at: res.data.activity.createdAt,
                            }
                            : a
                    )
                );
                toast.success('Activity updated successfully!');
                setEditDialogOpen(false);
                setSelectedActivity(null);
                setEditActivity({ detail: '', image: null, imagePreview: '' });
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Failed to update activity';
                toast.error(message);
                console.error('Update activity error', err);
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteActivity = (id) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            setLoading(true);
            api
                .delete(`/latest-activity/${id}`)
                .then(() => {
                    setActivities(activities.filter((a) => (a._id || a.id) !== id));
                    toast.success('Activity deleted successfully!');
                })
                .catch((err) => {
                    const message = err.response?.data?.message || 'Failed to delete activity';
                    toast.error(message);
                    console.error('Delete activity error', err);
                })
                .finally(() => setLoading(false));
        }
    };

    const filteredActivities = activities.filter((activity) =>
        activity.activity_detail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Latest Activity
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage recent foundation activities with photos and descriptions
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
                                width: { xs: '100%', sm: 250 },
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
                            icon={<Article />}
                            label={`Total: ${filteredActivities.length}`}
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
                            Add Activity
                        </Button>
                    </Box>

                    {/* Activities Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'photo',
                                headerName: 'Photo',
                                minWidth: '120px',
                                renderCell: (row) => (
                                    <Avatar
                                        src={getImageUrl(row.photo)}
                                        alt={row.activity_detail}
                                        variant="rounded"
                                        sx={{ width: 80, height: 60, objectFit: 'cover' }}
                                    />
                                )
                            },
                            {
                                field: 'activity_detail',
                                headerName: 'Activity Details',
                                minWidth: '400px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'white', fontWeight: 'medium', fontSize: '0.875rem' }}>
                                        {row.activity_detail}
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
                        data={filteredActivities}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => handleEditClick(row)}
                                    title="Edit Activity"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#f87171' }}
                                    onClick={() => handleDeleteActivity(row._id || row.id)}
                                    title="Delete Activity"
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Add Activity Dialog */}
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
                        Add New Activity
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Activity Detail"
                            multiline
                            rows={4}
                            value={newActivity.detail}
                            onChange={(e) => setNewActivity({ ...newActivity, detail: e.target.value })}
                            placeholder="Enter activity description..."
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
                            {newActivity.image ? newActivity.image.name : 'Select Photo'}
                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, false)} />
                        </Button>

                        {newActivity.imagePreview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={newActivity.imagePreview}
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
                        onClick={handleAddActivity}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Add Activity
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Activity Dialog */}
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
                        Edit Activity
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedActivity && (
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                fullWidth
                                label="Activity Detail"
                                multiline
                                rows={4}
                                value={editActivity.detail}
                                onChange={(e) => setEditActivity({ ...editActivity, detail: e.target.value })}
                                placeholder="Enter activity description..."
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
                                Current Photo: {selectedActivity.photo.split('/').pop()}
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
                                {editActivity.image ? editActivity.image.name : 'Change Photo (Optional)'}
                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, true)} />
                            </Button>

                            {editActivity.imagePreview && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <img
                                        src={editActivity.imagePreview}
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
                        onClick={handleUpdateActivity}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Update Activity
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LatestActivity;
