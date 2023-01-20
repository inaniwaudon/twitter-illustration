import process from "process";
import { DataTypes, Sequelize } from "sequelize";
import image from "./image";
import tweet from "./tweet";
import tweetTag from "./tweet-tag";
import user from "./user";
import dbConfig from "../config/config.json";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]!, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const db = {
  image: image(sequelize),
  tweet: tweet(sequelize),
  tweetTag: tweetTag(sequelize),
  user: user(sequelize),
  sequelize,
  Sequelize,
};

// relation
db.tweet.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.tweet.hasMany(db.image, {
  foreignKey: "tweetId",
});
db.tweetTag.belongsTo(db.tweet, {
  foreignKey: "tweetId",
  targetKey: "id",
});

export default db;
