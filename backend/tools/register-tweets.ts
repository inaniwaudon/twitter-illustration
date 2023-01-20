import fs from "fs";
import { addTweet } from "../src/tweet";

const src = process.argv[2];
const json = JSON.parse(fs.readFileSync(src, "utf-8"));

if (!Array.isArray(json)) {
  throw new Error("Array is required.");
}

for (const id of json) {
  addTweet(id);
}
