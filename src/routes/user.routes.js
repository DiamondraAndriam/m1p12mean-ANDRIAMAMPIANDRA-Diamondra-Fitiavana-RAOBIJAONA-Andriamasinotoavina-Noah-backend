const express = require("express");
const User = require("../models/user.model");
const router = express.Router();
const protect = require('../middlewares/auth.middleware');

router.get("/", protect, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.put("/:id/disable", protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        user.active = !user.active;

        await user.save();

        res.json({ message: `Utilisateur ${user.active ? "activé" : "désactivé"}`, user });
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

const updateUser = async (req, res) => {
    console.log('ato eeeee')
    const { id } = req.params;
    const {
      matricule,
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      role,
      typeMecanicien,
      active
    } = req.body;
  
    try {
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Met à jour les champs seulement si les valeurs sont fournies
      if (matricule) user.matricule = matricule;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (address) user.address = address;
      if (role) user.role = role;
      if (typeMecanicien) user.typeMecanicien = typeMecanicien;
      if (typeof active === 'boolean') user.active = active;
  
      if (password) {
        // Si le mot de passe change, on le hache manuellement ici
        user.password = password;
      }
  
      await user.save();
  
      res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l’utilisateur' });
    }
  };

  router.put('/:id', updateUser);

module.exports = router;