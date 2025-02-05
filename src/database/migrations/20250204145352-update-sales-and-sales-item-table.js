'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('SalesOrders', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('SalesOrderItems', 'item_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('SalesOrderItems', 'price', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('SalesOrders', 'name');
    await queryInterface.removeColumn('SalesOrderItems', 'item_id');
    await queryInterface.removeColumn('SalesOrderItems', 'price');
  },
};
