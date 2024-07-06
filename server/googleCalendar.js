require("dotenv").config();
const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");
const { addToken, getAllTokens } = require("./googleCalendarTokens");

const app = express();

const PORT = 8083;

app.use(cors());
app.use(express.json());

const db = require("./database/db");

// middleware
const tokenVerification = require("./middleware/verify");

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

app.post("/auth/google", tokenVerification, async (req, res) => {
  const userId = req.user.id;
  const { tokens } = await oAuth2Client.getToken(req.body.code);
  
  const insertQuery = `
    INSERT INTO google_tokens (userId, accessToken, refreshToken)
    VALUES (?, ?, ?)
  `;

  await db.pool.promise().execute(insertQuery, [userId, tokens.access_token, tokens.refresh_token]);

  res.json(tokens);
});

app.post("/auth/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  console.log("credentials: ", credentials);
  res.json(credentials);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
