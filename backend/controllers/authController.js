const pool = require("../db");

exports.login = async (req, res) => {
  const { userid, password, role } = req.body;

  try {
    let table, idColumn;
    if (role === "admin" || role === "faculty") {
      table = "faculty";
      idColumn = "empid";
    } else if (role === "president") {
      table = "student";
      idColumn = "regno";
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
  
    let result;
  
    if (role === "admin") {
      const query = `
        SELECT * FROM ${table} 
        WHERE ${idColumn} = $1 
          AND password = $2 
          AND $3 = ANY(role)
      `;
      result = await pool.query(query, [userid, password, role]);
    } else {
      const query = `SELECT * FROM ${table} WHERE ${idColumn} = $1 AND password = $2`;
      result = await pool.query(query, [userid, password]);
    }
  
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    res.status(200).json({
      message: "Login successful",
      user: result.rows[0],
    });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
