import dotenv from "dotenv";
import express from "express";
import imageRouter from "./router/image";
import tagRouter from "./router/tag";
import tweetRouter from "./router/tweet";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  }
);

app.use(imageRouter);
app.use(tagRouter);
app.use(tweetRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Start on the port of ${port}.`);
});

const router = express.Router();
export default router;
