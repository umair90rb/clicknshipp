"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .addColumn("UserPermissions", "createdAt", {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      })
      .then(() =>
        queryInterface.addColumn("UserPermissions", "updatedAt", {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: true,
        })
      );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface
      .removeColumn("UserPermissions", "createdAt")
      .then(() => queryInterface.removeColumn("UserPermissions", "updatedAt"));
  },
};
