"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Deliveries", "tracking", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Deliveries", "tracking_status", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Deliveries", "tracking");
    await queryInterface.removeColumn("Deliveries", "tracking_status");
  },
};
