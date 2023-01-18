import express from "express";
import fs from "fs";
import path from "path";

const app = express();

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  }
);

app.listen(3030, () => {
  console.log("Start on the port of 3030.");
});

// chapter
app.get("/works", (req: express.Request, res: express.Response) => {
  const worksJson = JSON.parse(fs.readFileSync("./data/works.json", "utf-8"));
  res.json(worksJson);
});

// tweet
app.get("/tweets", (req: express.Request, res: express.Response) => {
  const tweetsJson = JSON.parse(fs.readFileSync("./data/tweets.json", "utf-8"));
  res.json(tweetsJson);
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
    `images/${req.query.id}_${req.query.no}.jpeg`
  );
  res.sendFile(filepath);
});
