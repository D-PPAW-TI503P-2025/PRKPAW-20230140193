'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('SensorLogs', 'motion', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('SensorLogs', 'motion');
  }
};