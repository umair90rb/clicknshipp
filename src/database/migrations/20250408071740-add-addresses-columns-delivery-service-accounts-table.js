'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'DeliveryServiceAccounts',
      'dispatch_address',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
    await queryInterface.addColumn(
      'DeliveryServiceAccounts',
      'return_address',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'DeliveryServiceAccounts',
      'dispatch_address'
    );
    await queryInterface.removeColumn(
      'DeliveryServiceAccounts',
      'return_address'
    );
  },
};
