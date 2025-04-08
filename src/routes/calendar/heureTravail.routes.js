const express = require('express');
const router = express.Router();
const heureTravail = require('../../models/heureTravail.model');

router.get('/', async (req, res) => {
    try {
        const heures = await heureTravail.findOne();
        res.json(heures);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { debut, fin } = req.body;
        const updatedHeureTravail = await heureTravail.findByIdAndUpdate(
            req.params.id,
            { debut, fin },
            { new: true }
        );
        res.json(updatedHeureTravail);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const { debut, fin } = req.body;
        const newHeureTravail = new heureTravail({ debut, fin });
        await newHeureTravail.save();
        res.status(201).json(newHeureTravail);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création', error });
    }
});

module.exports = router;