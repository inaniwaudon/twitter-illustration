import express from "express";
import { Op } from "sequelize";
import { CustomError } from "../error";
import { addTweet, getTweetIds } from "../tweet";
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

interface TweetPostOrDeleteRequest extends express.Request {
  body: {
    ids: string[];
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
      try {
        res.json(await getTweetIds());
      } catch (e) {
        console.log(e);
        if (e instanceof CustomError) {
          res.status(e.status).send(e.message);
        } else {
          res.status(500).send("Server error.");
        }
      }
    }
  }
);

router.post(
  tweetEndpoint,
  async (req: TweetPostOrDeleteRequest, res: express.Response) => {
    try {
      await Promise.all(req.body.ids.map((id) => addTweet(id)));
    } catch (e) {
      console.log(e);
      if (e instanceof CustomError) {
        res.status(e.status).send(e.message);
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
  async (req: TweetPostOrDeleteRequest, res: express.Response) => {
    try {
      await db.tweet.destroy({
        where: {
          id: {
            [Op.in]: req.body.ids,
          },
        },
      });
      res.status(204).send();
    } catch (e) {
      console.log(e);
      res.status(500).send("Server error.");
    }
  }
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
    } catch (e) {
      console.log(e);
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
    } catch (e) {
      console.log(e);
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
    } catch (e) {
      console.log(e);
      res.status(500).send("Server error.");
    }
  }
);

export default router;
