import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Avatar,
    Chip,
    Grid
} from '@mui/material';
import {
    Search,
    Visibility,
    Check,
    Delete,
    PersonAdd,
    FilterList,
    Close
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import BaseTable from '../../components/BaseTable';
import api from '../../components/BaseURL';

const MemberApplication = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/member-application');
            setApplications(response.data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to fetch applications');
            setApplications([]);
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

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDeleteApplication = async (id) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.delete(`/member-application/${id}`);
                toast.success('Application deleted successfully');
                fetchApplications();
            } catch (error) {
                console.error('Error deleting application:', error);
                toast.error('Failed to delete application');
            }
        }
    };

    const handleAcceptApplication = async (id) => {
        try {
            const data = new FormData();
            data.append('status', 'accepted');
            await api.put(`/member-application/${id}`, data);
            toast.success('Application accepted and member added successfully.');
            fetchApplications();
        } catch (error) {
            console.error('Error accepting application:', error);
            toast.error('Failed to accept application');
        }
    };

    const handleRejectApplication = async (id) => {
        try {
            const data = new FormData();
            data.append('status', 'rejected');
            await api.put(`/member-application/${id}`, data);
            toast.success('Application rejected successfully.');
            fetchApplications();
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error('Failed to reject application');
        }
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setViewDialogOpen(true);
    };

    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.mobile_number?.includes(searchQuery);
        const matchesStatus =
            filterStatus === 'all' ||
            app.status === filterStatus ||
            (filterStatus === 'pending' && !app.status); // Default for old applications if status is null
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Member Applications
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Review and manage member application requests
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
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    width: '100%'
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

                        <FormControl sx={{ width: { xs: '100%', sm: 150 } }}>
                            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
                            <Select
                                value={filterStatus}
                                label="Status"
                                onChange={(e) => setFilterStatus(e.target.value)}
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#60a5fa'
                                    }
                                }}
                            >
                                <MenuItem value="all">All Applications</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="accepted">Accepted</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ flexGrow: 1 }} />

                        <Chip
                            icon={<PersonAdd />}
                            label={`Total: ${filteredApplications.length}`}
                            sx={{
                                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                                color: '#60a5fa',
                                fontWeight: 'bold',
                                fontSize: '0.875rem'
                            }}
                        />
                    </Box>

                    {/* Applications Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'profile',
                                headerName: 'Profile',
                                minWidth: '100px',
                                renderCell: (row) => (
                                    <Avatar
                                        src={row.profile_picture ? `${IMAGE_BASE_URL}/${row.profile_picture.replace(/^\/+/, '')}` : ''}
                                        alt={row.name}
                                        sx={{ width: 50, height: 50 }}
                                    />
                                )
                            },
                            {
                                field: 'name',
                                headerName: 'Name',
                                minWidth: '150px',
                                renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontWeight: 'medium', fontSize: '0.875rem' }}>
                                            {row.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {row.email || '-'}
                                        </Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'contact',
                                headerName: 'Contact',
                                minWidth: '120px',
                                renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                                            {row.mobile_number || '-'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {row.gender}
                                        </Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'location',
                                headerName: 'Location',
                                minWidth: '150px',
                                renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                                            {row.district}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            {row.state}
                                        </Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'profession',
                                headerName: 'Profession',
                                minWidth: '150px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {row.profession || '-'}
                                    </Typography>
                                )
                            },
                            {
                                field: 'blood_group',
                                headerName: 'Blood Group',
                                minWidth: '100px',
                                renderCell: (row) => (
                                    <Chip
                                        label={row.blood_group}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                            color: '#f87171',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                )
                            },
                            {
                                field: 'status',
                                headerName: 'Status',
                                type: 'status',
                                minWidth: '120px',
                                statusColors: {
                                    accepted: 'success',
                                    pending: 'warning'
                                },
                                renderCell: (row) => (
                                    <Chip
                                        label={row.status === 'accepted' ? 'Approved' : row.status === 'rejected' ? 'Rejected' : 'Pending'}
                                        size="small"
                                        sx={{
                                            backgroundColor:
                                                row.status === 'accepted'
                                                    ? 'rgba(34, 197, 94, 0.2)'
                                                    : row.status === 'rejected'
                                                        ? 'rgba(239, 68, 68, 0.2)'
                                                        : 'rgba(245, 158, 11, 0.2)',
                                            color: row.status === 'accepted' ? '#4ade80' : row.status === 'rejected' ? '#ef4444' : '#f59e0b',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                )
                            },
                            {
                                field: 'applied_date',
                                headerName: 'Applied Date',
                                minWidth: '150px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {formatDateTime(row.createdAt)}
                                    </Typography>
                                )
                            }
                        ]}
                        data={filteredApplications}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => handleViewDetails(row)}
                                    title="View Details"
                                >
                                    <Visibility fontSize="small" />
                                </IconButton>
                                {row.status !== 'accepted' && row.status !== 'rejected' && (
                                    <>
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#4ade80' }}
                                            onClick={() => handleAcceptApplication(row._id)}
                                            title="Approve Application"
                                        >
                                            <Check fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            sx={{ color: '#f87171' }}
                                            onClick={() => handleRejectApplication(row._id)}
                                            title="Disagree Application"
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </>
                                )}
                                {(row.status === 'accepted' || row.status === 'rejected') && (
                                    <IconButton
                                        size="small"
                                        sx={{ color: '#f87171' }}
                                        onClick={() => handleDeleteApplication(row._id)}
                                        title="Delete Application"
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                )}
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
                        Application Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedApplication && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={3}>
                                {/* Profile Picture */}
                                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                                    <Avatar
                                        src={selectedApplication.profile_picture ? `${IMAGE_BASE_URL}/${selectedApplication.profile_picture.replace(/^\/+/, '')}` : ''}
                                        alt={selectedApplication.name}
                                        sx={{ width: 150, height: 150, margin: '0 auto', mb: 2 }}
                                    />
                                    <Chip
                                        label={selectedApplication.status === 'accepted' ? 'Approved' : selectedApplication.status === 'rejected' ? 'Rejected' : 'Pending'}
                                        sx={{
                                            backgroundColor:
                                                selectedApplication.status === 'accepted'
                                                    ? 'rgba(34, 197, 94, 0.2)'
                                                    : selectedApplication.status === 'rejected'
                                                        ? 'rgba(239, 68, 68, 0.2)'
                                                        : 'rgba(245, 158, 11, 0.2)',
                                            color: selectedApplication.status === 'accepted' ? '#4ade80' : selectedApplication.status === 'rejected' ? '#ef4444' : '#f59e0b',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Grid>

                                {/* Personal Information */}
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h6" sx={{ color: '#60a5fa', mb: 2 }}>
                                        Personal Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Full Name
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>{selectedApplication.name}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Email
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {selectedApplication.email || '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Mobile Number
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {selectedApplication.mobile_number || '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Gender
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>{selectedApplication.gender}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Date of Birth
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {formatDate(selectedApplication.date_of_birth)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Blood Group
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {selectedApplication.blood_group}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Profession
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {selectedApplication.profession || '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Aadhar Number
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {selectedApplication.aadhar_number || '-'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Address & Organization */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ color: '#60a5fa', mb: 2 }}>
                                        Address & Organization
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Address
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>{selectedApplication.address}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                District
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>{selectedApplication.district}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                State
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>{selectedApplication.state}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Pin Code
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>{selectedApplication.pin_code}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Organization Name
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {selectedApplication.organization_name || '-'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Family Details */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ color: '#60a5fa', mb: 2 }}>
                                        Family Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Relation Type
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {selectedApplication.relation_type}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Relation Name
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {selectedApplication.relation_name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Documents */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ color: '#60a5fa', mb: 2 }}>
                                        Documents
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                ID Type
                                            </Typography>
                                            <Typography sx={{ color: 'white' }}>
                                                {selectedApplication.id_type || '-'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                ID Document
                                            </Typography>
                                            <Typography>
                                                {selectedApplication.id_document ? (
                                                    <a
                                                        href={`${IMAGE_BASE_URL}/${selectedApplication.id_document.replace(/^\/+/, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ color: '#60a5fa', textDecoration: 'none' }}
                                                    >
                                                        View Document
                                                    </a>
                                                ) : (
                                                    <span style={{ color: 'white' }}>-</span>
                                                )}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                                Other Document
                                            </Typography>
                                            <Typography>
                                                {selectedApplication.other_document ? (
                                                    <a
                                                        href={`${IMAGE_BASE_URL}/${selectedApplication.other_document.replace(/^\/+/, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{ color: '#60a5fa', textDecoration: 'none' }}
                                                    >
                                                        View Document
                                                    </a>
                                                ) : (
                                                    <span style={{ color: 'white' }}>-</span>
                                                )}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Applied Date */}
                                <Grid item xs={12}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Applied At
                                    </Typography>
                                    <Typography sx={{ color: 'white' }}>
                                        {formatDateTime(selectedApplication.createdAt)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    {selectedApplication && selectedApplication.status !== 'accepted' && selectedApplication.status !== 'rejected' && (
                        <>
                            <Button
                                variant="contained"
                                startIcon={<Check />}
                                onClick={() => {
                                    handleAcceptApplication(selectedApplication._id);
                                    setViewDialogOpen(false);
                                }}
                                sx={{
                                    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                                    }
                                }}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Close />}
                                onClick={() => {
                                    handleRejectApplication(selectedApplication._id);
                                    setViewDialogOpen(false);
                                }}
                                sx={{
                                    background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                    }
                                }}
                            >
                                Disagree
                            </Button>
                        </>
                    )}
                    {(selectedApplication?.status === 'accepted' || selectedApplication?.status === 'rejected') && (
                        <Button
                            variant="contained"
                            startIcon={<Delete />}
                            onClick={() => {
                                handleDeleteApplication(selectedApplication._id);
                                setViewDialogOpen(false);
                            }}
                            sx={{
                                background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                }
                            }}
                        >
                            Delete Application
                        </Button>
                    )}
                    <Button onClick={() => setViewDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MemberApplication;
