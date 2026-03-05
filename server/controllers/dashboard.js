const Donation = require('../models/donation');
const Member = require('../models/member');
const MemberApply = require('../models/memberApply');
const ProblemRaised = require('../models/problemRaised');

exports.getDashboardStats = async (req, res) => {
    try {
        const donationCount = await Donation.countDocuments();
        const totalDonations = await Donation.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const memberCount = await Member.countDocuments();
        const applicationCount = await MemberApply.countDocuments();
        const problemCount = await ProblemRaised.countDocuments();

        // Month-wise donations for the last 12 months
        const monthlyDonations = await Donation.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                    amount: 1
                }
            },
            {
                $group: {
                    _id: { month: "$month", year: "$year" },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 12 }
        ]);

        res.json({
            stats: {
                totalApplications: applicationCount,
                totalDonationAmount: totalDonations[0]?.total || 0,
                totalProblemsRaised: problemCount,
                totalMembers: memberCount
            },
            monthlyDonations: monthlyDonations.reverse() // Sort back to chronological
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ message: error.message });
    }
};
