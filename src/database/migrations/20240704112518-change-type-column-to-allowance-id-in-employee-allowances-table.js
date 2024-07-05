"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("EmployeeAllowances", "type");
    await queryInterface.addColumn("EmployeeAllowances", "allowance_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("EmployeeAllowances", "type", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn("EmployeeAllowances", "allowance_id");
  },
};
