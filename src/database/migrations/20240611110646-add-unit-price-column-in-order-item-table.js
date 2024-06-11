"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("OrderItems", "unit_price", {
      allowNull: true,
      type: Sequelize.FLOAT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("OrderItems", "unit_price");
  },
};
