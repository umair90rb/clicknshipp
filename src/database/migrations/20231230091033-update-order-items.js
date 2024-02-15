"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .changeColumn("OrderItems", "order_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "Orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
      .then(() => {
        return queryInterface.changeColumn("Orders", "customer_id", {
          type: Sequelize.INTEGER,
          references: {
            model: "Customers",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
        });
      });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
