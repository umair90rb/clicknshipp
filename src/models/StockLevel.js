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
    getStockable(options) {
      if (!this.item_type) return Promise.resolve(null);
      const mixinMethodName = `get${
        this.item_type === 'finished_product' ? 'Item' : 'Raw'
      }`;
      return this[mixinMethodName](options);
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

  StockLevel.addHook('afterFind', (findResult) => {
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

  return StockLevel;
};
