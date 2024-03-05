"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .removeColumn("CityNameMapings", "createdAt")
      .then(() => queryInterface.removeColumn("CityNameMapings", "updatedAt"));
  },

  async down(queryInterface, Sequelize) {
    return queryInterface
      .addColumn("CityNameMapings", "createdAt", {
        type: Sequelize.DATE,
        allowNull: false,
      })
      .then(() =>
        queryInterface.addColumn("CityNameMapings", "updatedAt", {
          type: Sequelize.DATE,
          allowNull: false,
        })
      );
  },
};
