let tokens = {};

function addToken(userId, accessToken, refreshToken) {
  if (!tokens[userId]) {
    tokens[userId] = { accessToken, refreshToken };
  }
}

function getAllTokens(userId) {
  return tokens[userId] || {};
}

module.exports = { addToken, getAllTokens };
