"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .addColumn("OrderItems", "order_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "Orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      })
      .then(() => {
        return queryInterface.addColumn("Orders", "customer_id", {
          type: Sequelize.INTEGER,
          references: {
            model: "Customers",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        });
      });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface
      .removeColumn("OrderItems", "order_id")
      .then(() => queryInterface.removeColumn("Orders", "customer_id"));
  },
};
