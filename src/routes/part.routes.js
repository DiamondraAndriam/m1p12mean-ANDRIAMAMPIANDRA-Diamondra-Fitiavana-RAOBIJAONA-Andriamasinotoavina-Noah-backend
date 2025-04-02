const express = require("express");
const router = express.Router();
const partController = require("../controllers/part.controller");

// Routes CRUD pour les pièces
router.get("/", partController.getAllParts);
router.get("/:id", partController.getPartById);
router.post("/", partController.createPart);
router.put("/:id", partController.updatePart);
router.delete("/:id", partController.deletePart);

module.exports = router;