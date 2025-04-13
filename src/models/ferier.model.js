const mongoose = require('mongoose');

const ferierSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Ferier', ferierSchema);