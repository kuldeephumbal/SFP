import React, { useState } from 'react';
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
import { Add, Edit, Delete, VolunteerActivism, Image as ImageIcon, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import BaseTable from '../../components/BaseTable';

const AdminCrowdFunding = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [newItem, setNewItem] = useState({
        topic: '',
        topic_details: '',
        location: '',
        raised_amount: '',
        end_date: '', // YYYY-MM-DD
        image: null,
        imagePreview: ''
    });

    const [editItem, setEditItem] = useState({
        topic: '',
        topic_details: '',
        location: '',
        raised_amount: '',
        end_date: '',
        image: null,
        imagePreview: ''
    });

    // Mock data
    const [items, setItems] = useState([
        {
            id: 1,
            topic: 'Emergency Surgery Support',
            topic_details: 'Raising funds for a child requiring immediate cardiac surgery.',
            location: 'City Hospital, Block A',
            raised_amount: '75000',
            end_date: '2026-02-20',
            photo: '/uploads/crowd1.jpg'
        },
        {
            id: 2,
            topic: 'Education Aid',
            topic_details: 'Provide scholarships to deserving students from low-income families.',
            location: 'Foundation Office',
            raised_amount: '52000',
            end_date: '2026-03-06',
            photo: '/uploads/crowd2.jpg'
        },
        {
            id: 3,
            topic: 'Cancer Treatment',
            topic_details: 'Help fund chemotherapy cycles for an elderly patient.',
            location: 'Oncology Center',
            raised_amount: '91000',
            end_date: '2026-02-28',
            photo: '/uploads/crowd3.jpg'
        }
    ]);

    const formatDate = (date) => {
        if (!date) return '-';
        const d = new Date(date);
        if (isNaN(d)) return '-';
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) {
                    setEditItem({ ...editItem, image: file, imagePreview: reader.result });
                } else {
                    setNewItem({ ...newItem, image: file, imagePreview: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const validateItemFields = (it) => {
        if (!it.topic.trim() || !it.topic_details.trim() || !it.location.trim()) return false;
        if (!it.raised_amount || isNaN(Number(it.raised_amount))) return false;
        if (!it.end_date) return false;
        return true;
    };

    const handleAddItem = () => {
        if (!validateItemFields(newItem)) {
            toast.warning('Please fill all item details correctly.');
            return;
        }
        if (!newItem.image) {
            toast.warning('Photo is required.');
            return;
        }
        const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
        const item = {
            id: nextId,
            topic: newItem.topic.trim(),
            topic_details: newItem.topic_details.trim(),
            location: newItem.location.trim(),
            raised_amount: newItem.raised_amount,
            end_date: newItem.end_date,
            photo: newItem.imagePreview // base64 for mock
        };
        setItems([item, ...items]);
        toast.success('Crowdfunding added successfully!');
        setAddDialogOpen(false);
        setNewItem({ topic: '', topic_details: '', location: '', raised_amount: '', end_date: '', image: null, imagePreview: '' });
    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setEditItem({
            topic: item.topic,
            topic_details: item.topic_details,
            location: item.location,
            raised_amount: item.raised_amount,
            end_date: item.end_date, // YYYY-MM-DD in mock
            image: null,
            imagePreview: ''
        });
        setEditDialogOpen(true);
    };

    const handleUpdateItem = () => {
        if (!validateItemFields(editItem)) {
            toast.warning('Please fill all item details correctly.');
            return;
        }
        setItems(
            items.map((i) =>
                i.id === selectedItem.id
                    ? {
                        ...i,
                        topic: editItem.topic.trim(),
                        topic_details: editItem.topic_details.trim(),
                        location: editItem.location.trim(),
                        raised_amount: editItem.raised_amount,
                        end_date: editItem.end_date,
                        photo: editItem.imagePreview || i.photo
                    }
                    : i
            )
        );
        toast.success('Crowdfunding updated successfully!');
        setEditDialogOpen(false);
        setSelectedItem(null);
        setEditItem({ topic: '', topic_details: '', location: '', raised_amount: '', end_date: '', image: null, imagePreview: '' });
    };

    const handleDeleteItem = (id) => {
        if (window.confirm('Are you sure you want to delete this crowdfunding?')) {
            setItems(items.filter((i) => i.id !== id));
            toast.success('Crowdfunding deleted successfully!');
        }
    };

    const filteredItems = items.filter(
        (i) =>
            i.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <CustomBreadcrumb />

            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Crowdfunding
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage active fundraising campaigns
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
                            placeholder="Search by topic or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                minWidth: 280,
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
                            icon={<VolunteerActivism />}
                            label={`Total: ${filteredItems.length}`}
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
                            Add Crowdfunding
                        </Button>
                    </Box>

                    {/* Items Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'photo',
                                headerName: 'Photo',
                                minWidth: '220px',
                                renderCell: (row) => (
                                    <img
                                        src={row.photo.startsWith('/uploads') ? `http://localhost:5000${row.photo}` : row.photo}
                                        alt={row.topic}
                                        style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 8 }}
                                    />
                                )
                            },
                            {
                                field: 'topic',
                                headerName: 'Topic',
                                minWidth: '240px',
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
                                field: 'raised_amount',
                                headerName: 'Raised',
                                minWidth: '140px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', fontWeight: 600 }}>
                                        ₹{Number(row.raised_amount).toLocaleString('en-IN')}
                                    </Typography>
                                )
                            },
                            {
                                field: 'end_date',
                                headerName: 'End Date',
                                minWidth: '160px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {formatDate(row.end_date)}
                                    </Typography>
                                )
                            }
                        ]}
                        data={filteredItems}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => handleEditClick(row)}
                                    title="Edit Crowdfunding"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#f87171' }}
                                    onClick={() => handleDeleteItem(row.id)}
                                    title="Delete Crowdfunding"
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Add Item Dialog */}
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
                        Add Crowdfunding
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <TextField
                            label="Topic"
                            value={newItem.topic}
                            onChange={(e) => setNewItem({ ...newItem, topic: e.target.value })}
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
                            label="Details"
                            multiline
                            minRows={3}
                            value={newItem.topic_details}
                            onChange={(e) => setNewItem({ ...newItem, topic_details: e.target.value })}
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
                            value={newItem.location}
                            onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
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
                                label="Raised Amount (₹)"
                                type="number"
                                value={newItem.raised_amount}
                                onChange={(e) => setNewItem({ ...newItem, raised_amount: e.target.value })}
                                sx={{ flex: 1, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#60a5fa' } } }}
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                value={newItem.end_date}
                                onChange={(e) => setNewItem({ ...newItem, end_date: e.target.value })}
                                sx={{ flex: 1, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#60a5fa' } } }}
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
                            {newItem.image ? newItem.image.name : 'Select Photo'}
                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, false)} />
                        </Button>
                        {newItem.imagePreview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={newItem.imagePreview}
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
                        onClick={handleAddItem}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Add Item
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Item Dialog */}
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
                        Edit Crowdfunding
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <Box sx={{ display: 'grid', gap: 2 }}>
                            <TextField
                                label="Topic"
                                value={editItem.topic}
                                onChange={(e) => setEditItem({ ...editItem, topic: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#60a5fa' } } }}
                            />
                            <TextField
                                label="Details"
                                multiline
                                minRows={3}
                                value={editItem.topic_details}
                                onChange={(e) => setEditItem({ ...editItem, topic_details: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#60a5fa' } } }}
                            />
                            <TextField
                                label="Location"
                                value={editItem.location}
                                onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#60a5fa' } } }}
                            />
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    label="Raised Amount (₹)"
                                    type="number"
                                    value={editItem.raised_amount}
                                    onChange={(e) => setEditItem({ ...editItem, raised_amount: e.target.value })}
                                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#60a5fa' } } }}
                                />
                                <TextField
                                    label="End Date"
                                    type="date"
                                    value={editItem.end_date}
                                    onChange={(e) => setEditItem({ ...editItem, end_date: e.target.value })}
                                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#60a5fa' } } }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, display: 'block' }}>
                                Current Photo: {selectedItem.photo.split('/').pop()}
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
                                {editItem.image ? editItem.image.name : 'Change Photo (Optional)'}
                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, true)} />
                            </Button>
                            {editItem.imagePreview && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <img
                                        src={editItem.imagePreview}
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
                        onClick={handleUpdateItem}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Update Item
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminCrowdFunding;
