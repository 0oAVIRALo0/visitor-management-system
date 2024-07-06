const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
const { addToken, getAllTokens } = require("../../googleCalendarTokens");
const { google } = require("googleapis");
const moment = require("moment-timezone");

router.use(cookieParser());

const db = require("../../database/db");

// Middleware
const tokenVerification = require("../../middleware/verify");

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

router.post("/", tokenVerification, async (req, res) => {
  try {
    const hostID = req.user.id;
    const hostName = req.user.name;
    const status = req.body.status;
    const meetingDate = req.body.date;
    const meetingTime = req.body.time;
    const meetingLocation = req.body.location;
    const meetingDescription = req.body.meetingDescription;
    const attendantID = req.body.attendantID;
    const attendantName = req.body.attendantName;
    const meetingId = req.body.meetingId;
    const getEmailQuery = `SELECT Email FROM Users WHERE UserID = ?`;

    const [rows] = await db.pool
      .promise()
      .execute(getEmailQuery, [attendantID]);
    console.log("rows: ", rows);

    const tokensQuery = `SELECT accessToken, refreshToken FROM google_tokens WHERE userId = ?`;

    const [tokensRows] = await db.pool.promise().execute(tokensQuery, [hostID]);
    console.log("tokens: ", tokensRows);
    const accessToken = tokensRows[0].accessToken;
    const refreshToken = tokensRows[0].refreshToken;

    const insertQuery = `
            INSERT INTO Meetings (Host, Attendant, Status, MeetingDate, MeetingTime, MeetingLocation, MeetingDescription, AttendantName, HostName)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const dbInsertResult = await db.pool
      .promise()
      .execute(insertQuery, [
        hostID,
        attendantID,
        status,
        meetingDate,
        meetingTime,
        meetingLocation,
        meetingDescription,
        attendantName,
        hostName,
      ]);

    const deleteMeetingRequestQuery = `DELETE FROM meetingRequests WHERE id = ?`;
    const dbDeleteResult = await db.pool
      .promise()
      .execute(deleteMeetingRequestQuery, [meetingId]);

    console.log("Meeting Created:", dbInsertResult);
    // console.log("Meeting Request Deleted:", dbDeleteResult);

    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const startTime = moment.tz(
      `${meetingDate}T${meetingTime}`,
      "Asia/Kolkata"
    );
    const endTime = moment(startTime).add(1, "hours");

    const event = {
      summary: "IP Meeting for Visitor Management System",
      location: meetingLocation,
      description: meetingDescription,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      attendees: [{ email: rows[0].Email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    calendar.events.insert(
      {
        auth: oAuth2Client,
        calendarId: "primary",
        resource: event,
      },
      (err, event) => {
        if (err) {
          console.error("Error:", err);
          return;
        }
        console.log("Event created: %s", event.data.htmlLink);
      }
    );

    res.status(200).json({
      status: "success",
      message: "Meeting Created",
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
