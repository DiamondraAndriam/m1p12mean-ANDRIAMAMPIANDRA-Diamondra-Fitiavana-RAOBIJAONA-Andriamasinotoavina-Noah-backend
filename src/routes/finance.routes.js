const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');

router.get('/revenus/mois/:annee', financeController.getRevenusParMois);

router.get('/revenus/service', financeController.getRevenusParService);

module.exports = router;