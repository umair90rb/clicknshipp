'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class BOMMaterialQuantityUpdateReason extends Model {
    static associate(models) {
      BOMMaterialQuantityUpdateReason.belongsTo(models.BOM, {
        foreignKey: 'bom_id',
        as: 'bom',
        onDelete: 'CASCADE',
      });

      BOMMaterialQuantityUpdateReason.belongsTo(models.BOMItem, {
        foreignKey: 'bom_item_id',
        as: 'bom_item',
        onDelete: 'CASCADE',
      });
    }
  }

  BOMMaterialQuantityUpdateReason.init(
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
      bom_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      requested_quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'BOMMaterialQuantityUpdateReason',
      tableName: 'BOMMaterialQuantityUpdateReasons',
      timestamps: false,
      underscored: true,
    }
  );

  return BOMMaterialQuantityUpdateReason;
};
