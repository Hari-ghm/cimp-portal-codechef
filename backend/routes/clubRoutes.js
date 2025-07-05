const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");

// GET all clubs
router.get("/", clubController.getAllClubs);

router.post("/createClub", clubController.createClub);

router.get("/getstudents", clubController.getAllStudents);

router.get("/getfa  culties", clubController.getAllFaculties);

router.delete("/delete/:clubId", clubController.deleteClub);

router.get("/getparticularclub/:clubId", clubController.getParticularClub);

router.get("/members/:clubId", clubController.getClubMembers);

router.post("/addmember", clubController.addMember);

router.delete("/deletemember", clubController.deleteMember);

router.put("/editclub", clubController.editClub);

router.get("/presidentClubs/:regno", clubController.getClubsByPresident);

router.get("/coordinatorClubs/:empid", clubController.getClubsForCoordinator);


module.exports = router;
