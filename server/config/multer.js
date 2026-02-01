const multer = require('multer');
const path = require('path');

// Slider storage
const sliderStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/slider'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Member storage
const memberStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/members'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Latest Activity storage
const latestActivityStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/latest-activity'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Gallery storage
const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/gallery'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const sliderUpload = multer({ storage: sliderStorage });
const memberUpload = multer({ storage: memberStorage });
const latestActivityUpload = multer({ storage: latestActivityStorage });
const galleryUpload = multer({ storage: galleryStorage });

module.exports = { sliderUpload, memberUpload, latestActivityUpload, galleryUpload };
