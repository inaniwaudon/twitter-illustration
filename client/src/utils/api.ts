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

const postRequestWithJson = (
  endpoint: string,
  body: unknown,
  method: "GET" | "POST" = "GET"
) => {
  const url = urlJoin(process.env.BACKEND_URL!, endpoint);
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

const getRequest = (endpoint: string, params: { [key in string]: string }) => {
  const url = urlJoin(process.env.BACKEND_URL!, endpoint);
  const searchParams = new URLSearchParams(params);
  return fetch(`${url}?${searchParams}`);
};

// tweet
export const getTweets = async () => {
  const response = await getRequest("tweet", { details: "true" });
  return (await response.json()) as Tweet[];
};

export const collectTweet = async (id: string) => {
  return await postRequestWithJson("tweet", { id }, "POST");
};

export const getImageEndpoint = (id: string, no: number) => {
  return urlJoin(process.env.BACKEND_URL!, "image", `?id=${id}`, `&no=${no}`);
};
