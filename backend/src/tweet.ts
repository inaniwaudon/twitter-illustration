import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import fetch from "node-fetch";
import { Client } from "twitter-api-sdk";
import db from "../models/index";

const router = express.Router();
dotenv.config();

const client = new Client(process.env.TWITTER_BEARER_TOKEN);

const tweetEndpoint = "/tweet";
const tweetCharacterEndpoint = "/tweet-character";

interface TweetGetRequest extends express.Request {
  query: {
    details?: string;
  };
}

interface TweetPostRequest extends express.Request {
  body: {
    id: string;
  };
}

router.get(
  tweetEndpoint,
  async (req: TweetGetRequest, res: express.Response) => {
    if (req.query.details === "true") {
      res.json(
        await db.tweet.findAll({
          raw: true,
          include: [
            {
              model: db.user,
              required: true,
            },
          ],
        })
      );
    } else {
      res.json(
        await db.tweet.findAll({
          attributes: ["id"],
          raw: true,
        })
      );
    }
  }
);

router.post(
  tweetEndpoint,
  async (req: TweetPostRequest, res: express.Response) => {
    // get a tweet
    let tweet;
    try {
      tweet = await client.tweets.findTweetById(req.body.id, {
        expansions: ["attachments.media_keys", "author_id"],
        "media.fields": ["url"],
        "tweet.fields": ["created_at"],
        "user.fields": ["id", "name", "username"],
      });
    } catch {
      res.status(404).send("Cannot get a tweet.");
      return;
    }

    if (tweet.includes.users === 0) {
      res.status(500).send("No user exists.");
      return;
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
      imageCount: images.length,
      userId: user.id,
      createdAt: tweet.data.created_at,
    });

    // upload images
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i].url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(`./images/${tweet.data.id}_${i}.jpeg`, buffer);
    }

    res.status(204).send("Created.");
  }
);

router.post(
  tweetCharacterEndpoint,
  (req: express.Request, res: express.Response) => {
    // insert or
  }
);

export default router;
