"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      grams: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      product_id: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      total_discount: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("OrderItems");
  },
};
