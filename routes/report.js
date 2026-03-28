const express = require('express');
const router = express.Router();
const {
    getReports,
    getReportById,
    createReport,
    updateReport
} = require('../controllers/reportController');

router.get('/', getReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.put('/:id', updateReport);

module.exports = router;