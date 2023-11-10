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

    // Execute a raw SQL query to find the user by ID and verify the token exists
    const [results] = await sequelize.query(
      `SELECT u.*, t.token FROM users u INNER JOIN tokens t ON u.user_id = t.id WHERE (u.user_id = :userId)`,
      {
        replacements: { userId: decoded.id },
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
