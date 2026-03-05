import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputAdornment,
    Chip
} from '@mui/material';
import { Add, Edit, Delete, Search, EmojiEvents } from '@mui/icons-material';
import { toast } from 'react-toastify';
import BaseTable from '../../components/BaseTable';
import api from '../../components/BaseURL';

const AdminAchievements = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    const [formData, setFormData] = useState({
        year: '',
        title: '',
        description: '',
        highlight: '',
        impact: ''
    });

    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await api.get('/achievement');
            setAchievements(response.data || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
            toast.error('Failed to fetch achievements');
            setAchievements([]);
        }
    };

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

    const handleAddClick = () => {
        setFormData({
            year: '',
            title: '',
            description: '',
            highlight: '',
            impact: ''
        });
        setAddDialogOpen(true);
    };

    const handleEditClick = (achievement) => {
        setSelectedAchievement(achievement);
        setFormData({
            year: achievement.year,
            title: achievement.title,
            description: achievement.description,
            highlight: achievement.highlight,
            impact: achievement.impact
        });
        setEditDialogOpen(true);
    };

    const handleAddAchievement = async () => {
        if (!formData.year || !formData.title || !formData.description || !formData.highlight || !formData.impact) {
            toast.warning('Please fill all fields');
            return;
        }

        try {
            await api.post('/achievement', formData);
            toast.success('Achievement added successfully!');
            setAddDialogOpen(false);
            fetchAchievements();
        } catch (error) {
            console.error('Error adding achievement:', error);
            toast.error('Failed to add achievement');
        }
    };

    const handleUpdateAchievement = async () => {
        if (!formData.year || !formData.title || !formData.description || !formData.highlight || !formData.impact) {
            toast.warning('Please fill all fields');
            return;
        }

        try {
            await api.put(`/achievement/${selectedAchievement._id}`, formData);
            toast.success('Achievement updated successfully!');
            setEditDialogOpen(false);
            fetchAchievements();
        } catch (error) {
            console.error('Error updating achievement:', error);
            toast.error('Failed to update achievement');
        }
    };

    const handleDeleteAchievement = async (id) => {
        if (window.confirm('Are you sure you want to delete this achievement?')) {
            try {
                await api.delete(`/achievement/${id}`);
                toast.success('Achievement deleted successfully!');
                fetchAchievements();
            } catch (error) {
                console.error('Error deleting achievement:', error);
                toast.error('Failed to delete achievement');
            }
        }
    };

    const filteredAchievements = achievements.filter(
        (achievement) =>
            achievement.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
            achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            field: 'year',
            headerName: 'Year',
            minWidth: '100px',
            renderCell: (row) => (
                <Chip
                    label={row.year}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        fontWeight: 'bold'
                    }}
                />
            )
        },
        {
            field: 'title',
            headerName: 'Achievement',
            minWidth: '250px',
            renderCell: (row) => (
                <Box>
                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', mb: 0.5 }}>
                        {row.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {row.description}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'highlight',
            headerName: 'Highlight',
            minWidth: '180px',
            renderCell: (row) => (
                <Chip
                    icon={<EmojiEvents />}
                    label={row.highlight}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(234, 179, 8, 0.2)',
                        color: '#eab308',
                        fontWeight: 'bold'
                    }}
                />
            )
        },
        {
            field: 'impact',
            headerName: 'Impact',
            minWidth: '200px',
            renderCell: (row) => (
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                    {row.impact}
                </Typography>
            )
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            minWidth: '180px',
            renderCell: (row) => (
                <Chip
                    label={formatDateTime(row.createdAt)}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        color: '#a78bfa',
                        fontSize: '0.75rem'
                    }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: '100px',
            renderCell: (row) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => handleEditClick(row)}
                        sx={{
                            color: '#60a5fa',
                            '&:hover': { backgroundColor: 'rgba(96, 165, 250, 0.1)' }
                        }}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDeleteAchievement(row._id)}
                        sx={{
                            color: '#ef4444',
                            '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                        }}
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Achievements
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage organization achievements and milestones
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
                                width: { xs: '100%', sm: 300 },
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

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAddClick}
                            sx={{
                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                }
                            }}
                        >
                            Add Achievement
                        </Button>

                        <Chip
                            icon={<EmojiEvents />}
                            label={`Total: ${filteredAchievements.length}`}
                            sx={{
                                backgroundColor: 'rgba(234, 179, 8, 0.2)',
                                color: '#eab308',
                                fontWeight: 'bold',
                                fontSize: '0.875rem'
                            }}
                        />
                    </Box>

                    {/* Achievements Table */}
                    <BaseTable data={filteredAchievements} columns={columns} searchable={false} />
                </CardContent>
            </Card>

            {/* Add Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Achievement</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        fullWidth
                        label="Highlight"
                        value={formData.highlight}
                        onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Impact"
                        value={formData.impact}
                        onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleAddAchievement}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Achievement</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Year"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        fullWidth
                        label="Highlight"
                        value={formData.highlight}
                        onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Impact"
                        value={formData.impact}
                        onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleUpdateAchievement}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminAchievements;
