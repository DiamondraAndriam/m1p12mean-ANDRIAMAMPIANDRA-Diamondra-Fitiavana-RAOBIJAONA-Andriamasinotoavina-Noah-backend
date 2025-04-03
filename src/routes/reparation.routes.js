const express = require("express");
const router = express.Router();
const Reparation = require("../models/reparation.model");
const reparationController = require("../controllers/reparation.controller");
const protect = require('../middlewares/auth.middleware');

// ✅ Récupérer toutes les réparations d’un mécanicien
router.get("/mecanicien/:mecanicienId", protect, async (req, res) => {
    try {
        const reparations = await Reparation.find({ mecanicienId: req.params.mecanicienId })
            .populate("piecesRemplacees.partId") // Popule toutes les données des pièces
            .exec();

        res.json(reparations);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// ✅ Ajouter une nouvelle réparation
router.post("/", protect, async (req, res) => {
    try {
        const { rendezVousId, mecanicienId, voiture, piecesRemplacees, statut, commentaire } = req.body;

        const factureTotale = piecesRemplacees.reduce((total, piece) => total + piece.prix, 0);

        const nouvelleReparation = new Reparation({
            rendezVousId,
            mecanicienId,
            voiture,
            piecesRemplacees,
            statut,
            commentaire,
            factureTotale
        });

        await nouvelleReparation.save();
        res.status(201).json(nouvelleReparation);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création", error });
    }
});

router.put("/:id", protect, reparationController.updateReparation);

module.exports = router;