require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const connectDB = require('./config/db');
const swaggerDocs = require('./docs/swagger');
const authRoutes = require('./routes/login');
const sliderRoutes = require('./routes/slider');
const recentActivityRoutes = require('./routes/recentActivity');
const latestActivityRoutes = require('./routes/latestActivity');
const youtubeVideoRoutes = require('./routes/youtubeVideo');
const memberRoutes = require('./routes/member');
const galleryRoutes = require('./routes/gallery');
const upcomingEventRoutes = require('./routes/upcomigEvent');
const crowdFundingRoutes = require('./routes/crowdFunding');
const problemRaisedRoutes = require('./routes/problemRaised');
const ourProjectRoutes = require('./routes/ourProject');
const donationRoutes = require('./routes/donation');
const memberApplicationRoutes = require('./routes/memberApply');
const enquiryRoutes = require('./routes/Enquiry');
const achievementRoutes = require('./routes/achievement');
const uploadRoutes = require('./routes/upload');
const dashboardRoutes = require('./routes/dashboard');

// Ensure upload directories exist
const uploadDirs = [
    'uploads',
    'uploads/slider',
    'uploads/members',
    'uploads/latest-activity',
    'uploads/gallery',
    'uploads/events',
    'uploads/crowdfunding',
    'uploads/problems',
    'uploads/projects',
    'uploads/donations',
    'uploads/member-applications'
];

uploadDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Middleware
swaggerDocs(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Server static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
}));

// MongoDB Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/slider', sliderRoutes);
app.use('/api/recent-activity', recentActivityRoutes);
app.use('/api/latest-activity', latestActivityRoutes);
app.use('/api/youtube-video', youtubeVideoRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upcoming-event', upcomingEventRoutes);
app.use('/api/crowdfunding', crowdFundingRoutes);
app.use('/api/problem-raised', problemRaisedRoutes);
app.use('/api/projects', ourProjectRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/member-application', memberApplicationRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/achievement', achievementRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
