"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class DeliveryServiceAccounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DeliveryServiceAccounts.init(
    {
      service: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      key: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "DeliveryServiceAccounts",
    }
  );
  return DeliveryServiceAccounts;
};
