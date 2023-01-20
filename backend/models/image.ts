import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

interface ImageModel
  extends Model<
    InferAttributes<ImageModel>,
    InferCreationAttributes<ImageModel>
  > {
  tweetId: string;
  index: number;
  width: number;
  height: number;
}

const createModel = (sequelize: Sequelize) => {
  const Image = sequelize.define<ImageModel>(
    "Image",
    {
      tweetId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  return Image;
};

export default createModel;
