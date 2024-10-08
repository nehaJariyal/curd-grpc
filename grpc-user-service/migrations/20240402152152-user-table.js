"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      
      password: {
        type:Sequelize.STRING,
        allowNull: false,
      },
          });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
