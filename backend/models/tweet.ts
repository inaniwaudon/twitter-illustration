import {
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
  imageCount: number;
  userId: string;
  createdAt: string;
}

const createModel = (sequelize: Sequelize, DataTypes) => {
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
      imageCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
  return Tweet;
};

export default createModel;
