"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .addColumn("StockHistories", "item_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "Items",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
      .then(() => {
        return queryInterface.addColumn("StockHistories", "stock_id", {
          type: Sequelize.INTEGER,
          references: {
            model: "StockLevels",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        });
      });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface
      .removeColumn("StockHistories", "item_id")
      .then(() => queryInterface.removeColumn("StockHistories", "stock_id"));
  },
};
