const express = require("express");
const cors = require("cors");
const matchRoutes = require("./routes/matchRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", matchRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on http://localhost:5000");
});