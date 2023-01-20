import express from "express";
import tweetRouter from "./router/tweet";

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
app.use(tweetRouter);
app.listen(3030, () => {
  console.log("Start on the port of 3030.");
});

const router = express.Router();
export default router;
