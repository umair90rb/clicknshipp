"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        as: "items",
        foreignKey: "order_id",
      });
    }
  }
  OrderItem.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      grams: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      product_id: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      total_discount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      createdAt: { type: DataTypes.DATE, field: "created_at" },
      updatedAt: { type: DataTypes.DATE, field: "updated_at" },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "OrderItems",
      timestamps: true,
      underscored: true,
    }
  );
  return OrderItem;
};
