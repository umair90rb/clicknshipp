"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .addColumn("Orders", "user_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      })
      .then(() =>
        queryInterface.addColumn("Orders", "status", {
          type: Sequelize.STRING,
          defaultValue: "Received",
        })
      )
      .then(() =>
        queryInterface.addColumn("Orders", "chanel", {
          type: Sequelize.STRING,
          allowNull: true,
        })
      );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface
      .removeColumn("Orders", "user_id")
      .then(() => queryInterface.removeColumn("Orders", "status"))
      .then(() => queryInterface.removeColumn("Orders", "chanel"));
  },
};
