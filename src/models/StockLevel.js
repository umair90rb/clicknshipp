'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class StockLevel extends Model {
    static associate(models) {
      StockLevel.belongsTo(models.Item, {
        as: 'item',
        foreignKey: 'item_id',
      });
      StockLevel.hasMany(models.StockHistory, {
        as: 'history',
        foreignKey: 'stock_id',
      });
      StockLevel.belongsTo(models.Location, {
        foreignKey: 'location_id',
        as: 'Location',
      });
      // StockLevel.belongsTo(models.RawMaterial, {
      //   foreignKey: 'item_id',
      //   constraints: false,
      //   as: 'RawMaterial'
      // });
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
        type: DataTypes.ENUM('raw_material', 'finished_product'),
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
