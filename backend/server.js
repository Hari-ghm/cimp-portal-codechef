const express = require("express");
const cors = require("cors");
require("dotenv").config();

const clubRoutes = require("./routes/clubRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ✅ CORS config – allow only your frontend
app.use(
  cors({
    origin: "https://hari-ghm.github.io", // ← your deployed frontend URL
    credentials: true, // optional; needed if using cookies or sessions
  })
);

app.use(express.json());

// Routes
app.use("/api/clubs", clubRoutes);
app.use("/api", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
