import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

interface TweetModel
  extends Model<
    InferAttributes<TweetModel>,
    InferCreationAttributes<TweetModel>
  > {
  id: string;
  body: string;
  userId: string;
  tweetCreatedAt: string;
}

const createModel = (sequelize: Sequelize) => {
  const Tweet = sequelize.define<TweetModel>(
    "Tweet",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tweetCreatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {}
  );
  return Tweet;
};

export default createModel;
