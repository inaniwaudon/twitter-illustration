import urlJoin from "url-join";
import { Tweet, Work } from "@/const/types";

export const getWorks = async () => {
  const url = urlJoin(process.env.BACKEND_URL!, "work");
  const response = await fetch(url);
  return (await response.json()) as Work[];
};

export const getCommonTags = async () => {
  const url = urlJoin(process.env.BACKEND_URL!, "common-tag");
  const response = await fetch(url);
  return (await response.json()) as string[];
};

// tweet
const tweetUrl = urlJoin(process.env.BACKEND_URL!, "tweet");

export const getTweets = async () => {
  const response = await fetch(tweetUrl);
  return (await response.json()) as Tweet[];
};

export const collectTweet = async (id: string) => {
  const response = await fetch(tweetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
  return response;
};

export const getImageEndpoint = (id: string, no: number) => {
  return urlJoin(process.env.BACKEND_URL!, "image", `?id=${id}`, `&no=${no}`);
};
