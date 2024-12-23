'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BOMMaterialQuantityUpdateReasons', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bom_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'BillOfMaterials',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      bom_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'BillOfMaterialItems',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      requested_quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BOMMaterialQuantityUpdateReasons');
  },
};
