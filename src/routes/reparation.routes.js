const express = require("express");
const router = express.Router();
const Reparation = require("../models/reparation.model");

// ✅ Récupérer toutes les réparations d’un mécanicien
router.get("/mecanicien/:mecanicienId", async (req, res) => {
    try {
        const reparations = await Reparation.find({ mecanicienId: req.params.mecanicienId });
        res.json(reparations);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// ✅ Ajouter une nouvelle réparation
router.post("/", async (req, res) => {
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

// ✅ Modifier le statut et le commentaire d’une réparation
router.put("/:id", async (req, res) => {
    try {
        const { statut, commentaire } = req.body;
        const reparation = await Reparation.findByIdAndUpdate(req.params.id, { statut, commentaire }, { new: true });
        res.json(reparation);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour", error });
    }
});

// ✅ Supprimer une réparation
router.delete("/:id", async (req, res) => {
    try {
        await Reparation.findByIdAndDelete(req.params.id);
        res.json({ message: "Réparation supprimée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;