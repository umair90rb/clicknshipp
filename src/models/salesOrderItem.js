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
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
