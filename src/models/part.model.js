const mongoose = require("mongoose");

const PartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reference: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Part", PartSchema);