const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express(); // <--- 1. We create the "app" first

// 2. NOW we can use it!
app.use(cors());
app.use(express.json());

// Add this line here to point to your frontend folder
// Since server.js is inside 'backend', we need to go 'up' one level to find 'frontend'
app.use(express.static('../frontend')); 

const PORT = 5000;
const DATA_FILE = "./pets.json";

/* Helper function to read pets */
function readPets() {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

/* Helper function to write pets */
function writePets(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* GET all pets */
app.get("/pets", (req, res) => {
  const pets = readPets();
  res.json(pets);
});

/* GET single pet */
app.get("/pets/:id", (req, res) => {
  const pets = readPets();
  const pet = pets.find(p => p.id == req.params.id);

  if (!pet) {
    return res.status(404).json({ message: "Pet not found" });
  }

  res.json(pet);
});

/* ADD new pet */
app.post("/pets", (req, res) => {
  const pets = readPets();
  const newPet = {
    id: pets.length + 1,
    ...req.body
  };

  pets.push(newPet);
  writePets(pets);

  res.status(201).json(newPet);
});

/* UPDATE pet */
app.put("/pets/:id", (req, res) => {
  const pets = readPets();
  const index = pets.findIndex(p => p.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Pet not found" });
  }

  pets[index] = { ...pets[index], ...req.body };
  writePets(pets);

  res.json(pets[index]);
});

/* DELETE pet */
app.delete("/pets/:id", (req, res) => {
  let pets = readPets();
  const filteredPets = pets.filter(p => p.id != req.params.id);

  if (pets.length === filteredPets.length) {
    return res.status(404).json({ message: "Pet not found" });
  }

  writePets(filteredPets);
  res.json({ message: "Pet deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});