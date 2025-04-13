const Ferier = require('../../models/ferier.model');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const daysoff = require('../../models/daysoff.model');

router.get('/', async (req, res) => {
    try {
        const feriers = await Ferier.find();
        res.json(feriers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.get('/:month/:year', async (req, res) => {
    try {
        const { month, year } = req.params;
        const feriers = await Ferier.find({
            $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, month] },
              { $eq: [{ $year: "$date" }, year] }
            ]
          }});
        res.json(feriers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.get('/current', async (req, res) => {
    try {
        const today = new Date();
        const feriers = await Ferier.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$date" }, today.getMonth() + 1] },
                    { $eq: [{ $year: "$date" }, today.getFullYear()] }
                ]
            }
        });
        res.json(feriers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const { date, description } = req.body;
        const nouveauFerier = new Ferier({ date, description });
        await nouveauFerier.save();
        res.status(201).json(nouveauFerier);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création', error });
    }
});

// Mbola asiana check hoe rehefa misy ao dia tsy migénérer intsony.
router.get('/thisyear', async (req, res) => {
    try {
        const yearNum = new Date().getFullYear();
        const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${yearNum}/MG`);
        const publicHolidays = response.data;
        
        const weekends = [];
        const daysoffs = await daysoff.find({});
        
        for (let month = 0; month <= 12; month++) {
            let daysInMonth = new Date(yearNum, month + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(yearNum, month, day);
                const dayOfWeek = date.getDay(); // 0 = dimanche, 6 = samedi
                if (dayOfWeek in daysoffs) {
                    weekends.push({
                        date:date.toISOString().split('T')[0],
                        description: "Jour de non ouverture"});
                }
            }
        }

        const holidays = publicHolidays.map(holiday => ({
            date: holiday.date,
            description: holiday.localName
        }));

        const feriers = holidays.concat(weekends);

        Ferier.insertMany(feriers, { ordered: false })
            .then(() => {
                console.log("Ferier documents inserted successfully.");
            })
            .catch((error) => {
                console.error("Error inserting Ferier documents:", error);
            });
        res.json(feriers);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Ferier.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

module.exports = router;