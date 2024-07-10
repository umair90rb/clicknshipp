"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "EmployeeAllowances",
      "allowance_id",
      "type"
    );
    await queryInterface.changeColumn("EmployeeAllowances", "type", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("EmployeeAllowances", "type", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.renameColumn(
      "EmployeeAllowances",
      "type",
      "allowance_id"
    );
  },
};
