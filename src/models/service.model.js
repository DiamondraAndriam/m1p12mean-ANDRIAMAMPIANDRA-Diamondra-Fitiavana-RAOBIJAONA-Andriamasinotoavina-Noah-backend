const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // Duration in minutes
    category: { type: String, required: true },
    mecaniciens: [{
        mecanicienId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        quantity: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);