"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_number: {
        type: Sequelize.FLOAT,
      },
      total_price: {
        type: Sequelize.FLOAT,
      },
      total_tax: {
        type: Sequelize.FLOAT,
      },
      subtotal_price: {
        type: Sequelize.FLOAT,
      },
      total_price: {
        type: Sequelize.FLOAT,
      },
      total_discounts: {
        type: Sequelize.FLOAT,
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
