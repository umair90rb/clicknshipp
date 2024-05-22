import { Model } from "sequelize";
import { hash } from "../utils/hashing";
import random from "../utils/random";

const PROTECTED_ATTRIBUTES = ["password"];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: "user_id",
      });
      User.hasMany(models.OrderHistory, {
        as: "orderHistory",
        foreignKey: "user_id",
      });
      User.belongsToMany(models.Permission, {
        through: "UserPermissions",
        as: "permissions",
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: "Please enter your email address",
        },
        unique: {
          args: true,
          msg: "Email already exists",
        },
        validate: {
          isEmail: {
            args: true,
            msg: "Please enter a valid email address",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: "Please enter your phone number",
        },
        unique: {
          args: true,
          msg: "Phone number already exists",
        },
      },
      password: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("inactive", "active", "suspended"),
        defaultValue: "active",
      },
      settings: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "User",
      onDelete: "CASCADE",
      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },
      scopes: {
        clean: {
          attributes: {
            exclude: ["password", "settings", "updatedAt", "createdAt"],
          },
        },
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
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

  User.prototype.hasRole = async function hasRole(role) {
    if (!role || role === "undefined") {
      return false;
    }
    const roles = await this.getRoles();
    return !!roles.map(({ name }) => name).includes(role);
  };

  User.prototype.hasPermission = async function hasPermission(permission) {
    if (!permission || permission === "undefined") {
      return false;
    }
    const permissions = await this.getPermissions();
    return !!permissions.map(({ name }) => name).includes(permission.name);
  };

  User.prototype.hasPermissionThroughRole =
    async function hasPermissionThroughRole(permission) {
      if (!permission || permission === "undefined") {
        return false;
      }
      const roles = await this.getRoles();
      // eslint-disable-next-line no-restricted-syntax
      for await (const item of permission.roles) {
        if (roles.filter((role) => role.name === item.name).length > 0) {
          return true;
        }
      }
      return false;
    };

  User.prototype.hasPermissionTo = async function hasPermissionTo(permission) {
    if (!permission || permission === "undefined") {
      return false;
    }
    return (
      (await this.hasPermissionThroughRole(permission)) ||
      this.hasPermission(permission)
    );
  };

  return User;
};
