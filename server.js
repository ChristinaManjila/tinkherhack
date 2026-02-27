const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pets = require("./pets.json");

app.get("/pets", (req, res) => {
  res.json(pets);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
