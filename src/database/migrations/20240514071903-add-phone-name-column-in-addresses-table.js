"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Addresses", "phone", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Addresses", "name", {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Addresses", "phone");
    await queryInterface.removeColumn("Addresses", "name");
  },
};
