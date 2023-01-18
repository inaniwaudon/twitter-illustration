import urlJoin from "url-join";
import { Tweet, Work } from "@/const/types";

export const getWorks = async () => {
  const url = urlJoin(process.env.BACKEND_URL!, "works");
  const response = await fetch(url);
  return (await response.json()) as Work[];
};

export const getTweets = async () => {
  const url = urlJoin(process.env.BACKEND_URL!, "tweets");
  const response = await fetch(url);
  return (await response.json()) as Tweet[];
};

export const getImageEndpoint = (id: string, no: number) => {
  return urlJoin(process.env.BACKEND_URL!, "image", `?id=${id}`, `&no=${no}`);
};
