"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Emails", {
      id: {
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      to: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      text: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type:Sequelize.STRING,
        allowNull: false,
      },
          });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Emails");
  },
};
