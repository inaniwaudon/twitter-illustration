export interface Work {
  title: string;
  aliases: string[];
  characters: string[];
}

export interface Tweet {
  id: string;
  body: string;
  imageCount: number;
  userId: string;
  createdAt: string;
  "User.id": string;
  "User.screenName": string;
  "User.name": string;
  characters: string[];
  work?: string;
}
