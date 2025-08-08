
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.post('/', propertyController.createProperty);
router.get('/', propertyController.getProperties);
router.get('/rented-vacant', propertyController.getRentedVacant);
router.get('/income-portfolio', propertyController.getIncomePortfolio);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router; 






