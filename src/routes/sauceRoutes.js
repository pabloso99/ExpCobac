const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauceController');

// Rutas para salsas
router.post('/', sauceController.createSauce);
router.get('/', sauceController.getSauces);
router.get('/:id', sauceController.getSauce);
router.put('/:id', sauceController.updateSauce);
router.delete('/:id', sauceController.deleteSauce);

module.exports = router;
