'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class SalesOrder extends Model {
    static associate(models) {
      SalesOrder.hasMany(models.SalesOrderItem, {
        foreignKey: 'sales_order_id',
        as: 'items',
        onDelete: 'CASCADE',
      });
    }
  }

  SalesOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SalesOrder',
      tableName: 'SalesOrders',
      timestamps: true,
    }
  );

  return SalesOrder;
};
