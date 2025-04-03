const Part = require("../models/part.model");

// ✅ Récupérer toutes les pièces
exports.getAllParts = async (req, res) => {
  try {
    const parts = await Part.find();
    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ✅ Récupérer une pièce par son ID
exports.getPartById = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: "Pièce non trouvée" });
    }
    res.status(200).json(part);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ✅ Ajouter une nouvelle pièce
exports.createPart = async (req, res) => {
  try {
    const { name, reference, price, stock, category } = req.body;

    // Vérifier si la référence existe déjà
    const existingPart = await Part.findOne({ reference });
    if (existingPart) {
      return res.status(400).json({ message: "Cette référence existe déjà" });
    }

    const part = new Part({ name, reference, price, stock, category });
    await part.save();
    res.status(201).json(part);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ✅ Mettre à jour une pièce
exports.updatePart = async (req, res) => {
  try {
    const updatedPart = await Part.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPart) {
      return res.status(404).json({ message: "Pièce non trouvée" });
    }

    res.status(200).json(updatedPart);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ✅ Supprimer une pièce
exports.deletePart = async (req, res) => {
  try {
    const deletedPart = await Part.findByIdAndDelete(req.params.id);
    if (!deletedPart) {
      return res.status(404).json({ message: "Pièce non trouvée" });
    }
    res.status(200).json({ message: "Pièce supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
