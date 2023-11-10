const jwt = require("jsonwebtoken");
const sequelize = require("../models/index.js").sequelize;

const auth = async (req, res, next) => {
  try {
    const tokenHeader = req.header("Authorization");
    if (!tokenHeader) {
      throw new Error("No token provided");
    }
    const token = tokenHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.PRIVATEKEY);
    console.log(token);

    // Execute a raw SQL query to find the user by ID and verify the token exists
    const [results] = await sequelize.query(
      `SELECT u.*, t.token FROM users u INNER JOIN tokens t ON u.user_id = t.user_id WHERE (t.token = :token AND u.user_id = :userId)`,
      {
        replacements: { token: token, userId: decoded.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!results) {
      throw new Error("Not authenticated");
    }

    req.token = token;
    req.user = results;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ errorMessage: "Please authenticate." });
  }
};

module.exports = auth;
