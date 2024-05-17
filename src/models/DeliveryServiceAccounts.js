"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class DeliveryServiceAccounts extends Model {
    static associate(models) {}
  }
  DeliveryServiceAccounts.init(
    {
      name: DataTypes.STRING,
      service: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      key: DataTypes.STRING,
      client_id: DataTypes.STRING,
      halfKey: {
        type: DataTypes.VIRTUAL,
        get() {
          const key = this.key;
          const length = key.length;
          if (length) {
            return `${this.key.slice(0, 5)}******`;
          }
          return "";
        },
        set(value) {
          throw new Error("Do not try to set the `halfKey` value!");
        },
      },
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "DeliveryServiceAccounts",
    }
  );
  return DeliveryServiceAccounts;
};
