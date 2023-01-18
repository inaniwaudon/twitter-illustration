import process from "process";
import { DataTypes, Sequelize } from "sequelize";
import tweet from "./tweet";
import tweetCharacter from "./tweetCharacter";
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
  tweet: tweet(sequelize, DataTypes),
  tweetCharacter: tweetCharacter(sequelize, DataTypes),
  user: user(sequelize, DataTypes),
  sequelize,
  Sequelize,
};

db.tweet.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});

export default db;
