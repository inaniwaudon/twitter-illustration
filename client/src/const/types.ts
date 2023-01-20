export interface Work {
  title: string;
  aliases: string[];
  characters: string[];
}

export interface Tweet {
  id: string;
  body: string;
  userId: string;
  tweetCreatedAt: string;
  characters: string[];
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
