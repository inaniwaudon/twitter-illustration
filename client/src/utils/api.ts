import urlJoin from "url-join";

export interface Work {
  title: string;
  aliases: string[];
  characters: Character[];
}

export interface Character {
  name: string;
  color?: string[];
}

export interface Tweet {
  id: string;
  body: string;
  userId: string;
  tweetCreatedAt: string;
  User: {
    id: string;
    screenName: string;
    name: string;
  };
  Images: {
    width: number;
    height: number;
  }[];
}

export type TweetToTag = { [key in string]: string[] };

const getRequest = (endpoint: string, params: { [key in string]: string }) => {
  const url = urlJoin("/api", endpoint);
  const searchParams = new URLSearchParams(params);
  return fetch(`${url}?${searchParams}`);
};

const postOrDeleteRequestWithJson = (
  endpoint: string,
  body: unknown,
  method: "POST" | "DELETE"
) => {
  const url = urlJoin("/api", endpoint);
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

// tag
export const getWorks = async () => {
  const response = await getRequest("work", {});
  return (await response.json()) as Work[];
};

export const getCommonTags = async () => {
  const response = await getRequest("common-tag", {});
  return (await response.json()) as string[];
};

// tweet
export const getTweets = async () => {
  const response = await getRequest("tweet", { details: "true" });
  return (await response.json()) as Tweet[];
};

export const addTweet = async (id: string) => {
  return await postOrDeleteRequestWithJson("tweet", { ids: [id] }, "POST");
};

export const deleteTweets = async (ids: string[]) => {
  return await postOrDeleteRequestWithJson("tweet", { ids }, "DELETE");
};

// tweet-tag
export const getTweetToTags = async () => {
  const response = await getRequest("tweet-tag", {});
  const tweetTags = (await response.json()) as {
    tweetId: string;
    tag: string;
  }[];
  const tweetToTags: { [key in string]: string[] } = {};
  for (const tweetTag of tweetTags) {
    if (!(tweetTag.tweetId in tweetToTags)) {
      tweetToTags[tweetTag.tweetId] = [];
    }
    tweetToTags[tweetTag.tweetId].push(tweetTag.tag);
  }
  return tweetToTags;
};

export const addTweetTag = async (tweetIds: string[], tags: string[]) => {
  postOrDeleteRequestWithJson("tweet-tag", { tweetIds, tags }, "POST");
};

export const deleteTweetTag = async (tweetIds: string[], tags: string[]) => {
  postOrDeleteRequestWithJson("tweet-tag", { tweetIds, tags }, "DELETE");
};

// image
export const getImageEndpoint = (id: string, no: number) => {
  return urlJoin("/api/image", `?id=${id}`, `&no=${no}`);
};
