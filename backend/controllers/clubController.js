const pool = require("../db");

// Get all clubs
exports.getAllClubs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.club_id,
        c.name,
        c.description,
        c.created_on,
        c.total_members,
        s.name AS president_name,
        f.name AS coordinator_name
      FROM club c
      LEFT JOIN student s ON c.president_regno = s.regno
      LEFT JOIN faculty f ON c.faculty_coordinator_empid = f.empid
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all student
exports.getAllStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM student");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all faculty
exports.getAllFaculties = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM faculty");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function generateRandomPassword(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}


// Create a new club
exports.createClub = async (req, res) => {
  const { name, president, faculty_coordinator, description } = req.body;

  // Generate random passwords
  const presidentPassword = generateRandomPassword();
  const coordinatorPassword = generateRandomPassword();

  try {
    // Insert into club table
    const clubResult = await pool.query(
      `INSERT INTO club (name, president_regno, faculty_coordinator_empid, description, created_on, total_members)
       VALUES ($1, $2, $3, $4, CURRENT_DATE, 1) RETURNING *`,
      [name, president, faculty_coordinator, description]
    );

    // Update student table - assign role and password to president
    await pool.query(
      `UPDATE student SET role = array_append(role, 'president'), password = $1 WHERE regno = $2`,
      [presidentPassword, president]
    );

    // Update faculty table - assign role and password to coordinator
    await pool.query(
      `UPDATE faculty SET role = array_append(role, 'coordinator'), password = $1 WHERE empid = $2`,
      [coordinatorPassword, faculty_coordinator]
    );

    // Send both generated passwords back to frontend
    res.status(201).json({
      club: clubResult.rows[0],
      passwords: {
        president: presidentPassword,
        coordinator: coordinatorPassword,
      },
    });
  } catch (err) {
    console.error("Error in createClub:", err);
    res.status(500).json({ error: err.message });
  }
};
