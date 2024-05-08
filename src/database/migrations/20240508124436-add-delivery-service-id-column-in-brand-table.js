"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Brands", "deliver_service_account_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "DeliveryServiceAccounts",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Brands", "deliver_service_account_id");
  },
};
