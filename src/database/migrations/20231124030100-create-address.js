"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("Addresses", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        address1: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        address2: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        zip: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        province: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        country: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        company: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        longitude: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        latitude: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        country_code: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        province_code: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      })
      .then(() =>
        queryInterface.addColumn("Addresses", "customer_id", {
          type: Sequelize.INTEGER,
          references: {
            model: "Customers",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        })
      );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Addresses");
  },
};
