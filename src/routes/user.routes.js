const express = require("express");
const User = require("../models/user.model");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.put("/:id/disable", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;