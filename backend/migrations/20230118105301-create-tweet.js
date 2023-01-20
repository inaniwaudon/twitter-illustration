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
      tweetCreatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("Work");
  },
};
