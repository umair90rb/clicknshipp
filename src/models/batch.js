'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    static associate(models) {}
  }

  Batch.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      item_type: {
        type: DataTypes.ENUM('raw_material', 'finished_product'),
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      batch_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      production_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      unit_of_measure: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Batch',
      tableName: 'Batches',
      timestamps: false,
      underscored: true,
    }
  );
  return Batch;
};
