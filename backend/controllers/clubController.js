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

try {
  let presidentPassword;
  let coordinatorPassword;

  // --- 1. Check student password ---
  const studentRes = await pool.query(
    `SELECT password FROM student WHERE regno = $1`,
    [president]
  );
  const existingStudentPassword = studentRes.rows[0]?.password;

  if (existingStudentPassword) {
    presidentPassword = existingStudentPassword;
    await pool.query(
      `UPDATE student SET role = array_append(role, 'president') WHERE regno = $1`,
      [president]
    );
  } else {
    presidentPassword = generateRandomPassword();
    await pool.query(
      `UPDATE student SET role = array_append(role, 'president'), password = $1 WHERE regno = $2`,
      [presidentPassword, president]
    );
  }

  // --- 2. Check faculty password ---
  const facultyRes = await pool.query(
    `SELECT password FROM faculty WHERE empid = $1`,
    [faculty_coordinator]
  );
  const existingFacultyPassword = facultyRes.rows[0]?.password;

  if (existingFacultyPassword) {
    coordinatorPassword = existingFacultyPassword;
    await pool.query(
      `UPDATE faculty SET role = array_append(role, 'coordinator') WHERE empid = $1`,
      [faculty_coordinator]
    );
  } else {
    coordinatorPassword = generateRandomPassword();
    await pool.query(
      `UPDATE faculty SET role = array_append(role, 'coordinator'), password = $1 WHERE empid = $2`,
      [coordinatorPassword, faculty_coordinator]
    );
  }

  // --- 3. Insert into club ---
  const clubResult = await pool.query(
    `INSERT INTO club (name, president_regno, faculty_coordinator_empid, description, created_on, total_members)
     VALUES ($1, $2, $3, $4, CURRENT_DATE, 0) RETURNING *`,
    [name, president, faculty_coordinator, description]
  );

  // --- 4. Return response ---
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
}

//delete a club
exports.deleteClub = async (req, res) => {
  const { clubId } = req.params;

  try {
    // 1. Get president and coordinator from the club
    const clubResult = await pool.query(
      `SELECT president_regno, faculty_coordinator_empid FROM club WHERE club_id = $1`,
      [clubId]
    );

    if (clubResult.rows.length === 0) {
      return res.status(404).json({ error: "Club not found" });
    }

    const { president_regno, faculty_coordinator_empid } = clubResult.rows[0];

    // 2. Delete the club
    await pool.query(`DELETE FROM club WHERE club_id = $1`, [clubId]);

    // 3. Remove ONE 'coordinator' from faculty
    await pool.query(
      `UPDATE faculty SET role = (
        SELECT ARRAY_AGG(val) FROM (
          SELECT val FROM (
            SELECT val, ordinality,
                   ROW_NUMBER() OVER (PARTITION BY val ORDER BY ordinality) as rn
            FROM unnest(role) WITH ORDINALITY AS u(val, ordinality)
          ) sub
          WHERE NOT (val = 'coordinator' AND rn = 1)
        ) filtered
      ) WHERE empid = $1`,
      [faculty_coordinator_empid]
    );

    // 4. Remove ONE 'president' from student
    await pool.query(
      `UPDATE student SET role = (
        SELECT ARRAY_AGG(val) FROM (
          SELECT val FROM (
            SELECT val, ordinality,
                   ROW_NUMBER() OVER (PARTITION BY val ORDER BY ordinality) as rn
            FROM unnest(role) WITH ORDINALITY AS u(val, ordinality)
          ) sub
          WHERE NOT (val = 'president' AND rn = 1)
        ) filtered
      ) WHERE regno = $1`,
      [president_regno]
    );

    // 5. Remove ONE 'member' from student
    await pool.query(
      `UPDATE student SET role = (
        SELECT ARRAY_AGG(val) FROM (
          SELECT val FROM (
            SELECT val, ordinality,
                   ROW_NUMBER() OVER (PARTITION BY val ORDER BY ordinality) as rn
            FROM unnest(role) WITH ORDINALITY AS u(val, ordinality)
          ) sub
          WHERE NOT (val = 'member' AND rn = 1)
        ) filtered
      ) WHERE regno = $1`,
      [president_regno]
    );

    // 6. Check if role array is empty or only has 'member' → nullify password
    const roleCheck = await pool.query(
      `SELECT role FROM student WHERE regno = $1`,
      [president_regno]
    );

    const roles = roleCheck.rows[0]?.role || [];
    const shouldClearPassword =
      roles.length === 0 || roles.every((r) => r === "member");

    if (shouldClearPassword) {
      await pool.query(`UPDATE student SET password = NULL WHERE regno = $1`, [
        president_regno,
      ]);
    }

    res.status(200).json({ message: "Club deleted successfully" });
  } catch (err) {
    console.error("Error deleting club:", err);
    res.status(500).json({ error: err.message });
  }
};

// getting particular club info
exports.getParticularClub = async (req, res) => {
  const { clubId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT c.*, s.name AS president_name, f.name AS coordinator_name
       FROM club c
       LEFT JOIN student s ON c.president_regno = s.regno
       LEFT JOIN faculty f ON c.faculty_coordinator_empid = f.empid
       WHERE c.club_id = $1`,
      [clubId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Club not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching club:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getClubMembers = async (req, res) => {
  const { clubId } = req.params;

  try {
    const result = await pool.query(
      `SELECT cm.regno, cm.joined_on, s.name 
       FROM club_member cm
       JOIN student s ON cm.regno = s.regno
       WHERE cm.club_id = $1`,
      [clubId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching club members:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.addMember = async (req, res) => {
  const { regno, club_id } = req.body;

  try {
    // 1. Insert into club_member
    await pool.query(
      `INSERT INTO club_member (club_id, regno, joined_on, role)
       VALUES ($1, $2, CURRENT_DATE, 'member')`,
      [club_id, regno]
    );

    // 2. Increment total_members in club table
    await pool.query(
      `UPDATE club SET total_members = total_members + 1 WHERE club_id = $1`,
      [club_id]
    );

    // 3. Add "member" role to student
    await pool.query(
      `UPDATE student
       SET role = array_append(role, 'member')
       WHERE regno = $1`,
      [regno]
    );

    res.status(200).json({ message: "Member added successfully" });
  } catch (err) {
    console.error("Error adding member:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  const { regno, club_id } = req.body;

  try {
    // 1. Delete from club_member table
    await pool.query(
      `DELETE FROM club_member WHERE regno = $1 AND club_id = $2`,
      [regno, club_id]
    );

    // 2. Remove one "member" from student role array
    await pool.query(
      `UPDATE student SET role = (
        SELECT ARRAY(
          SELECT val FROM (
            SELECT unnest(role) AS val, ordinality
            FROM unnest(role) WITH ORDINALITY
          ) sub
          WHERE NOT (
            val = 'member' AND ordinality = (
              SELECT MIN(ordinality)
              FROM unnest(role) WITH ORDINALITY
              WHERE unnest = 'member'
            )
          )
        )
      ) WHERE regno = $1`,
      [regno]
    );

    // 3. Decrement total_members in club table
    await pool.query(
      `UPDATE club SET total_members = total_members - 1 WHERE club_id = $1`,
      [club_id]
    );

    res.status(200).json({ message: "Member removed successfully" });
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.editClub = async (req, res) => {
  const { club_id, newPresident, newCoordinator, newDescription } = req.body;

  try {
    // Get old values from DB
    const oldData = await pool.query(
      `SELECT president_regno, faculty_coordinator_empid FROM club WHERE club_id = $1`,
      [club_id]
    );

    if (oldData.rows.length === 0)
      return res.status(404).json({ error: "Club not found" });

    const {
      president_regno: oldPresident,
      faculty_coordinator_empid: oldCoordinator,
    } = oldData.rows[0];

    // --- 1. Update club table ---
    await pool.query(
      `UPDATE club SET president_regno = $1, faculty_coordinator_empid = $2, description = $3 WHERE club_id = $4`,
      [newPresident, newCoordinator, newDescription, club_id]
    );

    // --- 2. Faculty Role Update ---
    // Add coordinator to new
    await pool.query(
      `UPDATE faculty SET role = array_append(role, 'coordinator') WHERE empid = $1`,
      [newCoordinator]
    );

    // Remove one 'coordinator' from old
    await pool.query(
      `UPDATE faculty SET role = (
        SELECT ARRAY(
          SELECT val FROM (
            SELECT unnest(role) AS val, ordinality
            FROM unnest(role) WITH ORDINALITY
          ) sub
          WHERE NOT (
            val = 'coordinator' AND ordinality = (
              SELECT MIN(ordinality)
              FROM unnest(role) WITH ORDINALITY
              WHERE unnest = 'coordinator'
            )
          )
        )
      ) WHERE empid = $1`,
      [oldCoordinator]
    );

    // --- 3. Student Role Update ---
    // Add president to new
    await pool.query(
      `UPDATE student SET role = array_append(role, 'president') WHERE regno = $1`,
      [newPresident]
    );

    // Remove one 'president' from old
    await pool.query(
      `UPDATE student SET role = (
        SELECT ARRAY(
          SELECT val FROM (
            SELECT unnest(role) AS val, ordinality
            FROM unnest(role) WITH ORDINALITY
          ) sub
          WHERE NOT (
            val = 'president' AND ordinality = (
              SELECT MIN(ordinality)
              FROM unnest(role) WITH ORDINALITY
              WHERE unnest = 'president'
            )
          )
        )
      ) WHERE regno = $1`,
      [oldPresident]
    );

    // --- 4. Handle Passwords ---
    let generatedPasswords = {};

    // President password
    const studentCheck = await pool.query(
      `SELECT password FROM student WHERE regno = $1`,
      [newPresident]
    );
    if (!studentCheck.rows[0]?.password) {
      const newPass = generateRandomPassword();
      await pool.query(`UPDATE student SET password = $1 WHERE regno = $2`, [
        newPass,
        newPresident,
      ]);
      generatedPasswords.president = newPass;
    }

    // Coordinator password
    const facultyCheck = await pool.query(
      `SELECT password FROM faculty WHERE empid = $1`,
      [newCoordinator]
    );
    if (!facultyCheck.rows[0]?.password) {
      const newPass = generateRandomPassword();
      await pool.query(`UPDATE faculty SET password = $1 WHERE empid = $2`, [
        newPass,
        newCoordinator,
      ]);
      generatedPasswords.coordinator = newPass;
    }

    res.status(200).json({
      message: "Club updated successfully",
      passwords: generatedPasswords,
    });
  } catch (err) {
    console.error("Error updating club:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getClubsByPresident = async (req, res) => {
  const { regno } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM club WHERE president_regno = $1`,
      [regno]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET clubs where empid is the faculty_coordinator
exports.getClubsForCoordinator = async (req, res) => {
  const { empid } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM club WHERE faculty_coordinator_empid = $1`,
      [empid]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching coordinator clubs:", err);
    res.status(500).json({ error: err.message });
  }
};





