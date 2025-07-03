const pool = require("../db");

// Get all clubs
exports.getAllClubs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM club");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new club
exports.createClub = async (req, res) => {
  const { name, president, faculty_coordinator, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO club (name, president, faculty_coordinator, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, president, faculty_coordinator, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
