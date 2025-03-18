'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class Metafield extends Model {
    static associate(models) {}
  }

  Metafield.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      namespace: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      owner_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      sequelize,
      tableName: 'Metafield',
    }
  );

  Metafield.addHook('afterFind', (findResult) => {
    if (!findResult) return findResult;
    if (!Array.isArray(findResult)) findResult = [findResult];
    for (const instance of findResult) {
      const type = instance.type;
      if (type === 'json') {
        instance.value = JSON.parse(instance.value);
      }
      if (type === 'integer') {
        instance.value = parseInt(instance.value);
      }
    }
  });

  return Metafield;
};
