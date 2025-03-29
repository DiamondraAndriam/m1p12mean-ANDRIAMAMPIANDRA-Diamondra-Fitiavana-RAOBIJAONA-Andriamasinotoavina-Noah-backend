const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mecaniciensId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    status: { type: String, enum: ['attente', 'confirmé', 'terminé'], default: 'pending' },
    description: { type: String}
  });
  
  module.exports = mongoose.model('RendezVous', rendezVousSchema);