import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

interface TweetCharacterModel
  extends Model<
    InferAttributes<TweetCharacterModel>,
    InferCreationAttributes<TweetCharacterModel>
  > {
  tweetId: string;
  character: string;
}

const createModel = (sequelize: Sequelize, DataTypes) => {
  const TweetCharacter = sequelize.define<TweetCharacterModel>(
    "TweetCharacter",
    {
      tweetId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      character: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );
  return TweetCharacter;
};
export default createModel;
