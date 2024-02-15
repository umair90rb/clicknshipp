"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("Addresses", "order_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Orders",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Addresses", "order_id");
  },
};
