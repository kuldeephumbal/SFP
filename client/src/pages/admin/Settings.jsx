import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    CircularProgress,
    Grid,
    MenuItem,
    Tabs,
    Tab,
    IconButton,
    Card,
    CardContent
} from '@mui/material';
import { toast } from 'react-toastify';
import {
    Save,
    Notifications,
    Security,
    Palette,
    Person,
    ManageAccounts,
    LockReset,
    Close
} from '@mui/icons-material';
import api from '../../components/BaseURL';

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    // Profile settings state
    const [profileSettings, setProfileSettings] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        createdAt: ''
    });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification/preference settings
    const [preferenceSettings, setPreferenceSettings] = useState({
        backgroundImage: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Load user profile data on component mount
    useEffect(() => {
        console.log('Settings component mounted');
        fetchProfileData();
    }, []);

    // Debug log whenever profile settings change
    useEffect(() => {
        console.log('Current profile settings:', profileSettings);
    }, [profileSettings]);

    const fetchProfileData = async () => {
        setLoadingProfile(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await api.get('/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProfileSettings({
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                email: response.data.email || '',
                role: response.data.role || '',
                createdAt: response.data.createdAt || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch profile');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleProfileChange = (field) => (event) => {
        setProfileSettings({
            ...profileSettings,
            [field]: event.target.value
        });
    };

    const handlePasswordChange = (field) => (event) => {
        setPasswordData({
            ...passwordData,
            [field]: event.target.value
        });
    };

    const handlePreferenceChange = (event) => {
        setPreferenceSettings({
            ...preferenceSettings,
            backgroundImage: event.target.value
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await api.put(
                '/auth/profile',
                {
                    firstName: profileSettings.firstName,
                    lastName: profileSettings.lastName,
                    email: profileSettings.email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update sessionStorage with new email if changed
            const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
            if (response.data.user.email !== storedUser.email) {
                storedUser.email = response.data.user.email;
                sessionStorage.setItem('user', JSON.stringify(storedUser));
            }

            toast.success(response.data.message || 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await api.put(
                '/auth/change-password',
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            toast.success(response.data.message || 'Password changed successfully');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleSavePreferences = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');

            let imageUrl = preferenceSettings.backgroundImage;

            // If a file is selected, upload it first
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);

                const uploadResponse = await api.post('/upload/background', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                imageUrl = uploadResponse.data.imageUrl;
            }

            // Save the background image preference
            await api.put('/auth/preferences', {
                backgroundImage: imageUrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Save to localStorage and reload page
            localStorage.setItem('backgroundImage', imageUrl);

            // Force update by reloading the page
            setTimeout(() => {
                window.location.reload();
            }, 1500);

            toast.success('Background image updated successfully. Page will reload...');

            setSelectedFile(null);
            setPreviewUrl('');
        } catch (error) {
            console.error('Error saving preferences:', error);
            toast.error(error.response?.data?.message || 'Failed to save preferences');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>

            <Paper
                sx={{
                    mb: 3,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden'
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&.Mui-selected': {
                                color: '#60a5fa'
                            }
                        }
                    }}
                >
                    <Tab icon={<Person />} label="Profile" />
                    <Tab icon={<LockReset />} label="Password" />
                    <Tab icon={<Notifications />} label="Preferences" />
                </Tabs>
            </Paper>

            {loadingProfile ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <div className="container-fluid">
                    {/* PROFILE TAB */}
                    {activeTab === 0 && (
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Person sx={{ mr: 2, color: '#60a5fa' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                Profile Settings
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    value={profileSettings.firstName}
                                                    onChange={handleProfileChange('firstName')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    InputProps={{
                                                        readOnly: loadingProfile
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    value={profileSettings.lastName}
                                                    onChange={handleProfileChange('lastName')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    InputProps={{
                                                        readOnly: loadingProfile
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    type="email"
                                                    value={profileSettings.email}
                                                    onChange={handleProfileChange('email')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    InputProps={{
                                                        readOnly: loadingProfile
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Role"
                                                    value={profileSettings.role === 'admin' ? 'Administrator' : 'Staff'}
                                                    variant="outlined"
                                                    margin="normal"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    helperText="Your role cannot be changed"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'rgba(255, 255, 255, 0.6)',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)'
                                                        },
                                                        '& .MuiFormHelperText-root': {
                                                            color: 'rgba(255, 255, 255, 0.5)'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                            onClick={handleSaveProfile}
                                            disabled={loading}
                                            sx={{
                                                mt: 3,
                                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                }
                                            }}
                                        >
                                            {loading ? 'Saving...' : 'Save Profile'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="col-12 col-md-4">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <ManageAccounts sx={{ mr: 2, color: '#60a5fa' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                Account Info
                                            </Typography>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                                Account Type
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                {profileSettings.role === 'admin' ? 'Administrator' : 'Staff'}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                                Permissions
                                            </Typography>
                                            {profileSettings.role === 'admin' ? (
                                                <Typography variant="body2" sx={{ color: 'white' }}>• All permissions granted</Typography>
                                            ) : (
                                                <Typography variant="body2" sx={{ color: 'white' }}>• Standard staff permissions</Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* PASSWORD TAB */}
                    {activeTab === 1 && (
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Security sx={{ mr: 2, color: '#60a5fa' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                Change Password
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Current Password"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange('currentPassword')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="New Password"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange('newPassword')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    helperText="Minimum 6 characters"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiFormHelperText-root': {
                                                            color: 'rgba(255, 255, 255, 0.5)'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    type="password"
                                                    label="Confirm New Password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange('confirmPassword')}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                                                    helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? "Passwords don't match" : ""}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiFormHelperText-root': {
                                                            color: 'rgba(255, 255, 255, 0.5)'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                            onClick={handleChangePassword}
                                            disabled={loading}
                                            sx={{
                                                mt: 3,
                                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                }
                                            }}
                                            color="primary"
                                        >
                                            {loading ? 'Changing...' : 'Change Password'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="col-12 col-md-4">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                                            Password Security Tips
                                        </Typography>
                                        <Alert
                                            severity="info"
                                            sx={{
                                                mb: 2,
                                                background: 'rgba(33, 150, 243, 0.1)',
                                                color: 'white',
                                                border: '1px solid rgba(33, 150, 243, 0.3)',
                                                '& .MuiAlert-icon': {
                                                    color: '#60a5fa'
                                                }
                                            }}
                                        >
                                            Change your password regularly for security.
                                        </Alert>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                            Strong passwords include:
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• At least 8 characters</Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• Upper and lowercase letters</Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• Numbers and special characters</Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• No personal information</Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* PREFERENCES TAB */}
                    {activeTab === 2 && (
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Palette sx={{ mr: 2, color: '#60a5fa' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                Background Image Settings
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Background Image URL"
                                                    value={preferenceSettings.backgroundImage}
                                                    onChange={handlePreferenceChange}
                                                    variant="outlined"
                                                    margin="normal"
                                                    placeholder="Enter image URL or upload below"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            color: 'white',
                                                            '& fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.3)'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'rgba(255, 255, 255, 0.5)'
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#60a5fa'
                                                            }
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-focused': {
                                                                color: '#60a5fa'
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                                    Or Upload Image
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    sx={{
                                                        color: 'white',
                                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                                        '&:hover': {
                                                            borderColor: '#60a5fa',
                                                            backgroundColor: 'rgba(96, 165, 250, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </Button>
                                                {selectedFile && (
                                                    <Typography variant="body2" sx={{ color: '#60a5fa', mt: 1 }}>
                                                        Selected: {selectedFile.name}
                                                    </Typography>
                                                )}
                                            </Grid>
                                            {previewUrl && (
                                                <Grid item xs={12}>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                                        Preview
                                                    </Typography>
                                                    <Box
                                                        component="img"
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        sx={{
                                                            width: '100%',
                                                            maxHeight: 200,
                                                            objectFit: 'cover',
                                                            borderRadius: 2,
                                                            border: '1px solid rgba(255, 255, 255, 0.2)'
                                                        }}
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                            onClick={handleSavePreferences}
                                            disabled={loading}
                                            sx={{
                                                mt: 3,
                                                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                }
                                            }}
                                        >
                                            {loading ? 'Saving...' : 'Save Background Image'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="col-12 col-md-4">
                                <Card sx={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                                            Image Requirements
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                            Recommended specifications:
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• Format: JPG, PNG, WebP</Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• Min resolution: 1920x1080</Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• Max file size: 5MB</Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>• Aspect ratio: 16:9</Typography>
                                        <Alert
                                            severity="info"
                                            sx={{
                                                mt: 2,
                                                background: 'rgba(33, 150, 243, 0.1)',
                                                color: 'white',
                                                border: '1px solid rgba(33, 150, 243, 0.3)',
                                                '& .MuiAlert-icon': {
                                                    color: '#60a5fa'
                                                }
                                            }}
                                        >
                                            Changes will be applied to the main layout background.
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Box>
    );
};

export default Settings;
