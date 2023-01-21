import express from "express";
import { Op } from "sequelize";
import { Error404, Error500 } from "../error";
import { addTweet } from "../tweet";
import db from "../../models/index";

const router = express.Router();

// endpoint
const tweetEndpoint = "/tweet";
const tweetTagEndpoint = "/tweet-tag";

// request
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

interface TweetTagPostOrDeleteRequest extends express.Request {
  body: {
    tweetIds: string[];
    tags: string[];
  };
}

router.get(
  tweetEndpoint,
  async (req: TweetGetRequest, res: express.Response) => {
    if (req.query.details === "true") {
      res.json(
        await db.tweet.findAll({
          attributes: ["id", "body", "tweetCreatedAt"],
          include: [
            {
              model: db.user,
              required: true,
              attributes: ["name", "screenName"],
            },
            {
              model: db.image,
              attributes: ["width", "height"],
              order: ["index", "ASC"],
            },
          ],
          where: {},
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
        return;
      }
      if (e instanceof Error500) {
        res.status(500).send(e.message);
        return;
      }
      res.status(500).send("Server error.");
      return;
    }
    res.status(204).send();
  }
);

router.delete(
  tweetEndpoint,
  async (req: express.Request, res: express.Response) => {}
);

// tweet-tag
router.get(
  tweetTagEndpoint,
  async (req: express.Request, res: express.Response) => {
    try {
      res.json(
        await db.tweetTag.findAll({
          attributes: ["tweetId", "tag"],
        })
      );
    } catch {
      res.status(500).send("Server error.");
    }
  }
);

router.post(
  tweetTagEndpoint,
  async (req: TweetTagPostOrDeleteRequest, res: express.Response) => {
    try {
      const records = req.body.tweetIds.flatMap((id) =>
        req.body.tags.map((tag) => ({ tweetId: id, tag }))
      );
      await db.tweetTag.bulkCreate(records, { ignoreDuplicates: true });
      res.status(204).send();
    } catch {
      res.status(500).send("Server error.");
    }
  }
);

router.delete(
  tweetTagEndpoint,
  async (req: TweetTagPostOrDeleteRequest, res: express.Response) => {
    try {
      const conditions = req.body.tweetIds.flatMap((id) =>
        req.body.tags.map((tag) => ({ tweetId: id, tag }))
      );
      await db.tweetTag.destroy({
        where: {
          [Op.or]: conditions,
        },
      });
      res.status(204).send();
    } catch {
      res.status(500).send("Server error.");
    }
  }
);

export default router;
