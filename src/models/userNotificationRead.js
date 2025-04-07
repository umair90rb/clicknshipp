import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class UserNotificationRead extends Model {
    static associate(models) {
      UserNotificationRead.belongsTo(models.Notification, {
        foreignKey: 'notification_id',
        as: 'notification',
      });
      UserNotificationRead.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  UserNotificationRead.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notification_id: {
        type: DataTypes.INTEGER,
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
      modelName: 'UserNotificationRead',
      tableName: 'UserNotificationRead',
      timestamps: false,
      underscored: true,
    }
  );

  return UserNotificationRead;
};
