/* eslint-disable no-undef */
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { matricule,firstName, lastName, email, password, phone, address, role, typeMecanicien } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    const user = new User({ matricule,firstName, lastName, email, password, phone, address, role, typeMecanicien });
    await user.save();

    // Générer le token après enregistrement
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.status(201).json({
      message: 'Inscription réussie et connexion automatique',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // eslint-disable-next-line no-undef
    const token = jwt.sign({ id: user._id, role: user.role, name: user.firstName }, process.env.JWT_SECRET, { expiresIn: '3h' });

    res.status(200).json({
      message: 'Connexion réussie',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { registerUser, loginUser };