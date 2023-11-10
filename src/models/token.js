// models/token.js
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Token;
};
