const express = require("express");
const router = express.Router();
const Reparation = require("../models/reparation.model");
require("../models/service.model");
const reparationController = require("../controllers/reparation.controller");
const protect = require('../middlewares/auth.middleware');

// ✅ Récupérer toutes les réparations d’un mécanicien
router.get("/mecanicien/:mecanicienId", protect, async (req, res) => {
    try {
      const reparations = await Reparation.find()
        .populate({
          path: "rendezVousId",
          populate: [
            { path: "serviceId", select: "nom description temps_estime" },
            { path: "clientId", select: "nom" }
          ]
        })
        .populate("piecesRemplacees.partId")
        .exec();

        const filtered = reparations.filter(reparation => {
          return reparation.rendezVousId?.mecanicienId?.toString() === req.params.mecanicienId;
        });
  
      res.json(filtered);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error });
    }
  });

  // ✅ Récupérer toutes les réparations d’un client
  router.get("/client/:id", protect, async (req, res) => {
    try {
      const reparations = await Reparation.find()
        .populate({
          path: "rendezVousId",
          populate: [
            { path: "serviceId", select: "nom description temps_estime" },
            { path: "clientId", select: "_id nom" },
            { path: "mecanicienId", select: "matricule" }
          ]
        })
        .populate("piecesRemplacees.partId")
        .exec();
  
      // Tu filtres avec mecanicienId (pas mecaniciens)
      const filtered = reparations.filter(reparation => {
        return reparation.rendezVousId?.clientId?._id.toString() === req.params.id
      });
  
      res.json(filtered);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur", error });
    }
  });
  
  // recuperer tous les reparations
  router.get("/", protect, async (req, res) => {
    try {
      const reparations = await Reparation.find()
        .populate({
          path: "rendezVousId",
          populate: [
            { path: "serviceId", select: "nom description temps_estime" },
            { path: "clientId", select: "nom" },
            { path: "mecanicienId", select: "matricule" }
          ]
        })
        .populate("piecesRemplacees.partId")
        .exec();
  
      const filtered = reparations;
  
      res.json(filtered);
    } catch (error) {
      console.error(error);
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