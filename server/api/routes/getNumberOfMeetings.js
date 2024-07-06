const express = require("express");
const router = express.Router();

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

router.get("/", tokenVerification, async (req, res) => {
  try {
    const userId = req.user.id;
    const getMeetingRequestsQuery = `
            SELECT * FROM meetings WHERE Host = ?
        `;
    const [rows] = await db.pool
      .promise()
      .execute(getMeetingRequestsQuery, [userId]);

    const num = rows.length;

    console.log("rows: ", rows);
    console.log("num: ", num);

    res.status(200).json({
      status: "success",
      data: rows,
      numberOfMeetings: num,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
