const express = require("express");
const router = express.Router();
const Indisponibilite = require("../models/indisponibilite.model");

// ✅ Récupérer toutes les indisponibilités d’un service en un mois donné
router.get("/:serviceId/:mois/:annee", async (req, res) => {
    try {
        const { serviceId, mois, annee } = req.params;
        // Définir la plage de dates du mois
        const startDate = new Date(year, month - 1, 1, 0, 0, 0); // 1er jour du mois
        const endDate = new Date(year, month, 0, 23, 59, 59); // Dernier jour du mois

        // Récupérer les indisponibilités du service pour le mois donné
        const indisponibilites = await Indisponibilite.find({
            service: serviceId,
            debut: { $gte: startDate },
            fin: { $lte: endDate }
        });

        // Regrouper les dates d’indisponibilité par jour
        let datesIndisponibles = new Set();
        indisponibilites.forEach(indispo => {
            let currentDate = new Date(indispo.debut);
            const lastDate = new Date(indispo.fin);

            // Boucler sur chaque jour couvert par l'indisponibilité
            while (currentDate <= lastDate) {
                datesIndisponibles.add(currentDate.toISOString().split('T')[0]); // Format YYYY-MM-DD
                currentDate.setDate(currentDate.getDate() + 1); // Passer au jour suivant
            }
        });

        // Convertir le Set en tableau trié
        res.json(Array.from(datesIndisponibles).sort());
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// ✅ Ajouter une indisponibilité
router.post("/", async (req, res) => {
    try {
        const { serviceId, debut, fin } = req.body;
        const nouvelleIndisponibilite = new Indisponibilite({
            service: serviceId,
            debut,
            fin
        });
        await nouvelleIndisponibilite.save();
        res.status(201).json(nouvelleIndisponibilite);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création", error });
    }
});

module.exports = router;