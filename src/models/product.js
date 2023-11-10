module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("products", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    inventory: DataTypes.STRING,
    image: DataTypes.STRING,
  });
  return Product;
};
