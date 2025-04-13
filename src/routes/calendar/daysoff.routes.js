const daysoff = require('../../models/daysoff.model');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const daysoffs = await daysoff.find();
        res.json(daysoffs);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const newDaysoff = new daysoff(req.body);
        await newDaysoff.save();
        res.status(201).json(newDaysoff);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création', error });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { start, end } = req.body;
        const updatedDaysoff = await daysoff.findByIdAndUpdate(
            req.params.id,
            { start, end },
            { new: true }
        );
        res.json(updatedDaysoff);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await daysoff.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

module.exports = router;