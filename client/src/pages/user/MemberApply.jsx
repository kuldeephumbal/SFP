import { useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MemberApply = () => {
    const [formData, setFormData] = useState({
        organizationName: "",
        name: "",
        gender: "Male",
        dob: "",
        relationType: "S/O",
        relationName: "",
        profession: "",
        bloodGroup: "",
        state: "",
        district: "",
        mobile: "",
        aadhar: "",
        address: "",
        pincode: "",
        email: "",
        profilePicture: null,
        idType: "",
        idDocument: null,
        otherDocument: null,
        declaration: false,
    });

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const statesAndCities = {
        Gujarat: [
            "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
        ],
        Maharashtra: [
            "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Navi Mumbai", "Sangli", "Jalgaon", "Akola", "Latur", "Ahmednagar", "Parbhani", "Ichalkaranji", "Chandrapur", "Bhusawal", "Beed", "Gondia", "Satara", "Yavatmal", "Osmanabad", "Nanded", "Wardha", "Hingoli", "Washim", "Ratnagiri", "Buldhana", "Bhandara", "Gadchiroli", "Sindhudurg"
        ],
        Rajasthan: [
            "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
        ]
    };

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (files) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.declaration) {
            toast.warning("You must accept the declaration.");
            return;
        }

        const submitData = new FormData();
        submitData.append("organization_name", formData.organizationName);
        submitData.append("name", formData.name);
        submitData.append("gender", formData.gender);
        submitData.append("date_of_birth", formData.dob);
        submitData.append("relation_type", formData.relationType);
        submitData.append("relation_name", formData.relationName);
        submitData.append("profession", formData.profession);
        submitData.append("blood_group", formData.bloodGroup);
        submitData.append("state", formData.state);
        submitData.append("district", formData.district);
        submitData.append("mobile_number", formData.mobile);
        submitData.append("aadhar_number", formData.aadhar);
        submitData.append("address", formData.address);
        submitData.append("pin_code", formData.pincode);
        submitData.append("email", formData.email);
        submitData.append("id_type", formData.idType);

        if (formData.profilePicture) {
            submitData.append("image", formData.profilePicture);
        }
        if (formData.idDocument) {
            submitData.append("document", formData.idDocument);
        }
        if (formData.otherDocument) {
            submitData.append("document", formData.otherDocument);
        }

        axios.post("http://localhost:5000/api/add-member-application", submitData)
            .then((response) => {
                console.log("Form Data Submitted:", response.data);
                setFormData({
                    organizationName: "",
                    name: "",
                    gender: "Male",
                    dob: "",
                    relationType: "S/O",
                    relationName: "",
                    profession: "",
                    bloodGroup: "",
                    state: "",
                    district: "",
                    mobile: "",
                    aadhar: "",
                    address: "",
                    pincode: "",
                    email: "",
                    profilePicture: null,
                    idType: "",
                    idDocument: null,
                    otherDocument: null,
                    declaration: false,
                });
                toast.success("Member application submitted successfully.");
            })
            .catch((error) => {
                console.error("Error submitting member application:", error.response?.data || error.message);
                toast.error("There was an error submitting your application. Please try again.");
            });
    };

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
                        <Box sx={{ bgcolor: '#1976d2', color: 'white', p: 2, textAlign: 'center', mb: 3, borderRadius: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                Registration
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            {/* Organization */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                    Are you working for any social service organization?
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Organization Name"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                />
                            </Box>

                            {/* Name and Gender */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Name *"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Gender *</InputLabel>
                                        <Select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            label="Gender *"
                                        >
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Date of Birth & Relation */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        required
                                        type="date"
                                        label="Date of Birth *"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Relation *</InputLabel>
                                        <Select
                                            name="relationType"
                                            value={formData.relationType}
                                            onChange={handleChange}
                                            label="Relation *"
                                        >
                                            <MenuItem value="S/O">S/O</MenuItem>
                                            <MenuItem value="D/O">D/O</MenuItem>
                                            <MenuItem value="W/O">W/O</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Relation Name *"
                                        name="relationName"
                                        placeholder="Relation Name"
                                        value={formData.relationName}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            {/* Profession & Blood Group */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Profession"
                                        name="profession"
                                        placeholder="Your profession"
                                        value={formData.profession}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Blood Group *</InputLabel>
                                        <Select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                            label="Blood Group *"
                                        >
                                            <MenuItem value="">Select Blood Group</MenuItem>
                                            {bloodGroups.map((group) => (
                                                <MenuItem key={group} value={group}>
                                                    {group}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* State and District */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>State *</InputLabel>
                                        <Select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            label="State *"
                                        >
                                            <MenuItem value="">Select State</MenuItem>
                                            {Object.keys(statesAndCities).map((state) => (
                                                <MenuItem key={state} value={state}>
                                                    {state}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>District *</InputLabel>
                                        <Select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            label="District *"
                                        >
                                            <MenuItem value="">Select District</MenuItem>
                                            {formData.state &&
                                                statesAndCities[formData.state]?.map((city) => (
                                                    <MenuItem key={city} value={city}>
                                                        {city}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Mobile & Aadhar */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Mobile No. *"
                                        name="mobile"
                                        placeholder="Mobile Number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Aadhar No. *"
                                        name="aadhar"
                                        placeholder="Aadhar Number"
                                        value={formData.aadhar}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            {/* Address */}
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                    label="Address *"
                                    name="address"
                                    placeholder="Your address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </Box>

                            {/* Pincode & Email */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Pin Code *"
                                        name="pincode"
                                        placeholder="Pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        label="Email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>

                            {/* File Uploads */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Profile</Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                    >
                                        {formData.profilePicture ? formData.profilePicture.name : 'Choose File'}
                                        <input
                                            type="file"
                                            hidden
                                            name="profilePicture"
                                            onChange={handleChange}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Select Your ID *</InputLabel>
                                        <Select
                                            name="idType"
                                            value={formData.idType}
                                            onChange={handleChange}
                                            label="Select Your ID *"
                                        >
                                            <MenuItem value="">Select ID</MenuItem>
                                            <MenuItem value="Passport">Passport</MenuItem>
                                            <MenuItem value="Driver License">Driver License</MenuItem>
                                            <MenuItem value="Voter ID">Voter ID</MenuItem>
                                            <MenuItem value="Aadhar">Aadhar</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Upload Your ID *</Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        required
                                        sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                    >
                                        {formData.idDocument ? formData.idDocument.name : 'Choose File'}
                                        <input
                                            type="file"
                                            hidden
                                            name="idDocument"
                                            onChange={handleChange}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Other Document</Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                    >
                                        {formData.otherDocument ? formData.otherDocument.name : 'Choose File'}
                                        <input
                                            type="file"
                                            hidden
                                            name="otherDocument"
                                            onChange={handleChange}
                                        />
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Declaration */}
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="declaration"
                                            checked={formData.declaration}
                                            onChange={handleChange}
                                        />
                                    }
                                    label="I accept the declaration."
                                />
                                <Box component="ol" sx={{ pl: 3, mt: 1, mb: 0 }}>
                                    <li>The information provided by me is true and accurate.</li>
                                    <li>I want to join Shankhnad Foundation and actively participate in its activities.</li>
                                    <li>I have not been convicted of any criminal offense and am not involved in any illegal activities.</li>
                                    <li>I will abide by the rules and regulations of Shankhnad Foundation and will not engage in any activity detrimental to the organization.</li>
                                </Box>
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        bgcolor: '#1976d2',
                                        px: 5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        textTransform: 'uppercase',
                                        '&:hover': { bgcolor: '#1565c0' }
                                    }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default MemberApply;
