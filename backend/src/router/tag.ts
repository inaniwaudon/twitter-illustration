import express from "express";
import fs from "fs";

const router = express.Router();

// work
router.get("/work", (req: express.Request, res: express.Response) => {
  const worksJson = JSON.parse(fs.readFileSync("./data/works.json", "utf-8"));
  res.json(worksJson);
});

// common-tag
router.get("/common-tag", (req: express.Request, res: express.Response) => {
  const commonTagJson = JSON.parse(
    fs.readFileSync("./data/common-tag.json", "utf-8")
  );
  res.json(commonTagJson);
});

export default router;
