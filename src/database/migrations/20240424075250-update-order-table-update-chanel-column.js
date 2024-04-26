"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "chanel");
    await queryInterface.addColumn("Orders", "chanel_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Chanels",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "NO ACTION",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "chanel_id");
    await queryInterface.addColumn("Orders", "chanel", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
