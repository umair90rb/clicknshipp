'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class BOMItem extends Model {
    static associate(models) {
      BOMItem.belongsTo(models.BOM, {
        foreignKey: 'bom_id',
        as: 'bom',
        onDelete: 'CASCADE',
      });

      BOMItem.belongsTo(models.RawMaterial, {
        foreignKey: 'raw_material_id',
        as: 'raw',
        onDelete: 'CASCADE',
      });
    }
  }

  BOMItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      raw_material_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unit_of_measure: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      material_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'BOMItem',
      tableName: 'BillOfMaterialItems',
      timestamps: true,
    }
  );

  return BOMItem;
};
