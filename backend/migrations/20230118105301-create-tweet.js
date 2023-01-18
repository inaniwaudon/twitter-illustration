export default {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable("Tweets", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      body: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      imageCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        references: { model: "Users", key: "id" },
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      work: { type: Sequelize.STRING },
    });
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("Work");
  },
};
