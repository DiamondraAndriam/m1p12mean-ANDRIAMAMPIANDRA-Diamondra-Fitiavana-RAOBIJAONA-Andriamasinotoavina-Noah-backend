const mongoose = require('mongoose');

const indisponibiliteSchema = new mongoose.Schema({
    debut: { type: Date, required: true },
    fin: { 
        type: Date, 
        required: true, 
        validate: {
            validator: function(value) {
                return value > this.debut; // Vérifie que fin > debut
            },
            message: 'La date de fin doit être postérieure à la date de début.'
        }
    },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }
}, { timestamps: true });

// Indices pour améliorer les performances des requêtes
indisponibiliteSchema.index({ service: 1, debut: 1, fin: 1 });

module.exports = mongoose.model('Indisponibilite', indisponibiliteSchema);
