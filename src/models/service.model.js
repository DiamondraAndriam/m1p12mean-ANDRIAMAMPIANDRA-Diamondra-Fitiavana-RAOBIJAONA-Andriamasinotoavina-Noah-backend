const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  temps_estime: {
    type: Number, // en minutes
    required: true
  },
  date_creation: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["actif", "inactif"],
    default: "actif"
  },
  typeMecanicien: {
    type: String,
    required: true
  }
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
