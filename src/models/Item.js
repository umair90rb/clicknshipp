'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.Supplier, {
        foreignKey: 'supplier_id',
        as: 'supplier',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Item.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Item.belongsTo(models.Brand, {
        foreignKey: 'brand_id',
        as: 'brand',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Item.hasOne(models.StockLevel, {
        foreignKey: { name: 'item_id', allowNull: false },
        as: 'stock',
        scope: {
          item_type: 'finished_product',
        },
        constraints: false,
      });
      Item.hasMany(models.StockHistory, {
        as: 'stock_history',
        foreignKey: 'item_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        constraints: false,
      });
      Item.hasOne(models.OrderItem, {
        as: 'OrderItems',
        foreignKey: 'product_id',
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
        constraints: false,
      });
    }
  }
  Item.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
      createdAt: { type: DataTypes.DATE, field: 'createdAt' },
      updatedAt: { type: DataTypes.DATE, field: 'updatedAt' },
      supplier_id: { type: DataTypes.INTEGER },
      category_id: { type: DataTypes.INTEGER },
      brand_id: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: 'Item',
      tableName: 'Items',
      timestamps: true,
      underscored: true,
      scopes: {
        clean: {
          attributes: {
            include: ['id', 'name', 'code', ['unit_price', 'price']],
          },
        },
      },
    }
  );
  return Item;
};
