import express from "express";
import fs from "fs";

const router = express.Router();

// work
router.get("/work", (req: express.Request, res: express.Response) => {
  try {
    const worksJson = JSON.parse(fs.readFileSync("./data/works.json", "utf-8"));
    res.json(worksJson);
  } catch (e) {
    console.log(e);
    res.status(500).send("IO error.");
  }
});

// common-tag
router.get("/common-tag", (req: express.Request, res: express.Response) => {
  try {
    const commonTagJson = JSON.parse(
      fs.readFileSync("./data/common-tag.json", "utf-8")
    );
    res.json(commonTagJson);
  } catch (e) {
    console.log(e);
    res.status(500).send("IO error.");
  }
});

export default router;
