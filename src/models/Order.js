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
      Order.belongsTo(models.Customer, {
        as: "customer",
        foreignKey: "customer_id",
      });
      Order.hasOne(models.Address, { as: "address", foreignKey: "order_id" });
      Order.hasOne(models.Delivery, { as: "delivery", foreignKey: "order_id" });
      Order.hasMany(models.OrderItem, { as: "items", foreignKey: "order_id" });
      Order.hasMany(models.Payments, {
        as: "payments",
        foreignKey: "order_id",
      });
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      });
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
      status: {
        type: DataTypes.STRING,
        defaultValue: "Received",
      },
      cancel_reason: {
        type: DataTypes.STRING,
      },
      remarks: {
        type: DataTypes.STRING,
      },
      chanel: {
        type: DataTypes.STRING,
        defaultValue: "Received",
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
