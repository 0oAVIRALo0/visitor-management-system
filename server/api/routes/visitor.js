const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

router.post("/", tokenVerification, async (req, res) => {
  let connection;

  try {
    const userID = req.user.id;
    const profession = req.body.profession;
    const address = req.body.address;
    const age = req.body.age;

    const insertQuery = `
      INSERT INTO Visitors (UserID, Profession, Address, Age) 
      VALUES (?, ?, ?, ?)
    `;

    const updateProfileQuery = `
      UPDATE users 
      SET ProfileUpdated = 1 
      WHERE UserID = ?
    `;

    connection = await db.pool.promise().getConnection();
    await connection.beginTransaction();

    const dbInsertResult = await connection.execute(insertQuery, [userID, profession, address, age]);

    await connection.execute(updateProfileQuery, [userID]);

    await connection.commit();

    console.log("Values Inserted:", dbInsertResult);
    res.status(200).json({
      status: "success",
      message: "Values Inserted",
    });
  } catch (error) {
    console.error("Error:", error);
    
    if (connection) {
      await connection.rollback();
    }

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
