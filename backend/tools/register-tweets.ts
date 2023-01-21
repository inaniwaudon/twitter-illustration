import fs from "fs";
import { addTweet, getTweetIds } from "../src/tweet";

const src = process.argv[2];
const json = JSON.parse(fs.readFileSync(src, "utf-8"));

(async () => {
  if (!Array.isArray(json)) {
    throw new Error("Array is required.");
  }

  const tweetIds = await getTweetIds();

  for (const id of json) {
    if (tweetIds.includes(id)) {
      console.log(`${id} is already exists.`);
      continue;
    }
    try {
      await addTweet(id);
      console.log(`Added ${id}.`);
    } catch (e) {
      console.log(e);
      return;
    }
  }
})();
