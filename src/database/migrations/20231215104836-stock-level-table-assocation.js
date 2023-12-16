"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("StockLevels", "item_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Items",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("StockLevels", "item_id");
  },
};
