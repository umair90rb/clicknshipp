'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class SalesOrderItem extends Model {
    static associate(models) {
      SalesOrderItem.belongsTo(models.SalesOrder, {
        foreignKey: 'sales_order_id',
        as: 'sales_order',
        onDelete: 'CASCADE',
      });
      SalesOrderItem.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
      });
    }
  }

  SalesOrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sales_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'SalesOrderItem',
      tableName: 'SalesOrderItems',
      timestamps: false,
    }
  );

  return SalesOrderItem;
};
