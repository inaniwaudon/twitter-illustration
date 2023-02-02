import dotenv from "dotenv";
import fs from "fs";
import sizeOf from "image-size";
import { Client } from "twitter-api-sdk";
import { CustomError } from "./error";
import db from "../models/index";
import { string } from "yargs";

dotenv.config();
const client = new Client(process.env.TWITTER_BEARER_TOKEN);

interface TweetImage {
  type: string;
  width: number;
  height: number;
  url: string;
}

interface ImageRecord {
  tweetId: string;
  index: number;
  width: number;
  height: number;
}

const getImagesBuffers = async (srcs: string[]) => {
  const imageBuffers: Buffer[] = [];
  try {
    for (const src of srcs) {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      imageBuffers.push(Buffer.from(arrayBuffer));
    }
  } catch (e) {
    console.log(e);
    throw new CustomError(500, "Cannot fetch images.");
  }
  return imageBuffers;
};

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
    if (e instanceof Object && e.error instanceof Object) {
      throw new CustomError(e.error.status, e.error.detail);
    }
    console.log(e);
    throw new CustomError(500, "API error.");
  }
  if ("errors" in tweet) {
    throw new CustomError(404, "Cannot get a tweet.");
  }
  if (!("includes" in tweet)) {
    throw new CustomError(500, "No data is included");
  }
  if (!("users" in tweet.includes)) {
    throw new CustomError(500, "No user exists.");
  }
  if (!("media" in tweet.includes)) {
    throw new CustomError(500, "No media exists.");
  }

  const user = tweet.includes.users[0];
  const images = (tweet.includes.media as TweetImage[]).filter(
    (medium) => medium.type === "photo"
  );
  if (images.length === 0) {
    throw new CustomError(500, "No image exists.");
  }

  // upload images
  const imageBuffers = await getImagesBuffers(images.map((img) => img.url));
  try {
    for (let i = 0; i < images.length; i++) {
      fs.writeFileSync(`./images/${tweet.data.id}_${i}.jpeg`, imageBuffers[i]);
    }
  } catch (e) {
    console.log(e);
    throw new CustomError(500, "Cannot upload images.");
  }

  const transaction = await db.sequelize.transaction();
  try {
    // insert or update a user
    await db.user.upsert(
      {
        id: user.id,
        screenName: user.username,
        name: user.name,
      },
      { transaction }
    );

    // insert or update a tweet
    await db.tweet.upsert(
      {
        id: tweet.data.id,
        body: tweet.data.text,
        userId: user.id,
        tweetCreatedAt: tweet.data.created_at,
      },
      { transaction }
    );

    // insert images
    const image_records: ImageRecord[] = images.map((_, index) => ({
      tweetId: tweet.data.id,
      index,
      width: images[index].width,
      height: images[index].height,
    }));
    await db.image.bulkCreate(image_records, {
      ignoreDuplicates: true,
      transaction,
    });
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    console.log(e);
    throw new CustomError(500, "DB error.");
  }
};

const screenNamePrefix = "screen:";

export const addParsedTweet = async (
  tweetId: string,
  tweetBody: string,
  tweetCreatedAt: string,
  imgSrcs: string[],
  userName: string,
  screenName: string
) => {
  // get images
  const imageBuffers = await getImagesBuffers(imgSrcs);
  let imageSizes: { width: number; height: number }[] = [];
  try {
    imageSizes = imageBuffers.map((buffer) => sizeOf(buffer));
  } catch {
    throw new CustomError(500, "Failed to process images.");
  }

  const screenNameAsId = screenNamePrefix + screenName;
  const transaction = await db.sequelize.transaction();
  try {
    // insert or update a user
    await db.user.upsert(
      {
        id: screenNameAsId,
        screenName,
        name: userName,
      },
      { transaction }
    );

    // insert or update a tweet
    await db.tweet.upsert(
      {
        id: tweetId,
        body: tweetBody,
        userId: screenNameAsId,
        tweetCreatedAt: tweetCreatedAt,
      },
      { transaction }
    );

    // insert images
    const image_records: ImageRecord[] = imageBuffers.map((_, index) => ({
      tweetId: tweetId,
      index,
      width: imageSizes[index].width,
      height: imageSizes[index].height,
    }));
    await db.image.bulkCreate(image_records, {
      ignoreDuplicates: true,
      transaction,
    });
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    console.log(e);
    throw new CustomError(500, "DB error.");
  }
};

export const getTweetIds = async () => {
  try {
    return (
      await db.tweet.findAll({
        attributes: ["id"],
        raw: true,
      })
    ).map((item) => item.id);
  } catch (e) {
    console.log(e);
    throw new CustomError(500, "DB error.");
  }
};
