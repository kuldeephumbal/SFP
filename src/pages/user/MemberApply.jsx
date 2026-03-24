import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Grid,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    Typography
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../components/BaseURL';

const MemberApply = () => {
    const { t } = useTranslation();
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

    const [errors, setErrors] = useState({});

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
            setFormData({ ...formData, [name]: files[0] });
        } else if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = t('registration.name_required');
        if (!formData.dob) newErrors.dob = t('registration.dob_required');
        if (!formData.relationName.trim()) newErrors.relationName = t('registration.relation_name_required');
        if (!formData.bloodGroup) newErrors.bloodGroup = t('registration.blood_group_required');
        if (!formData.state) newErrors.state = t('registration.state_required');
        if (!formData.district) newErrors.district = t('registration.district_required');
        if (!formData.mobile.trim()) {
            newErrors.mobile = t('registration.mobile_required');
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = t('registration.mobile_invalid');
        }
        if (!formData.aadhar.trim()) {
            newErrors.aadhar = t('registration.aadhar_required');
        } else if (!/^\d{12}$/.test(formData.aadhar)) {
            newErrors.aadhar = t('registration.aadhar_invalid');
        }
        if (!formData.pincode.trim()) {
            newErrors.pincode = t('registration.pincode_required');
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = t('registration.pincode_invalid');
        }
        if (!formData.idType) newErrors.idType = t('registration.id_type_required');
        if (!formData.address.trim()) newErrors.address = t('registration.address_required');
        if (!formData.idDocument) newErrors.idDocument = t('registration.id_document_required');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!formData.declaration) {
            toast.warning(t('registration.decl_warning'));
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
            submitData.append("id_document", formData.idDocument);
        }
        if (formData.otherDocument) {
            submitData.append("other_document", formData.otherDocument);
        }

        api.post("/member-application", submitData)
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
                toast.success(t('registration.success'));
            })
            .catch((error) => {
                console.error("Error submitting member application:", error.response?.data || error.message);
                toast.error(t('registration.error'));
            });
    };

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Paper sx={{ p: 4 }}>
                        <Box sx={{ bgcolor: '#1976d2', color: 'white', p: 2, textAlign: 'center', mb: 3, borderRadius: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>{t('registration.title')}</Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Organization */}
                                <Grid size={12}>
                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                        {t('registration.org_question')}
                                    </Typography>
                                    <TextField fullWidth placeholder={t('registration.org_placeholder')} name="organizationName" value={formData.organizationName} onChange={handleChange} />
                                </Grid>

                                {/* Name & Gender */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label={t('registration.name')} name="name" required placeholder={t('registration.name_placeholder')} value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth required>
                                        <InputLabel>{t('registration.gender')}</InputLabel>
                                        <Select name="gender" value={formData.gender} onChange={handleChange} label={t('registration.gender')}>
                                            <MenuItem value="Male">{t('registration.male')}</MenuItem>
                                            <MenuItem value="Female">{t('registration.female')}</MenuItem>
                                            <MenuItem value="Other">{t('registration.other')}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Date of Birth & Relation */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label={t('registration.dob')} type="date" name="dob" required value={formData.dob} onChange={handleChange} InputLabelProps={{ shrink: true }} error={!!errors.dob} helperText={errors.dob} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth required>
                                        <InputLabel>{t('registration.relation')}</InputLabel>
                                        <Select name="relationType" value={formData.relationType} onChange={handleChange} label={t('registration.relation')}>
                                            <MenuItem value="S/O">S/O</MenuItem>
                                            <MenuItem value="D/O">D/O</MenuItem>
                                            <MenuItem value="W/O">W/O</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Relation Name & Profession */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label={t('registration.relation_name')} name="relationName" required placeholder={t('registration.relation_name')} value={formData.relationName} onChange={handleChange} error={!!errors.relationName} helperText={errors.relationName} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label={t('registration.profession')} name="profession" placeholder={t('registration.profession_placeholder')} value={formData.profession} onChange={handleChange} />
                                </Grid>

                                {/* Blood Group & State */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth required error={!!errors.bloodGroup}>
                                        <InputLabel>{t('registration.blood_group')}</InputLabel>
                                        <Select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} label={t('registration.blood_group')}>
                                            <MenuItem value="">{t('registration.select_blood')}</MenuItem>
                                            {bloodGroups.map((group) => <MenuItem key={group} value={group}>{group}</MenuItem>)}
                                        </Select>
                                        {errors.bloodGroup && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.bloodGroup}</Typography>}
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth required error={!!errors.state}>
                                        <InputLabel>{t('registration.state')}</InputLabel>
                                        <Select name="state" value={formData.state} onChange={handleChange} label={t('registration.state')}>
                                            <MenuItem value="">{t('registration.select_state')}</MenuItem>
                                            {Object.keys(statesAndCities).map((state) => <MenuItem key={state} value={state}>{state}</MenuItem>)}
                                        </Select>
                                        {errors.state && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.state}</Typography>}
                                    </FormControl>
                                </Grid>

                                {/* District & Mobile */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth required error={!!errors.district}>
                                        <InputLabel>{t('registration.district')}</InputLabel>
                                        <Select name="district" value={formData.district} onChange={handleChange} label={t('registration.district')}>
                                            <MenuItem value="">{t('registration.select_district')}</MenuItem>
                                            {formData.state && statesAndCities[formData.state]?.map((city) => <MenuItem key={city} value={city}>{city}</MenuItem>)}
                                        </Select>
                                        {errors.district && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.district}</Typography>}
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label={t('registration.mobile')} name="mobile" required placeholder={t('registration.mobile')} value={formData.mobile} onChange={handleChange} error={!!errors.mobile} helperText={errors.mobile} />
                                </Grid>

                                {/* Aadhar & Email */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label={t('registration.aadhar')} name="aadhar" required placeholder={t('registration.aadhar')} value={formData.aadhar} onChange={handleChange} error={!!errors.aadhar} helperText={errors.aadhar} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth type="email" label={t('registration.email')} name="email" placeholder={t('registration.email')} value={formData.email} onChange={handleChange} />
                                </Grid>

                                {/* Pin Code & ID Type */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label={t('registration.pincode')} name="pincode" required placeholder={t('registration.pincode')} value={formData.pincode} onChange={handleChange} error={!!errors.pincode} helperText={errors.pincode} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <FormControl fullWidth required error={!!errors.idType}>
                                        <InputLabel>{t('registration.select_id')}</InputLabel>
                                        <Select name="idType" value={formData.idType} onChange={handleChange} label={t('registration.select_id')}>
                                            <MenuItem value="">{t('registration.select_id')}</MenuItem>
                                            <MenuItem value="Passport">{t('registration.id_types.passport')}</MenuItem>
                                            <MenuItem value="Driver License">{t('registration.id_types.driver')}</MenuItem>
                                            <MenuItem value="Voter ID">{t('registration.id_types.voter')}</MenuItem>
                                            <MenuItem value="Aadhar">{t('registration.id_types.aadhar')}</MenuItem>
                                        </Select>
                                        {errors.idType && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.idType}</Typography>}
                                    </FormControl>
                                </Grid>

                                {/* Address (Full Width for Multi-line) */}
                                <Grid size={12}>
                                    <TextField fullWidth label={t('registration.address')} multiline rows={3} name="address" required placeholder={t('registration.address_placeholder')} value={formData.address} onChange={handleChange} error={!!errors.address} helperText={errors.address} />
                                </Grid>

                                {/* Profile Picture & Upload ID */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{t('registration.profile_pic')}</Typography>
                                        <TextField fullWidth type="file" name="profilePicture" onChange={handleChange} InputLabelProps={{ shrink: true }} />
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{t('registration.upload_id')}</Typography>
                                        <TextField fullWidth type="file" name="idDocument" required onChange={handleChange} InputLabelProps={{ shrink: true }} error={!!errors.idDocument} helperText={errors.idDocument} />
                                    </Box>
                                </Grid>

                                {/* Other Document */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>{t('registration.other_doc')}</Typography>
                                        <TextField fullWidth type="file" name="otherDocument" onChange={handleChange} InputLabelProps={{ shrink: true }} />
                                    </Box>
                                </Grid>

                                {/* Empty Grid to balance the last row if needed, not strictly necessary */}
                                <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}></Grid>

                                {/* Declaration */}
                                <Grid size={12}>
                                    <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1, width: '100%' }}>
                                        <FormControlLabel control={<Checkbox name="declaration" checked={formData.declaration} onChange={handleChange} />} label={t('registration.accept_decl')} />
                                        <Box component="ol" sx={{ pl: 3, mt: 1, mb: 0 }}>
                                            <li>{t('registration.decl_1')}</li>
                                            <li>{t('registration.decl_2')}</li>
                                            <li>{t('registration.decl_3')}</li>
                                            <li>{t('registration.decl_4')}</li>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Submit Button */}
                                <Grid size={12}>
                                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                                        <Button type="submit" variant="contained" sx={{ bgcolor: '#1976d2', px: 5, py: 1.5, textTransform: 'uppercase', '&:hover': { bgcolor: '#1565c0' } }}>
                                            {t('registration.submit')}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default MemberApply;
