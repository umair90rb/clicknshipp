'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ShopifyWebhookLogs', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      shop_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      shop_domain: {
        type: Sequelize.STRING,
        allowNull: false
      },
      topic: {
        type: Sequelize.STRING,
        allowNull: false
      },
      webhook_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      received_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'received'
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      order_id: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      retries: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ShopifyWebhookLogs');
  }
};
