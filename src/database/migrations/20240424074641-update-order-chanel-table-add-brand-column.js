"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Orders", "brand_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Brands",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "NO ACTION",
    });
    await queryInterface.addColumn("Chanels", "brand_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Brands",
        key: "id",
      },
      onUpdate: "NO ACTION",
      onDelete: "NO ACTION",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Orders", "brand_id");
    await queryInterface.removeColumn("Chanels", "brand_id");
  },
};
