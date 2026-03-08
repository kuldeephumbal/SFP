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
    Grid,
    InputAdornment
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Groups,
    Search,
    Image as ImageIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../components/BaseURL';
import BaseTable from '../../components/BaseTable';

const Member = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    // Form states
    const [newMember, setNewMember] = useState({
        name: '',
        status: '',
        image: null,
        imagePreview: ''
    });

    const [editMember, setEditMember] = useState({
        name: '',
        status: '',
        image: null,
        imagePreview: ''
    });

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = () => {
        setLoading(true);
        api
            .get('/member')
            .then((res) => {
                const list = res.data.map((m) => ({
                    id: m._id,
                    ...m,
                    created_at: m.createdAt || m.created_at
                }));
                setMembers(list);
            })
            .catch((err) => {
                console.error('Error fetching members', err);
                toast.error('Failed to load members');
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
                    setEditMember({
                        ...editMember,
                        image: file,
                        imagePreview: reader.result
                    });
                } else {
                    setNewMember({
                        ...newMember,
                        image: file,
                        imagePreview: reader.result
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddMember = () => {
        if (!newMember.name.trim() || !newMember.status.trim()) {
            toast.warning('Please enter member name and status');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('name', newMember.name.trim());
        formData.append('status', newMember.status.trim());
        if (newMember.image) {
            formData.append('photo', newMember.image);
        }

        api
            .post('/member', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                const newItem = {
                    id: res.data.member._id,
                    ...res.data.member,
                    created_at: res.data.member.createdAt
                };
                setMembers([newItem, ...members]);
                toast.success('Member added successfully!');
                setAddDialogOpen(false);
                setNewMember({ name: '', status: '', image: null, imagePreview: '' });
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Failed to add member';
                toast.error(message);
                console.error('Add member error', err);
            })
            .finally(() => setLoading(false));
    };

    const handleEditClick = (member) => {
        setSelectedMember(member);
        setEditMember({
            name: member.name,
            status: member.status,
            image: null,
            imagePreview: ''
        });
        setEditDialogOpen(true);
    };

    const handleUpdateMember = () => {
        if (!editMember.name.trim() || !editMember.status.trim()) {
            toast.warning('Please enter member name and status');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('name', editMember.name.trim());
        formData.append('status', editMember.status.trim());
        if (editMember.image) {
            formData.append('photo', editMember.image);
        }

        api
            .put(`/member/${selectedMember.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                setMembers(
                    members.map((m) =>
                        m.id === selectedMember.id
                            ? {
                                id: res.data.member._id,
                                ...res.data.member,
                                created_at: res.data.member.createdAt
                            }
                            : m
                    )
                );
                toast.success('Member updated successfully!');
                setEditDialogOpen(false);
                setSelectedMember(null);
                setEditMember({ name: '', status: '', image: null, imagePreview: '' });
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Failed to update member';
                toast.error(message);
                console.error('Update member error', err);
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteMember = (id) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            setLoading(true);
            api
                .delete(`/member/${id}`)
                .then(() => {
                    setMembers(members.filter((m) => m.id !== id));
                    toast.success('Member deleted successfully!');
                })
                .catch((err) => {
                    const message = err.response?.data?.message || 'Failed to delete member';
                    toast.error(message);
                    console.error('Delete member error', err);
                })
                .finally(() => setLoading(false));
        }
    };

    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Members
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage foundation members and their details
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
                            icon={<Groups />}
                            label={`Total: ${filteredMembers.length}`}
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
                            Add Member
                        </Button>
                    </Box>

                    {/* Members Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'photo',
                                headerName: 'Photo',
                                minWidth: '120px',
                                renderCell: (row) => (
                                    <Avatar
                                        src={`${IMAGE_BASE_URL}${row.photo}`}
                                        alt={row.name}
                                        variant="rounded"
                                        sx={{ width: 80, height: 60, objectFit: 'cover' }}
                                    />
                                )
                            },
                            {
                                field: 'details',
                                headerName: 'Member Details',
                                minWidth: '350px',
                                renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontWeight: 'medium', fontSize: '0.875rem' }}>
                                            Name: {row.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Status: {row.status}
                                        </Typography>
                                    </Box>
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
                        data={filteredMembers}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => handleEditClick(row)}
                                    title="Edit Member"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#f87171' }}
                                    onClick={() => handleDeleteMember(row.id)}
                                    title="Delete Member"
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Add Member Dialog */}
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
                        Add New Member
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Member Name"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
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
                        <TextField
                            fullWidth
                            label="Status"
                            value={newMember.status}
                            onChange={(e) => setNewMember({ ...newMember, status: e.target.value })}
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
                            {newMember.image ? newMember.image.name : 'Select Photo'}
                            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, false)} />
                        </Button>

                        {newMember.imagePreview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={newMember.imagePreview}
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
                        onClick={handleAddMember}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Add Member
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Member Dialog */}
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
                        Edit Member
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedMember && (
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                fullWidth
                                label="Member Name"
                                value={editMember.name}
                                onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
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
                            <TextField
                                fullWidth
                                label="Status"
                                value={editMember.status}
                                onChange={(e) => setEditMember({ ...editMember, status: e.target.value })}
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
                                Current Photo: {selectedMember.photo.split('/').pop()}
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
                                {editMember.image ? editMember.image.name : 'Change Photo (Optional)'}
                                <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, true)} />
                            </Button>

                            {editMember.imagePreview && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <img
                                        src={editMember.imagePreview}
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
                        onClick={handleUpdateMember}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Update Member
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Member;
