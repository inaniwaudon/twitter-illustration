import express from "express";
import fs from "fs";
import { Character, Work } from "../tag";

const router = express.Router();

// work
router.get("/work", (req: express.Request, res: express.Response) => {
  try {
    const worksJson = JSON.parse(
      fs.readFileSync("./data/works.json", "utf-8")
    ) as Work[];
    for (const work of worksJson) {
      for (let i = 0; i < work.characters.length; i++) {
        const character = work.characters[i];
        work.characters[i] =
          typeof character === "object" ? character : { name: character };
      }
    }
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
