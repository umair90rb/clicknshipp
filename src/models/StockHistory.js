'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    static associate(models) {
      StockHistory.belongsTo(models.Location, {
        foreignKey: 'location_id',
        as: 'location',
      });
    }
  }
  StockHistory.init(
    {
      item_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      movement_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gate_pass_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gate_pass_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'StockHistory',
      timestamps: true,
    }
  );
  return StockHistory;
};
