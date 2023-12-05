"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Customer);
      Order.hasMany(models.OrderItem);
    }
  }
  Order.init(
    {
      order_number: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      total_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      total_tax: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      subtotal_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      total_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      total_discounts: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: { type: DataTypes.DATE, field: "created_at" },
      updatedAt: { type: DataTypes.DATE, field: "updated_at" },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: true,
      underscored: true,
    }
  );
  return Order;
};
