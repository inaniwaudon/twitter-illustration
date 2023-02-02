import express from "express";
import { CustomError } from "../error";
import { addParsedTweet } from "../tweet";

const router = express.Router();

// endpoint
const parsedTweetEndpoint = "/parsed-tweet";

// request
interface ParsedTweetPostRequest extends express.Request {
  body: {
    tweetId: string;
    tweetBody: string;
    tweetCreatedAt: string;
    screenName: string;
    userName: string;
    imgSrcs: string[];
  };
}

router.post(
  parsedTweetEndpoint,
  async (req: ParsedTweetPostRequest, res: express.Response) => {
    try {
      if (
        !req.body.tweetId ||
        !req.body.tweetBody ||
        !req.body.tweetCreatedAt ||
        !req.body.screenName ||
        !req.body.userName ||
        !req.body.imgSrcs ||
        req.body.imgSrcs.length === 0
      ) {
        res.status(400).send("Bad request.");
      }
      await addParsedTweet(
        req.body.tweetId,
        req.body.tweetBody,
        req.body.tweetCreatedAt,
        req.body.imgSrcs,
        req.body.screenName,
        req.body.userName
      );
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

export default router;
