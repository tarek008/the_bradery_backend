const db = require("../models");
const sequelize = db.sequelize;

const getAllProducts = async () => {
  const query = `SELECT * FROM products`;
  const [products] = await sequelize.query(query);
  return products;
};

module.exports = {
  getAllProducts,
};
