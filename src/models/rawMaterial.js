import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class RawMaterial extends Model {
    static associate(models) {}
  }

  RawMaterial.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cost_price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      unit_of_measure: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RawMaterial',
      tableName: 'RawMaterials',
      timestamps: true,
    }
  );

  return RawMaterial;
};
