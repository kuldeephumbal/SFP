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
import {
    Add,
    Edit,
    Delete,
    TrendingUp,
    Search
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../../components/BaseURL';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import BaseTable from '../../components/BaseTable';

const RecentActivity = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form states
    const [newActivity, setNewActivity] = useState('');
    const [editActivity, setEditActivity] = useState('');

    // State for activities from API
    const [activities, setActivities] = useState([]);

    const fetchActivities = () => {
        setLoading(true);
        api
            .get('/recent-activity')
            .then((res) => {
                const list = res.data.map((a) => ({
                    id: a._id,
                    ...a,
                    created_at: a.createdAt || a.created_at,
                }));
                setActivities(list);
            })
            .catch((err) => {
                console.error('Error fetching activities', err);
                toast.error('Failed to load activities');
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

    const handleAddActivity = () => {
        if (!newActivity.trim()) {
            toast.warning('Please enter an activity name');
            return;
        }

        setLoading(true);
        api
            .post('/recent-activity', { activity_name: newActivity })
            .then((res) => {
                const activity = {
                    id: res.data.activity._id,
                    ...res.data.activity,
                    created_at: res.data.activity.createdAt,
                };
                setActivities([activity, ...activities]);
                toast.success('Activity added successfully!');
                setAddDialogOpen(false);
                setNewActivity('');
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
        setEditActivity(activity.activity_name);
        setEditDialogOpen(true);
    };

    const handleUpdateActivity = () => {
        if (!editActivity.trim()) {
            toast.warning('Please enter an activity name');
            return;
        }

        setLoading(true);
        api
            .put(`/recent-activity/${selectedActivity._id || selectedActivity.id}`, {
                activity_name: editActivity
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
                setEditActivity('');
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
                .delete(`/recent-activity/${id}`)
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
        activity.activity_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <CustomBreadcrumb />

            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Recent Activity
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage and track recent foundation activities
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
                            placeholder="Search activities..."
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
                            icon={<TrendingUp />}
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
                                field: 'activity_name',
                                headerName: 'Activity Name',
                                minWidth: '400px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'white', fontWeight: 'medium', fontSize: '0.875rem' }}>
                                        {row.activity_name}
                                    </Typography>
                                )
                            },
                            {
                                field: 'created_at',
                                headerName: 'Created At',
                                minWidth: '200px',
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
                            label="Activity Name"
                            multiline
                            rows={3}
                            value={newActivity}
                            onChange={(e) => setNewActivity(e.target.value)}
                            placeholder="Enter activity description..."
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
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Activity Name"
                            multiline
                            rows={3}
                            value={editActivity}
                            onChange={(e) => setEditActivity(e.target.value)}
                            placeholder="Enter activity description..."
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
                    </Box>
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

export default RecentActivity;
