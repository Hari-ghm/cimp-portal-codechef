const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");

// GET all clubs
router.get("/", clubController.getAllClubs);

// POST new club
router.post("/create", clubController.createClub);

module.exports = router;
