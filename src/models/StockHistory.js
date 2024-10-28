'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    static associate(models) {
      // StockHistory.belongsTo(models.RawMaterial, {
      //   foreignKey: 'item_id',
      //   constraints: false,
      // });
      StockHistory.belongsTo(models.Location, {
        foreignKey: 'location_id',
        as: 'location',
      });
      // StockHistory.belongsTo(models.GatePasses, {
      //   foreignKey: 'gate_pass_id',
      //   as: 'gatePass',
      // });
      StockHistory.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  StockHistory.init(
    {
      item_type: {
        type: DataTypes.ENUM('raw_material', 'finished_product'),
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      movement_type: {
        type: DataTypes.ENUM('in', 'out'),
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
      gate_pass_id: {
        type: DataTypes.INTEGER,
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
