const dbConfig = require("../config/database.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB_NAME,
  dbConfig.DB_USER,
  dbConfig.DB_PASS,
  {
    host: dbConfig.DB_HOST,
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Unable to connect to the database", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.users = require("./user")(sequelize, DataTypes);
db.Token = require("./token")(sequelize, Sequelize.DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync db Done ! ");
});

module.exports = db;
