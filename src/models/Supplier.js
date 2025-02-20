'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      Supplier.hasMany(models.Item, {
        foreignKey: 'supplier_id',
        as: 'items',
      });
      Supplier.hasMany(models.RawMaterial, {
        foreignKey: 'supplier_id',
        as: 'materials',
      });
    }
  }
  Supplier.init(
    {
      name: DataTypes.STRING,
      account_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Supplier',
      timestamps: true,
      scopes: {
        clean: {
          attributes: {
            exclude: ['updatedAt', 'createdAt'],
          },
        },
      },
    }
  );
  return Supplier;
};
