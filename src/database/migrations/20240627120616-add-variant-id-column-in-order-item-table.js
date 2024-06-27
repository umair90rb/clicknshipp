"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("OrderItems", "variant_id", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("OrderItems", "variant_id");
  },
};
