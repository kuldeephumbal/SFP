import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    InputAdornment,
    TextField
} from '@mui/material';
import { Add, Edit, Delete, Layers, Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import BaseTable from '../../components/BaseTable';

const AdminOurProjects = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        topic: '',
        topic_details: '',
        photo: ''
    });
    const [imagePreview, setImagePreview] = useState('');

    // Mock data
    const [projects, setProjects] = useState([
        {
            id: 1,
            topic: 'Education for Underprivileged Children',
            topic_details: 'Providing free education and study materials to children from economically weaker sections. This project aims to bridge the educational gap and empower future generations with knowledge and skills. We organize regular tutoring sessions, distribute books, and provide scholarships.',
            photo: '/uploads/project1.jpg',
            created_at: '2026-01-20T09:00:00'
        },
        {
            id: 2,
            topic: 'Clean Water Initiative',
            topic_details: 'Installing water purification systems in rural areas to provide access to clean drinking water. This initiative targets villages with limited access to safe water sources, helping prevent waterborne diseases and improving overall community health.',
            photo: '/uploads/project2.jpg',
            created_at: '2026-01-18T11:30:00'
        },
        {
            id: 3,
            topic: 'Women Empowerment Program',
            topic_details: 'Skill development training for women to promote financial independence and entrepreneurship. Participants receive training in various vocational skills including tailoring, handicrafts, computer literacy, and small business management.',
            photo: '/uploads/project3.jpg',
            created_at: '2026-01-15T14:45:00'
        }
    ]);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({ topic: '', topic_details: '', photo: '' });
        setImagePreview('');
        setSelectedProject(null);
    };

    const handleAddProject = () => {
        if (!formData.topic || !formData.topic_details || !formData.photo) {
            toast.warning('Please fill all fields and upload an image');
            return;
        }

        const newProject = {
            id: projects.length + 1,
            topic: formData.topic,
            topic_details: formData.topic_details,
            photo: formData.photo,
            created_at: new Date().toISOString()
        };

        setProjects([...projects, newProject]);
        toast.success('Project added successfully!');
        setAddDialogOpen(false);
        resetForm();
    };

    const handleEditProject = () => {
        if (!formData.topic || !formData.topic_details) {
            toast.warning('Please fill all required fields');
            return;
        }

        setProjects(
            projects.map((project) =>
                project.id === selectedProject.id
                    ? {
                        ...project,
                        topic: formData.topic,
                        topic_details: formData.topic_details,
                        photo: formData.photo || project.photo
                    }
                    : project
            )
        );

        toast.success('Project updated successfully!');
        setEditDialogOpen(false);
        resetForm();
    };

    const handleDeleteProject = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            setProjects(projects.filter((project) => project.id !== id));
            toast.success('Project deleted successfully!');
        }
    };

    const openEditDialog = (project) => {
        setSelectedProject(project);
        setFormData({
            topic: project.topic,
            topic_details: project.topic_details,
            photo: project.photo
        });
        setImagePreview(project.photo);
        setEditDialogOpen(true);
    };

    const filteredProjects = projects.filter(
        (project) =>
            project.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.topic_details.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <CustomBreadcrumb />

            {/* Page Header */}
            <div className="container-fluid mb-4">
                <div className="row align-items-center">
                    <div className="col">
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                            Our Projects
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Manage all foundation projects and initiatives
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
                            placeholder="Search projects..."
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
                            icon={<Layers />}
                            label={`Total: ${filteredProjects.length}`}
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
                            onClick={() => {
                                resetForm();
                                setAddDialogOpen(true);
                            }}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                px: 3,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                                }
                            }}
                        >
                            Add Project
                        </Button>
                    </Box>

                    {/* Projects Table */}
                    <BaseTable
                        columns={[
                            {
                                field: 'photo',
                                headerName: 'Photo',
                                minWidth: '150px',
                                renderCell: (row) => (
                                    <img
                                        src={row.photo.startsWith('data:') ? row.photo : `http://localhost:5000${row.photo}`}
                                        alt={row.topic}
                                        style={{
                                            width: '120px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                            border: '2px solid rgba(255, 255, 255, 0.2)'
                                        }}
                                    />
                                )
                            },
                            {
                                field: 'topic',
                                headerName: 'Project Topic',
                                minWidth: '200px',
                                renderCell: (row) => (
                                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>
                                        {row.topic}
                                    </Typography>
                                )
                            },
                            {
                                field: 'topic_details',
                                headerName: 'Project Details',
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
                                        {row.topic_details}
                                    </Typography>
                                )
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
                        data={filteredProjects}
                        searchable={false}
                        renderActions={(row) => (
                            <>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#60a5fa', mr: 1 }}
                                    onClick={() => openEditDialog(row)}
                                    title="Edit Project"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: '#f87171' }}
                                    onClick={() => handleDeleteProject(row.id)}
                                    title="Delete Project"
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Add Project Dialog */}
            <Dialog
                open={addDialogOpen}
                onClose={() => {
                    setAddDialogOpen(false);
                    resetForm();
                }}
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
                        Add New Project
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Project Topic"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#60a5fa' }
                            }}
                        />

                        <TextField
                            label="Project Details"
                            value={formData.topic_details}
                            onChange={(e) => setFormData({ ...formData, topic_details: e.target.value })}
                            multiline
                            rows={4}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#60a5fa' }
                            }}
                        />

                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                            }}
                        >
                            Upload Photo
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>

                        {imagePreview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px' }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => {
                            setAddDialogOpen(false);
                            resetForm();
                        }}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddProject}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        Add Project
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Project Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => {
                    setEditDialogOpen(false);
                    resetForm();
                }}
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
                        Edit Project
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Project Topic"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#60a5fa' }
                            }}
                        />

                        <TextField
                            label="Project Details"
                            value={formData.topic_details}
                            onChange={(e) => setFormData({ ...formData, topic_details: e.target.value })}
                            multiline
                            rows={4}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: '#60a5fa' }
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#60a5fa' }
                            }}
                        />

                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                '&:hover': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                            }}
                        >
                            Change Photo (Optional)
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>

                        {imagePreview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={imagePreview.startsWith('data:') ? imagePreview : `http://localhost:5000${imagePreview}`}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px' }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => {
                            setEditDialogOpen(false);
                            resetForm();
                        }}
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditProject}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        Update Project
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminOurProjects;
