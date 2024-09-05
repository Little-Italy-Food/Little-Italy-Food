const Report = require('../models/reports');
const User = require('../models/users');

exports.createReport = async (req, res) => {
  try {
    const { dishId, commentId, reason } = req.body;
    const reporterId = req.user.id;

    const newReport = new Report({
      reporterId,
      dishId,
      commentId,
      reason
    });

    await newReport.save();

    res.status(201).json({ message: 'Report submitted successfully', report: newReport });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Error submitting report' });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const reports = await Report.find()
      .populate('reporterId', 'username')
      .populate('dishId', 'title')
      .populate('commentId', 'content');

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
};