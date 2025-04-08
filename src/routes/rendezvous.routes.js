const express = require("express");
const router = express.Router();
const Rendezvous = require("../models/rendezvous.model");
const {updateDisponibilite} = require("../controllers/indisponibilite.controller");

// ✅ Récupérer tous les rendez-vous d’un client
router.get("/client/:clientId", async (req, res) => {
    try {
        const rendezvous = await Rendezvous.find({ clientId: req.params.clientId });
        res.json(rendezvous);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// ✅ Récupérer tous les rendez-vous d’un mécanicien
router.get("/mecanicien/:mecanicienId", async (req, res) => {
    try {
        const rendezvous = await Rendezvous.find({ mecaniciensId: req.params.mecanicienId });
        res.json(rendezvous);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// ✅ Ajouter un nouveau rendez-vous
router.post("/", async (req, res) => {
    try {
        const { clientId, mecanicienId, serviceId, start, end, status, description } = req.body;
        const nouveauRendezvous = new Rendezvous({
            clientId,
            mecanicienId,
            serviceId,
            start,
            end,
            status,
            description
        });
        await nouveauRendezvous.save();

        // mise à jour des différentes disponibilités pendant ces heures
        await updateDisponibilite(nouveauRendezvous);

        res.status(201).json(nouveauRendezvous);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création", error });
    }
});

module.exports = router;