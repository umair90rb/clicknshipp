"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .addColumn("Items", "category_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      })
      .then(() => {
        return queryInterface.addColumn("Items", "brand_id", {
          type: Sequelize.INTEGER,
          references: {
            model: "Brands",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        });
      })
      .then(() => {
        return queryInterface.addColumn("Items", "supplier_id", {
          type: Sequelize.INTEGER,
          references: {
            model: "Suppliers",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        });
      });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface
      .removeColumn("Items", "category_id")
      .then(() => queryInterface.removeColumn("Items", "brand_id"))
      .then(() => queryInterface.removeColumn("Items", "supplier_id"));
  },
};
