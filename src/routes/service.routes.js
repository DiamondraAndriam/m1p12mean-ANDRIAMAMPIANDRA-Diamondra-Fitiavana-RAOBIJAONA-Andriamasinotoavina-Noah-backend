const express = require("express");
const router = express.Router();
const Service = require("../models/service.model");

router.get("/", async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

router.post("/", async (req, res) => {
  try {
      const { nom, description, prix, temps_estime, typeMecanicien } = req.body;
      const newService = new Service({
          nom,
          description,
          prix,
          temps_estime,
          typeMecanicien
      });
      await newService.save();
      res.status(201).json(newService);
  } catch (error) {
      res.status(400).json({ message: "Erreur lors de la création", error });
  }
});

router.put("/:id", async (req, res) => {
    try {
        const { nom, description, prix, temps_estime, typeMecanicien } = req.body;
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { nom, description, prix, temps_estime, typeMecanicien },
            { new: true }
        );
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }
        res.json(service);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour", error });
    }
});

module.exports = router;