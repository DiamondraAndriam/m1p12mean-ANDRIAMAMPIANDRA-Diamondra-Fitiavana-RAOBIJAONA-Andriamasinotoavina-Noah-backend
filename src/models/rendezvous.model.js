const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mecaniciens: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type:String, enum: ['électricien', 'mecanicien', 'depanneur', 'nettoyeur', 'diagnosticien'], required: true },
    }],
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    status: { type: String, enum: ['attente', 'confirmé', 'terminé'], default: 'attente' },
    description: { type: String}
  });
  
module.exports = mongoose.model('RendezVous', rendezVousSchema);