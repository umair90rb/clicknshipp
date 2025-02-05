'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StockLevels', 'item_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StockLevels', 'item_type', {
      type: Sequelize.ENUM('raw_material', 'finished_product'),
      allowNull: true,
    });
  },
};
