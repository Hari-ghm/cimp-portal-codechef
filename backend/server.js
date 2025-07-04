const express = require("express");
const cors = require("cors");
require("dotenv").config();

const clubRoutes = require("./routes/clubRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/clubs", clubRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

