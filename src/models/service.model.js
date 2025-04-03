const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    category: { type: String},
    mecaniciens: [{
        type: { type: String, enum: ['électricien', 'mecanicien', 'depanneur', 'nettoyeur', 'diagnosticien'], required: true },
        quantity: { type: Number, required: true }, _id: false
    }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);