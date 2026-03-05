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
    Avatar
} from '@mui/material';
import { Delete, Paid, Search, Receipt } from '@mui/icons-material';
import { toast } from 'react-toastify';
import BaseTable from '../../components/BaseTable';
import api from '../../components/BaseURL';

const AdminDonation = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [donations, setDonations] = useState([]);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await api.get('/donation');
            setDonations(response.data || []);
        } catch (error) {
            console.error('Error fetching donations:', error);
            toast.error('Failed to fetch donations');
            setDonations([]);
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

    const handleDeleteDonation = async (id) => {
        if (window.confirm('Are you sure you want to delete this donation record?')) {
            try {
                await api.delete(`/donation/${id}`);
                toast.success('Donation deleted successfully!');
                fetchDonations();
            } catch (error) {
                console.error('Error deleting donation:', error);
                toast.error('Failed to delete donation');
            }
        }
    };

    const filteredDonations = donations.filter(
        (donation) =>
            donation.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            donation.mobile_number.includes(searchQuery) ||
            (donation.email && donation.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            donation.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total amount
    const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);

    return (
        <>
            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Donations
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            View and manage all donation records
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

                        <Chip
                            icon={<Paid />}
                            label={`Total: ${filteredDonations.length}`}
                            sx={{
                                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                color: '#22c55e',
                                fontWeight: 'bold',
                                fontSize: '0.875rem'
                            }}
                        />

                        <Chip
                            label={`₹${totalAmount.toLocaleString('en-IN')}`}
                            sx={{
                                backgroundColor: 'rgba(234, 179, 8, 0.2)',
                                color: '#eab308',
                                fontWeight: 'bold',
                                fontSize: '0.875rem'
                            }}
                        />
                    </Box>

                    {/* Donations Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'photo',
                                headerName: 'Photo',
                                minWidth: '100px',
                                renderCell: (row) => (
                                    row.photo ? (
                                        <Avatar
                                            src={`http://localhost:5000/${row.photo.replace(/^\/+/, '')}`}
                                            alt={row.full_name}
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                border: '2px solid rgba(255, 255, 255, 0.2)'
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                backgroundColor: 'rgba(96, 165, 250, 0.3)',
                                                color: '#60a5fa',
                                                border: '2px solid rgba(255, 255, 255, 0.2)'
                                            }}
                                        >
                                            {row.full_name.charAt(0)}
                                        </Avatar>
                                    )
                                )
                            },
                            {
                                field: 'full_name',
                                headerName: 'Donor Details',
                                minWidth: '280px',
                                renderCell: (row) => (
                                    <Box>
                                        <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', mb: 0.5 }}>
                                            {row.full_name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                                            📧 {row.email || 'N/A'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                                            📱 {row.mobile_number}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block' }}>
                                            🆔 {row.pancard_number || 'N/A'}
                                        </Typography>
                                    </Box>
                                )
                            },
                            {
                                field: 'address',
                                headerName: 'Address',
                                minWidth: '250px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {row.address}
                                    </Typography>
                                )
                            },
                            {
                                field: 'payment_receipt',
                                headerName: 'Receipt',
                                minWidth: '120px',
                                renderCell: (row) => (
                                    <Box
                                        component="a"
                                        href={`http://localhost:5000/${row.payment_receipt.replace(/^\/+/, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ display: 'inline-block', textDecoration: 'none' }}
                                    >
                                        <img
                                            src={`http://localhost:5000/${row.payment_receipt.replace(/^\/+/, '')}`}
                                            alt="Receipt"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </Box>
                                )
                            },
                            {
                                field: 'amount',
                                headerName: 'Amount',
                                minWidth: '120px',
                                renderCell: (row) => (
                                    <Chip
                                        label={`₹${row.amount.toLocaleString('en-IN')}`}
                                        sx={{
                                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                            color: '#22c55e',
                                            fontWeight: 'bold',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                )
                            },
                            {
                                field: 'createdAt',
                                headerName: 'Donated At',
                                minWidth: '200px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                                        {formatDateTime(row.createdAt)}
                                    </Typography>
                                )
                            }
                        ]}
                        data={filteredDonations}
                        searchable={false}
                        renderActions={(row) => (
                            <IconButton
                                size="small"
                                sx={{ color: '#f87171' }}
                                onClick={() => handleDeleteDonation(row._id)}
                                title="Delete Donation"
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        )}
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default AdminDonation;
