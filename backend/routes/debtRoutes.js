
const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.post('/', debtController.createDebt);
router.get('/', debtController.getDebts);
router.get('/breakdown', debtController.getDebtBreakdown);
router.get('/summary', debtController.getDebtSummary);
router.get('/:id', debtController.getDebtById);
router.put('/:id', debtController.updateDebt);
router.delete('/:id', debtController.deleteDebt);

module.exports = router; 

