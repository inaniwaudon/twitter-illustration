import { Work } from "@/const/types";

export const getCharacterId = (work: Work, character: string) =>
  work.title + "/" + character;

export type Mode = "filter" | "tag";
