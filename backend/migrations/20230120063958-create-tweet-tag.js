export default {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable(
      "TweetTags",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        tweetId: {
          allowNull: false,
          references: { models: "Tweets", key: "id" },
          type: Sequelize.STRING,
        },
        tag: {
          allowNull: false,
          type: Sequelize.STRING,
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
          tweetTagKey: {
            fields: ["tweetId", "tag"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable("TweetTags");
  },
};
