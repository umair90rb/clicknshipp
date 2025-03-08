'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class BOM extends Model {
    static associate(models) {
      BOM.hasMany(models.BOMItem, {
        foreignKey: 'bom_id',
        as: 'materials',
        onDelete: 'CASCADE',
      });

      BOM.belongsTo(models.Item, {
        foreignKey: 'product_id',
        as: 'item',
        onDelete: 'CASCADE',
      });
      BOM.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      });
    }
  }

  BOM.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unit_of_measure: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'BOM',
      tableName: 'BillOfMaterials',
      timestamps: true,
    }
  );

  return BOM;
};
