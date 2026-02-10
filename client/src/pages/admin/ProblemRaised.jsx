import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Chip,
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    InputAdornment,
    TextField
} from '@mui/material';
import { Delete, ReportProblem, Search, AttachFile, VideoLibrary } from '@mui/icons-material';
import { toast } from 'react-toastify';
import BaseTable from '../../components/BaseTable';
import api from '../../components/BaseURL';

const AdminProblem = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await api.get('/problem-raised');
            setProblems(response.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
            toast.error('Failed to fetch problems');
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

    const handleViewDetails = (problem) => {
        setSelectedProblem(problem);
        setViewDialogOpen(true);
    };

    const handleDeleteProblem = async (id) => {
        if (window.confirm('Are you sure you want to delete this problem?')) {
            try {
                await api.delete(`/problem-raised/${id}`);
                toast.success('Problem deleted successfully!');
                fetchProblems();
            } catch (error) {
                console.error('Error deleting problem:', error);
                toast.error('Failed to delete problem');
            }
        }
    };

    const filteredProblems = problems.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Problems Raised
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Review and manage user-submitted problems
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
                            placeholder="Search by name, city, or message..."
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
                            icon={<ReportProblem />}
                            label={`Total: ${filteredProblems.length}`}
                            sx={{
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                fontWeight: 'bold',
                                fontSize: '0.875rem'
                            }}
                        />
                    </Box>

                    {/* Problems Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'name',
                                headerName: 'Contact',
                                minWidth: '200px',
                                renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>
                                            {row.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {row.mobile_number}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                                            {row.city}
                                        </Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'message',
                                headerName: 'Message',
                                minWidth: '280px',
                                renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontWeight: 500, fontSize: '0.875rem', mb: 0.5 }}>
                                            {row.message}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {row.description}
                                        </Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'attachments',
                                headerName: 'Attachments',
                                minWidth: '180px',
                                renderCell: (row) => (
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {row.document && (
                                            <Chip
                                                icon={<AttachFile />}
                                                label={row.document.endsWith('.pdf') ? 'PDF' : 'Image'}
                                                size="small"
                                                component="a"
                                                href={`http://localhost:5000/${row.document.replace(/^\/+/, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                clickable
                                                sx={{
                                                    backgroundColor: 'rgba(96, 165, 250, 0.2)',
                                                    color: '#60a5fa',
                                                    '&:hover': { backgroundColor: 'rgba(96, 165, 250, 0.3)' }
                                                }}
                                            />
                                        )}
                                        {row.video_url && (
                                            <Chip
                                                icon={<VideoLibrary />}
                                                label="Video"
                                                size="small"
                                                component="a"
                                                href={row.video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                clickable
                                                sx={{
                                                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                                    color: '#ef4444',
                                                    '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.3)' }
                                                }}
                                            />
                                        )}
                                    </Box>
                                )
                            },
                            {
                                field: 'createdAt',
                                headerName: 'Date Submitted',
                                minWidth: '200px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {formatDateTime(row.createdAt)}
                                    </Typography>
                                )
                            }
                        ]}
                        data={filteredProblems}
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
                                    onClick={() => handleDeleteProblem(row._id)}
                                    title="Delete Problem"
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
                        Problem Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedProblem && (
                        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    Name
                                </Typography>
                                <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedProblem.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                        Mobile Number
                                    </Typography>
                                    <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedProblem.mobile_number}</Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                        City
                                    </Typography>
                                    <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedProblem.city}</Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    Message
                                </Typography>
                                <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedProblem.message}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    Description
                                </Typography>
                                <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>{selectedProblem.description}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem', mb: 1, display: 'block' }}>
                                    Attachments
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {selectedProblem.document && (
                                        <Link
                                            href={`http://localhost:5000${selectedProblem.document}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                color: '#60a5fa',
                                                textDecoration: 'none',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            <AttachFile sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                                            {selectedProblem.document.endsWith('.pdf') ? 'View PDF Document' : 'View Image Document'}
                                        </Link>
                                    )}
                                    {selectedProblem.video_url && (
                                        <Link
                                            href={selectedProblem.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                color: '#ef4444',
                                                textDecoration: 'none',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            <VideoLibrary sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                                            Watch Video
                                        </Link>
                                    )}
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    Submitted On
                                </Typography>
                                <Typography sx={{ color: 'white', fontSize: '0.95rem' }}>
                                    {formatDateTime(selectedProblem.created_at)}
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

export default AdminProblem;
