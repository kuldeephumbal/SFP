import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Chip,
    InputAdornment,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { Delete, MailOutline, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import BaseTable from '../../components/BaseTable';
import api from '../../components/BaseURL';

const AdminEnquiry = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await api.get('/enquiry');
            setEnquiries(response.data || []);
        } catch (error) {
            console.error('Error fetching enquiries:', error);
            toast.error('Failed to fetch enquiries');
            setEnquiries([]);
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

    const handleViewDetails = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setViewDialogOpen(true);
    };

    const handleDeleteEnquiry = async (id) => {
        if (window.confirm('Are you sure you want to delete this enquiry?')) {
            try {
                await api.delete(`/enquiry/${id}`);
                toast.success('Enquiry deleted successfully!');
                fetchEnquiries();
            } catch (error) {
                console.error('Error deleting enquiry:', error);
                toast.error('Failed to delete enquiry');
            }
        }
    };

    const filteredEnquiries = enquiries.filter(
        (enq) =>
            enq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enq.mobile_number.includes(searchQuery) ||
            enq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enq.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enq.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Enquiries
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            View and manage contact form submissions
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
                            placeholder="Search by name, mobile, email, topic, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                minWidth: 300,
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
                            icon={<MailOutline />}
                            label={`Total: ${filteredEnquiries.length}`}
                            sx={{
                                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                                color: '#60a5fa',
                                fontWeight: 'bold',
                                fontSize: '0.875rem'
                            }}
                        />
                    </Box>

                    {/* Enquiries Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'name',
                                headerName: 'Contact Details',
                                minWidth: '250px',
                                renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', mb: 0.5 }}>
                                            {row.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                                            📱 {row.mobile_number}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                                            📧 {row.email}
                                        </Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'topic',
                                headerName: 'Topic',
                                minWidth: '180px',
                                renderCell: (row) => (
                                    <Chip
                                        label={row.topic}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                            color: '#a78bfa',
                                            fontWeight: 500
                                        }}
                                    />
                                )
                            },
                            {
                                field: 'description',
                                headerName: 'Description',
                                minWidth: '350px',
                                renderCell: (row) => (
                                    <Typography
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            fontSize: '0.875rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {row.description}
                                    </Typography>
                                )
                            },
                            {
                                field: 'createdAt',
                                headerName: 'Enquiry At',
                                minWidth: '200px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {formatDateTime(row.createdAt)}
                                    </Typography>
                                )
                            }
                        ]}
                        data={filteredEnquiries}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleViewDetails(row)}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                        fontSize: '0.75rem',
                                        mr: 1,
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                                        }
                                    }}
                                >
                                    View
                                </Button>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#f87171' }}
                                    onClick={() => handleDeleteEnquiry(row._id)}
                                    title="Delete Enquiry"
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    />
                </CardContent>
            </Card>

            {/* View Details Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
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
                        Enquiry Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedEnquiry && (
                        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    Name
                                </Typography>
                                <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedEnquiry.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                        Mobile Number
                                    </Typography>
                                    <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedEnquiry.mobile_number}</Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                        Email
                                    </Typography>
                                    <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedEnquiry.email}</Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    Topic
                                </Typography>
                                <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedEnquiry.topic}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    Description
                                </Typography>
                                <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedEnquiry.description}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    Enquiry Submitted On
                                </Typography>
                                <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>
                                    {formatDateTime(selectedEnquiry.created_at)}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setViewDialogOpen(false)}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminEnquiry;
