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
    Chip
} from '@mui/material';
import { Add, Edit, Delete, PhotoLibrary, Image as ImageIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../components/BaseURL';
import BaseTable from '../../components/BaseTable';

const Gallery = () => {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [newItem, setNewItem] = useState({
        image: null,
        imagePreview: ''
    });

    const [editItem, setEditItem] = useState({
        image: null,
        imagePreview: ''
    });

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    const fetchGalleryItems = () => {
        setLoading(true);
        api.get('/gallery')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setGalleryItems(res.data);
                }
            })
            .catch((err) => {
                console.error('Error fetching gallery items:', err);
                toast.error('Error loading gallery items');
            })
            .finally(() => setLoading(false));
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

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) {
                    setEditItem({ image: file, imagePreview: reader.result });
                } else {
                    setNewItem({ image: file, imagePreview: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = () => {
        if (!newItem.image) {
            toast.warning('Photo is required.');
            return;
        }
        const formData = new FormData();
        formData.append('photo', newItem.image);

        api.post('/gallery', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                setGalleryItems([res.data, ...galleryItems]);
                toast.success('Gallery item added successfully!');
                setAddDialogOpen(false);
                setNewItem({ image: null, imagePreview: '' });
            })
            .catch((err) => {
                console.error('Error adding gallery item:', err);
                toast.error('Error adding gallery item');
            });
    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setEditItem({ image: null, imagePreview: '' });
        setEditDialogOpen(true);
    };

    const handleUpdateItem = () => {
        if (!editItem.image) {
            toast.warning('Photo is required.');
            return;
        }
        const formData = new FormData();
        formData.append('photo', editItem.image);

        api.put(`/gallery/${selectedItem._id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                setGalleryItems(
                    galleryItems.map((i) => (i._id === selectedItem._id ? res.data : i))
                );
                toast.success('Gallery item updated successfully!');
                setEditDialogOpen(false);
                setSelectedItem(null);
                setEditItem({ image: null, imagePreview: '' });
            })
            .catch((err) => {
                console.error('Error updating gallery item:', err);
                toast.error('Error updating gallery item');
            });
    };

    const handleDeleteItem = (id) => {
        if (window.confirm('Are you sure you want to delete this gallery item?')) {
            api.delete(`/gallery/${id}`)
                .then(() => {
                    setGalleryItems(galleryItems.filter((i) => i._id !== id));
                    toast.success('Gallery item deleted successfully!');
                })
                .catch((err) => {
                    console.error('Error deleting gallery item:', err);
                    toast.error('Error deleting gallery item');
                });
        }
    };

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Gallery
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage gallery images displayed on the site
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
                        <Chip
                            icon={<PhotoLibrary />}
                            label={`Total: ${galleryItems.length}`}
                            sx={{
                                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                                color: '#60a5fa',
                                fontWeight: 'bold',
                                fontSize: '0.875rem'
                            }}
                        />

                        <Box sx={{ flexGrow: 1 }} />

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
                            Add Gallery Item
                        </Button>
                    </Box>

                    {/* Gallery Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'photo',
                                headerName: 'Photo',
                                minWidth: '280px',
                                renderCell: (row) => (
                                    <Box sx={{
                                        width: '100%',
                                        maxWidth: { xs: '100%', sm: 240 },
                                        aspectRatio: '3/2',
                                        borderRadius: 2,
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={`http://localhost:5000/${row.photo.replace(/^\/+/, '')}`}
                                            alt="gallery item"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                )
                            },
                            {
                                field: 'createdAt',
                                headerName: 'Created At',
                                minWidth: '200px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {formatDateTime(row.createdAt)}
                                    </Typography>
                                )
                            }
                        ]}
                        data={galleryItems}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => handleEditClick(row)}
                                    title="Edit Item"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#f87171' }}
                                    onClick={() => handleDeleteItem(row._id)}
                                    title="Delete Item"
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
                        Add Gallery Item
                    </Typography>
                </DialogTitle>
                <DialogContent>
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
                        Edit Gallery Item
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <>
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
                                {editItem.image ? editItem.image.name : 'Change Photo'}
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
                        </>
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

export default Gallery;
