"use strict";
import { Model } from "sequelize";
const PROTECTED_ATTRIBUTES = ["token"];
module.exports = (sequelize, DataTypes) => {
  class PersonalAccessToken extends Model {
    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PersonalAccessToken.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "owner",
        onDelete: "CASCADE",
      });
      models.User.hasMany(PersonalAccessToken, {
        foreignKey: "user_id",
        as: "tokens",
        onDelete: "CASCADE",
      });
    }
  }
  PersonalAccessToken.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: DataTypes.STRING,
      token: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      last_used_at: DataTypes.STRING,
      last_ip_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PersonalAccessToken",
    }
  );
  return PersonalAccessToken;
};
