// No changes needed if this file is just for environment variable loading
const env = require("dotenv").config({ path: `${__dirname}/.env` });

module.exports = {
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
};
