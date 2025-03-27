const mongoose = require("mongoose");

const reparationSchema = new mongoose.Schema({
    rendezVousId: { type: mongoose.Schema.Types.ObjectId, ref: "RendezVous", required: true },
    mecanicienId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    voiture: {
        marque: { type: String, required: true },
        modele: { type: String, required: true },
        annee: { type: Number, required: true },
        immatriculation: { type: String, required: true }
    },
    piecesRemplacees: [
        {
            nom: { type: String, required: true },
            prix: { type: Number, required: true }
        }
    ],
    statut: { type: String, enum: ["en cours", "terminé"], default: "en cours" },
    commentaire: { type: String },
    factureTotale: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Reparation", reparationSchema);