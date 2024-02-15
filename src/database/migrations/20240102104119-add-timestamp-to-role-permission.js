"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .addColumn("RolePermissions", "createdAt", {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      })
      .then(() =>
        queryInterface.addColumn("RolePermissions", "updatedAt", {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: true,
        })
      );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface
      .removeColumn("RolePermissions", "createdAt")
      .then(() => queryInterface.removeColumn("RolePermissions", "updatedAt"));
  },
};
