import dotenv from "dotenv";
import express from "express";
import imageRouter from "./router/image";
import parsedTweetRouter from "./router/parsed-tweet";
import tagRouter from "./router/tag";
import tweetRouter from "./router/tweet";

dotenv.config();

const app = express();
app.use(express.json());

app.use(imageRouter);
app.use(tagRouter);
app.use(tweetRouter);
app.use(parsedTweetRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Start on the port of ${port}.`);
});

const router = express.Router();
export default router;
