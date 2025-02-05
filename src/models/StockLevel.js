'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class StockLevel extends Model {
    static associate(models) {
      StockLevel.belongsTo(models.Item, {
        foreignKey: 'item_id',
        constraints: false,
        as: 'item',
      });
      StockLevel.belongsTo(models.RawMaterial, {
        foreignKey: 'item_id',
        constraints: false,
        as: 'raw',
      });
      StockLevel.belongsTo(models.Location, {
        foreignKey: 'location_id',
        as: 'location',
      });
      StockLevel.hasMany(models.StockHistory, {
        foreignKey: 'item_id',
        as: 'history',
      });
    }
  }
  StockLevel.init(
    {
      current_level: {
        defaultValue: 0,
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      item_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'StockLevel',
      timestamps: true,
    }
  );
  return StockLevel;
};
