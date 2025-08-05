'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'ShopifyWebhookLogs',
      'webhook_id',
      'webhook_id_old'
    );
    await queryInterface.addColumn('ShopifyWebhookLogs', 'webhook_id', {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    await queryInterface.removeColumn('ShopifyWebhookLogs', 'webhook_id_old');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('ShopifyWebhookLogs', 'webhook_id_old', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
    await queryInterface.removeColumn('ShopifyWebhookLogs', 'webhook_id');
    await queryInterface.renameColumn(
      'ShopifyWebhookLogs',
      'webhook_id_old',
      'webhook_id'
    );
  },
};
