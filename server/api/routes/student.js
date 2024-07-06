// student.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

router.post("/", tokenVerification, async (req, res) => {
  try {
    const userID = req.user.id;
    const branchOfStudy = req.body.branchOfStudy;
    const yearOfStudy = req.body.yearOfStudy;
    const address = req.body.address;
    const rollNumber = req.body.rollNumber;

    const insertQuery = `
      INSERT INTO Students (UserID, BranchOfStudy, YearOfStudy, Address, rollNumber) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const updateQuery = `
      UPDATE users 
      SET ProfileUpdated = 1 
      WHERE UserID = ?
    `;

    const connection = await db.pool.promise().getConnection();
    await connection.beginTransaction();

    const dbInsertResult = await connection.execute(insertQuery, [userID, branchOfStudy, yearOfStudy, address, rollNumber]);

    await connection.execute(updateQuery, [userID]);

    await connection.commit();
    connection.release();

    console.log("Values Inserted:", dbInsertResult);
    res.status(200).json({
      status: "success",
      message: "Values Inserted",
    });
  } catch (error) {
    console.error("Error:", error);
    
    await connection.rollback();
    connection.release();

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
