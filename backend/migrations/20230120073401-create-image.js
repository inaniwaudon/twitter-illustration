export default {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable(
      "Images",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        tweetId: {
          allowNull: false,
          references: { model: "Tweets", key: "id" },
          onDelete: "CASCADE",
          type: Sequelize.STRING,
        },
        index: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        width: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        height: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        uniqueKeys: {
          tweetIndexKey: {
            fields: ["tweetId", "index"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("Images");
  },
};
