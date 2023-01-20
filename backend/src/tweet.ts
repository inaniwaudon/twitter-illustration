import dotenv from "dotenv";
import fs from "fs";
import { Client } from "twitter-api-sdk";
import { Error404, Error500 } from "./error";
import db from "../models/index";

dotenv.config();
const client = new Client(process.env.TWITTER_BEARER_TOKEN);

export const addTweet = async (id: string) => {
  // get a tweet
  let tweet;
  try {
    tweet = await client.tweets.findTweetById(id, {
      expansions: ["attachments.media_keys", "author_id"],
      "media.fields": ["url", "width", "height"],
      "tweet.fields": ["created_at"],
      "user.fields": ["id", "name", "username"],
    });
  } catch (e) {
    throw new Error404("Cannot get a tweet.");
  }
  if (tweet.includes.users === 0) {
    throw new Error500("No user exists.");
  }

  const user = tweet.includes.users[0];
  const images = tweet.includes.media.filter(
    (medium) => medium.type === "photo"
  );

  // insert or update a user
  db.user.upsert({
    id: user.id,
    screenName: user.username,
    name: user.name,
  });

  // insert a user
  db.tweet.upsert({
    id: tweet.data.id,
    body: tweet.data.text,
    userId: user.id,
    tweetCreatedAt: tweet.data.created_at,
  });

  // upload images
  const image_objs: {
    tweetId: string;
    index: number;
    width: number;
    height: number;
  }[] = [];

  for (let i = 0; i < images.length; i++) {
    const response = await fetch(images[i].url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(`./images/${tweet.data.id}_${i}.jpeg`, buffer);

    image_objs.push({
      tweetId: tweet.data.id,
      index: i,
      width: images[i].width,
      height: images[i].height,
    });
  }
  db.image.bulkCreate(image_objs, {
    ignoreDuplicates: true,
  });
};
