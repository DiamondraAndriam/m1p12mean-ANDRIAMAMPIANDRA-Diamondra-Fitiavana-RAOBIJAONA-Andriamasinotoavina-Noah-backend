const Reparation = require("../models/reparation.model");
const Part = require("../models/part.model");

// ✅ Mettre à jour la réparation (statut, pièces utilisées, facture)
exports.updateReparation = async (req, res) => {
  try {
    const { statut, piecesRemplacees, factureTotale } = req.body;

    // Vérification du statut s'il est fourni
    if (statut && !["à faire", "terminé"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    // Vérification des pièces s'il y en a
    if (piecesRemplacees && piecesRemplacees.length > 0) {
      for (let piece of piecesRemplacees) {
        const part = await Part.findById(piece.partId);
        if (!part) {
          return res.status(400).json({ message: `Pièce avec ID ${piece.partId} non trouvée` });
        }
      }
    }

    // Mise à jour de la réparation
    const reparation = await Reparation.findByIdAndUpdate(
      req.params.id,
      { statut, piecesRemplacees, factureTotale },
      { new: true }
    );

    if (!reparation) {
      return res.status(404).json({ message: "Réparation non trouvée" });
    }

    res.status(200).json(reparation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};