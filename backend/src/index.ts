import express from "express";
import fs from "fs";
import path from "path";
import tweetRouter from "./tweet";

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

// chapter
app.get("/work", (req: express.Request, res: express.Response) => {
  const worksJson = JSON.parse(fs.readFileSync("./data/works.json", "utf-8"));
  res.json(worksJson);
});

// common-tag
app.get("/common-tag", (req: express.Request, res: express.Response) => {
  const commonTagJson = JSON.parse(
    fs.readFileSync("./data/common-tag.json", "utf-8")
  );
  res.json(commonTagJson);
});

// image
interface ImageRequest extends express.Request {
  query: {
    id: string;
    no: string;
  };
}

app.get("/image", (req: ImageRequest, res: express.Response) => {
  console.log(req.query);
  const filepath = path.join(
    __dirname,
    `../images/${req.query.id}_${req.query.no}.jpeg`
  );
  res.sendFile(filepath);
});
