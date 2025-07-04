const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");

// GET all clubs
router.get("/", clubController.getAllClubs);

// POST new club
router.post("/createClub", clubController.createClub);

router.get("/getstudents", clubController.getAllStudents);

router.get("/getfaculties", clubController.getAllFaculties);

module.exports = router;
