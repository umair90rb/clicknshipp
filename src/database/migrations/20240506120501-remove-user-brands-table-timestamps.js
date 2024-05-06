"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("UserBrands", "createdAt");
    await queryInterface.removeColumn("UserBrands", "updatedAt");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("UserBrands", "createdAt", {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("UserBrands", "updatedAt", {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },
};
