const mongoose = require('mongoose');

const memberApplicationSchema = new mongoose.Schema({
    organization_name: { type: String, required: false },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    date_of_birth: { type: String, required: true },
    relation_type: { type: String, required: true },
    relation_name: { type: String, required: true },
    profession: { type: String, required: false },
    blood_group: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    mobile_number: { type: String, required: true },
    aadhar_number: { type: String, required: true },
    address: { type: String, required: true },
    pin_code: { type: String, required: true },
    email: { type: String, required: false },
    id_type: { type: String, required: true },
    profile_picture: { type: String, required: false },
    id_document: { type: String, required: true },
    other_document: { type: String, required: false },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('MemberApplication', memberApplicationSchema);
