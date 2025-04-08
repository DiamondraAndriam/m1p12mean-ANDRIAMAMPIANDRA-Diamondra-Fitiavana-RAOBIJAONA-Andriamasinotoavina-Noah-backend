const mongoose = require("mongoose");

const reparationSchema = new mongoose.Schema({
    rendezVousId: { type: mongoose.Schema.Types.ObjectId, ref: "Rendezvous", required: true },
    voiture: {
        marque: { type: String, required: true },
        modele: { type: String, required: true },
        annee: { type: Number, required: true },
        immatriculation: { type: String, required: true }
    },
    piecesRemplacees: [
        {
            partId: { type: mongoose.Schema.Types.ObjectId, ref: "Part", required: true },
            quantite: { type: Number, required: true },
            prix: { type: Number, required: true }
        }
    ],
    statut: { type: String, enum: ["à faire", "terminé"], default: "à faire" },
    commentaire: { type: String },
    factureTotale: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Reparation", reparationSchema);