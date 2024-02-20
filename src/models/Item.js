"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.Supplier, {
        foreignKey: "supplier_id",
        as: "supplier",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
      Item.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
      Item.belongsTo(models.Brand, {
        foreignKey: "brand_id",
        as: "brand",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
      Item.hasOne(models.StockLevel, {
        as: "stock",
        foreignKey: "item_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      Item.hasMany(models.StockHistory, {
        as: "stock_history",
        foreignKey: "item_id",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      Item.hasOne(models.OrderItem, {
        as: "OrderItems",
        foreignKey: "product_id",
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      });
    }
  }
  Item.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      unit_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cost_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: { type: DataTypes.DATE, field: "createdAt" },
      updatedAt: { type: DataTypes.DATE, field: "updatedAt" },
    },
    {
      sequelize,
      modelName: "Item",
      tableName: "Items",
      timestamps: true,
      underscored: true,
      scopes: {
        clean: {
          attributes: {
            include: ["id", "name", "code", ["unit_price", "price"]],
          },
        },
      },
    }
  );
  return Item;
};
