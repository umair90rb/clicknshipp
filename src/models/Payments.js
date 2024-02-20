"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payments.belongsTo(models.Order, {
        as: "payments",
        foreignKey: "order_id",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      });
    }
  }
  Payments.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      sequelize,
      modelName: "Payments",
    }
  );
  return Payments;
};
