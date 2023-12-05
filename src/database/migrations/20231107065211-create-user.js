"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["inactive", "active", "suspended"],
      defaultValue: "inactive",
    },
    settings: Sequelize.JSON,
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Users");
}
