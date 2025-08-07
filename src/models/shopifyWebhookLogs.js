'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class ShopifyWebhookLog extends Model {
    static associate(models) {
      // Optional: associate with Shop model
      // ShopifyWebhookLog.belongsTo(models.Shop, { foreignKey: 'shop_id' });
    }
  }

  ShopifyWebhookLog.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      shop_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      shop_domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      webhook_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      received_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      processed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'received',
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      payload: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      retries: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'ShopifyWebhookLog',
      tableName: 'ShopifyWebhookLogs',
      underscored: true,
      timestamps: false,
    }
  );

  return ShopifyWebhookLog;
};
