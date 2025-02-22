'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StockHistories', 'movement_type', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StockHistories', 'movement_type', {
      type: Sequelize.ENUM('in', 'out'),
      allowNull: false,
    });
  },
};
