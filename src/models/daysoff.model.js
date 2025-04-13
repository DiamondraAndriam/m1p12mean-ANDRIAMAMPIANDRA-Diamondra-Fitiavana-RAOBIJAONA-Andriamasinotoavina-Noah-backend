const mongoose = require('mongoose');

const daysoffSchema = new mongoose.Schema({
    day: { type: Number, required: true }, // 0 si dimanche, 6 si samedi
    description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Daysoff', daysoffSchema);