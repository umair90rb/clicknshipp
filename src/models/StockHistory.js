'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    static associate(models) {
      StockHistory.belongsTo(models.Location, {
        foreignKey: 'location_id',
        as: 'location',
      });
      StockHistory.belongsTo(models.Item, {
        foreignKey: 'item_id',
        constraints: false,
        as: 'item',
      });
      StockHistory.belongsTo(models.RawMaterial, {
        foreignKey: 'item_id',
        constraints: false,
        as: 'raw',
      });
    }
    getStockable(options) {
      if (!this.item_type) return Promise.resolve(null);
      const mixinMethodName = `get${
        this.item_type === 'finished_product' ? 'Item' : 'Raw'
      }`;
      return this[mixinMethodName](options);
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

  StockHistory.addHook('afterFind', (findResult) => {
    if (!findResult) return findResult;
    if (!Array.isArray(findResult)) findResult = [findResult];
    for (const instance of findResult) {
      if (
        instance.item_type === 'finished_product' &&
        instance.item !== undefined
      ) {
        instance.stockable = instance.item;
        delete instance.raw;
        delete instance.dataValues.raw;
      } else if (
        (instance.item_type === 'raw_material' ||
          instance.item_type === 'packaging_material') &&
        instance.raw !== undefined
      ) {
        instance.stockable = instance.raw;
        delete instance.item;
        delete instance.dataValues.item;
      }
    }
  });

  return StockHistory;
};
