'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Batches', 'production_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('Batches', 'batch_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Batches', 'production_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('Batches', 'batch_number', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
  },
};
