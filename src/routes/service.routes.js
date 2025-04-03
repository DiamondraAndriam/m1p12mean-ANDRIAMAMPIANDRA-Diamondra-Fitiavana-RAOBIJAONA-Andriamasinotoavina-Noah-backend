const express = require("express");
const router = express.Router();
const Service = require("../models/service.model");
const Employee = require("../models/user.model");

router.get("/", async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

router.post("/", async (req, res) => {
  try {
      const { name, description, price, duration } = req.body;
      const newService = new Service({
          name,
          description,
          price,
          duration,
          category: req.body.category,
          mecaniciens: req.body.mecaniciens.map(mec => ({
              type: mec.type,
              quantity: mec.quantity
          }))
      });
      await newService.save();
      res.status(201).json(newService);
  } catch (error) {
      res.status(400).json({ message: "Erreur lors de la création", error });
  }
});

module.exports = router;