import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

interface TweetTagModel
  extends Model<
    InferAttributes<TweetTagModel>,
    InferCreationAttributes<TweetTagModel>
  > {
  tweetId: string;
  tag: string;
}

const createModel = (sequelize: Sequelize) => {
  const TweetTag = sequelize.define<TweetTagModel>(
    "TweetTag",
    {
      tweetId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  return TweetTag;
};

export default createModel;
