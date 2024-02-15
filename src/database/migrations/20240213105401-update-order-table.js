"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .addColumn("Orders", "remarks", {
        type: Sequelize.STRING,
      })
      .then(() =>
        queryInterface.addColumn("Orders", "cancel_reason", {
          type: Sequelize.STRING,
        })
      );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface
      .removeColumn("Orders", "remarks")
      .then(() => queryInterface.removeColumn("Orders", "cancel_reason"));
  },
};
