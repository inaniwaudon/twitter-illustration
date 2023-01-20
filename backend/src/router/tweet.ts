import dotenv from "dotenv";
import express from "express";
import { Error404, Error500 } from "../error";
import { addTweet } from "../tweet";
import db from "../../models/index";

const router = express.Router();
dotenv.config();

// endpoint
const tweetEndpoint = "/tweet";
const tweetTagEndpoint = "/tweet-tag";

// tweet
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
    try {
      await addTweet(req.body.id);
    } catch (e) {
      if (e instanceof Error404) {
        res.status(404).send(e.message);
      }
      if (e instanceof Error500) {
        res.status(500).send(e.message);
      }
      res.status(500).send("Server error.");
    }
    res.status(204).send("Created.");
  }
);

// tweet-tag
router.post(
  tweetTagEndpoint,
  (req: express.Request, res: express.Response) => {}
);

export default router;
