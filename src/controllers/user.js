const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../models");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const [users] = await sequelize.query(
      `SELECT * FROM users WHERE email = :email`,
      {
        replacements: { email: req.body.email },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (users > 0) {
      return res.status(409).send({ error: "User is already registered" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const insertQuery = `INSERT INTO users (username, email, password) VALUES (:name, :email, :password)`;
    const result = await sequelize.query(insertQuery, {
      replacements: {
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    const newUserId = result[0];

    const token = await generateAuthToken(
      { id: newUserId, email: req.body.email },
      true
    );
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(201)
      .send({ token });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};

const generateAuthToken = async ({ id, email }, saveToken = false) => {
  const token = jwt.sign({ id, email }, process.env.PRIVATEKEY, {
    expiresIn: "24h",
  });

  if (saveToken) {
    await sequelize.query(
      `INSERT INTO tokens (id, token) VALUES (:userId, :token)`,
      {
        replacements: {
          userId: id,
          token: token,
        },
      }
    );
  }

  return token;
};

const findByCredentials = async (email, password) => {
  const [users] = await sequelize.query(
    `SELECT * FROM users WHERE email = :email`,
    {
      replacements: { email },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  if (!users) {
    throw new Error("Wrong email");
  }
  const user = users;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Wrong password");
    error.code = 401;
    throw error;
  }
  return user;
};

exports.Authenticate = async (req, res) => {
  try {
    const user = await findByCredentials(req.body.email, req.body.password);

    const token = await generateAuthToken(
      {
        id: user.user_id,
        email: req.body.email,
      },
      true
    );
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(201)
      .send({ token });
  } catch (e) {
    res.status(e.code || 400).send({ error: e.message });
  }
};

exports.logout = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    await sequelize.query(
      "DELETE FROM tokens WHERE id = :userId AND token = :token",
      {
        replacements: { userId: req.body.user_id, token: req.token },
        transaction,
      }
    );
    await transaction.commit();

    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();

    res.status(500).send({ error: "Failed to log out" });
  }
};


exports.getConnectedUser = async (req, res) => {
  try {
    res.status(200).send({ email: req.user.email, name: req.user.name });
  } catch (e) {
    res.status(500).send();
  }
};

exports.getUsersList = async (req, res) => {
  try {
    const [users] = await sequelize.query("SELECT * FROM users", {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await sequelize.query(
      "SELECT * FROM users WHERE user_id = :id",
      {
        replacements: { id: req.params._id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ error: e });
  }
};
