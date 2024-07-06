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
    const academicTitle = req.body.academicTitle;
    const department = req.body.department;
    const officeLocation = req.body.officeLocation;
    const officeHoursStart = req.body.officeHoursStart;
    const officeHoursEnd = req.body.officeHoursEnd;

    console.log("User ID:", userID);
    console.log("Academic Title:", academicTitle);
    console.log("Department:", department);
    console.log("Office Location:", officeLocation);
    console.log("Office Hours Start:", officeHoursStart);
    console.log("Office Hours End:", officeHoursEnd);

    const insertQuery = `
            INSERT INTO Faculty (UserID, AcademicTitle, Department, OfficeLocation, OfficeHoursStart, OfficeHoursEnd) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

    const updateProfileQuery = `
            UPDATE users 
            SET ProfileUpdated = 1 
            WHERE UserID = ?
        `;

    connection = await db.pool.promise().getConnection();
    await connection.beginTransaction();

    const dbInsertResult = await connection.execute(insertQuery, [
      userID,
      academicTitle,
      department,
      officeLocation,
      officeHoursStart,
      officeHoursEnd,
    ]);

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
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
