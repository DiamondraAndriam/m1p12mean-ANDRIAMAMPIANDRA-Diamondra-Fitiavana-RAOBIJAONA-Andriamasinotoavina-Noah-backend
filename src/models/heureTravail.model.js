const mongoose = require('mongoose');

const heureTravailSchema = new mongoose.Schema({
    debut: { type: String, required: true },
    fin: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('heureTravail', heureTravailSchema);