const mongoose = require('mongoose');

// Schéma pour les mécaniciens associés à un rendez-vous
const mecanicienSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assurez-vous que le modèle User existe
    required: true,
  },
  role: {
    type: String,
    enum: ['mecanicien', 'diagnosticien'],
    required: true,
  },
});

// Schéma principal pour un rendez-vous
const rendezvousSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client', // Assurez-vous que le modèle Client existe
      required: true,
    },
    mecaniciens: [mecanicienSchema], // Liste des mécaniciens associés
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service', // Référence au modèle Service
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
  },
  { timestamps: true } // Pour gérer les champs createdAt et updatedAt automatiquement
);

// Création du modèle à partir du schéma
const Rendezvous = mongoose.model('Rendezvous', rendezvousSchema);

module.exports = Rendezvous;
