const mongoose = require('mongoose');

const rendezvousSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    mecanicienId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, 
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service', 
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['attente', 'en_cours', 'terminé', 'annulé'],
      default: 'attente',
    },
    description: {
      type: String,
      required: true,
    },
    reminderSent: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

const Rendezvous = mongoose.model('Rendezvous', rendezvousSchema);

module.exports = Rendezvous;
