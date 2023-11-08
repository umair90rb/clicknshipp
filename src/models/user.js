import { Model } from "sequelize";
import { hash } from "../utils/hashing";
import random from "../utils/random";

const PROTECTED_ATTRIBUTES = ["password"];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toJSON() {
      const attributes = [...this.get()];
      for (let p of PROTECTED_ATTRIBUTES) {
        delete attributes[p];
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
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.STRING,
      last_login_at: DataTypes.DATE,
      last_ip_address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.prototype.newToken = async function newToken(device_name = "Web FE") {
    const plainTextToken = random(40);

    const token = await this.createToken({
      name: device_name,
      token: hash(plainTextToken),
    });

    return {
      accessToken: token,
      plainTextToken: `${token.id}|${plainTextToken}`,
    };
  };

  return User;
};
