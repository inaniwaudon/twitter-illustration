const createModel = (sequelize, DataTypes) => {
  const TweetTag = sequelize.define('TweetTag', {
    tweet: DataTypes.STRING,
    tag: DataTypes.STRING
  }, {});
  TweetTag.associate = function(models) {
    // associations can be defined here
  };
  return TweetTag;
};
export default createModel;