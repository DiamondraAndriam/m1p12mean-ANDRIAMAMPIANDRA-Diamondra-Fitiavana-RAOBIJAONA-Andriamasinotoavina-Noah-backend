const mongoose = require('mongoose');

// Debut et fin sont mm date mais différents heures
const indisponibiliteDateSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }
}, { timestamps: true });

module.exports = mongoose.model('IndisponibiliteDate', indisponibiliteDateSchema);
