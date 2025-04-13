const express = require("express");
const router = express.Router();
const indisponibiliteController = require("../controllers/indisponibilite.controller");

// ✅ Récupérer toutes les indisponibilités d’un service en un mois donné
router.get("/", indisponibiliteController.getDisponibiliteMois);

// ✅ Récupérer mécanicien disponible pour un service donné
router.get("/mecanicien", indisponibiliteController.getMecanicienDisponibilite);

// ✅ Récupérer les indisponibilités dans une journée donnée
router.get("/jour", indisponibiliteController.getHeureDispo);

module.exports = router;