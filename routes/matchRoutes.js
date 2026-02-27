const express = require("express");
const router = express.Router();
const pets = require("../pets.json");
const calculateScore = require("../utils/scoring");

router.post("/match", (req, res) => {
  const user = req.body;

  const rankedPets = pets
    .map(pet => ({
      ...pet,
      score: calculateScore(pet, user)
    }))
    .sort((a, b) => b.score - a.score);

  res.json(rankedPets.slice(0, 3));
});

router.get("/pets", (req, res) => {
  res.json(pets);
});
let favorites = [];

router.post("/favorites", (req, res) => {
  const pet = req.body;
  favorites.push(pet);
  res.json({ message: "Added to favorites", favorites });
});

router.get("/favorites", (req, res) => {
  res.json(favorites);
});

module.exports = router;
router.post("/adopt", (req, res) => {
  const { petId, userName } = req.body;

  res.json({
    message: `Adoption request received for pet ${petId}`,
    applicant: userName,
    status: "Pending Review"
  });
});