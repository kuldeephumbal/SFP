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
import { Add, Edit, Delete, YouTube, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../components/BaseURL';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import BaseTable from '../../components/BaseTable';

const AdminYoutubeVideos = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [editVideoUrl, setEditVideoUrl] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchVideos = () => {
        setLoading(true);
        api
            .get('/youtube-video')
            .then((res) => {
                const list = res.data.map((v) => ({
                    id: v._id,
                    ...v,
                    created_at: v.createdAt || v.created_at,
                }));
                setVideos(list);
            })
            .catch((err) => {
                console.error('Error fetching youtube videos', err);
                toast.error('Failed to load YouTube videos');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchVideos();
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

    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('embed/')) return url;
        let videoId = '';
        if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    const isValidYoutubeUrl = (url) => {
        return /youtube\.com\/(watch\?v=|embed\/)|youtu\.be\//.test(url);
    };

    const handleAddVideo = () => {
        if (!newVideoUrl.trim()) {
            toast.warning('Video URL is required.');
            return;
        }
        if (!isValidYoutubeUrl(newVideoUrl.trim())) {
            toast.warning('Please enter a valid YouTube URL.');
            return;
        }
        setLoading(true);
        api
            .post('/youtube-video', { url: newVideoUrl.trim() })
            .then((res) => {
                const video = {
                    id: res.data.video._id,
                    ...res.data.video,
                    created_at: res.data.video.createdAt,
                };
                setVideos([video, ...videos]);
                toast.success('Video added successfully!');
                setAddDialogOpen(false);
                setNewVideoUrl('');
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Failed to add video';
                toast.error(message);
                console.error('Add video error', err);
            })
            .finally(() => setLoading(false));
    };

    const handleEditClick = (video) => {
        setSelectedVideo(video);
        setEditVideoUrl(video.url);
        setEditDialogOpen(true);
    };

    const handleUpdateVideo = () => {
        if (!editVideoUrl.trim()) {
            toast.warning('Video URL is required.');
            return;
        }
        if (!isValidYoutubeUrl(editVideoUrl.trim())) {
            toast.warning('Please enter a valid YouTube URL.');
            return;
        }
        setLoading(true);
        api
            .put(`/youtube-video/${selectedVideo._id || selectedVideo.id}`, { url: editVideoUrl.trim() })
            .then((res) => {
                setVideos(
                    videos.map((v) =>
                        (v._id || v.id) === (selectedVideo._id || selectedVideo.id)
                            ? { id: res.data.video._id, ...res.data.video, created_at: res.data.video.createdAt }
                            : v
                    )
                );
                toast.success('Video updated successfully!');
                setEditDialogOpen(false);
                setSelectedVideo(null);
                setEditVideoUrl('');
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Failed to update video';
                toast.error(message);
                console.error('Update video error', err);
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteVideo = (id) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            setLoading(true);
            api
                .delete(`/youtube-video/${id}`)
                .then(() => {
                    setVideos(videos.filter((v) => (v._id || v.id) !== id));
                    toast.success('Video deleted successfully!');
                })
                .catch((err) => {
                    const message = err.response?.data?.message || 'Failed to delete video';
                    toast.error(message);
                    console.error('Delete video error', err);
                })
                .finally(() => setLoading(false));
        }
    };

    const filteredVideos = videos.filter((v) =>
        v.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <CustomBreadcrumb />

            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            YouTube Videos
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage embedded videos shown on the website
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
                            placeholder="Search videos..."
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
                            icon={<YouTube />}
                            label={`Total: ${filteredVideos.length}`}
                            sx={{
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
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
                            Add Video
                        </Button>
                    </Box>

                    {/* Videos Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'preview',
                                headerName: 'Preview',
                                minWidth: '280px',
                                renderCell: (row) => (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <iframe
                                            width="240"
                                            height="135"
                                            src={getEmbedUrl(row.url)}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{ borderRadius: 8 }}
                                        />
                                    </Box>
                                )
                            },
                            {
                                field: 'url',
                                headerName: 'Video URL',
                                minWidth: '300px'
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
                        data={filteredVideos}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    onClick={() => handleEditClick(row)}
                                    title="Edit Video"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#f87171' }}
                                    onClick={() => handleDeleteVideo(row.id)}
                                    title="Delete Video"
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Add Video Dialog */}
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
                        Add YouTube Video
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Video URL"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        sx={{
                            mt: 1,
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
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setAddDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddVideo}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Add Video
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Video Dialog */}
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
                        Edit YouTube Video
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Video URL"
                        value={editVideoUrl}
                        onChange={(e) => setEditVideoUrl(e.target.value)}
                        sx={{
                            mt: 1,
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
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleUpdateVideo}
                        sx={{
                            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            }
                        }}
                    >
                        Update Video
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminYoutubeVideos;
