import { Work } from "@/utils/api";

const tagDelimiter = "/";

export const getCharacterTag = (work: Work, character: string) =>
  work.title + tagDelimiter + character;

export const splitCharacterTag = (
  tag: string
): { work: string; character: string } => {
  const splited = tag.split(tagDelimiter);
  return {
    work: splited[0],
    character: splited[1],
  };
};

export const getUniqueCommonTag = (tag: string) =>
  "common" + tagDelimiter + tag;

export const splitUniqueCommonTag = (tag: string) => tag.split(tagDelimiter)[1];

export const getAllTags = (works: Work[], commonTags: string[]) => [
  ...works.flatMap((work) =>
    work.characters.map((character) => getCharacterTag(work, character))
  ),
  ...commonTags.map((tag) => getUniqueCommonTag(tag)),
];

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export type Mode = "filter" | "tag";
export type FilterMethod = "and" | "or";

export interface DisplayOptions {
  isSquare: boolean;
  columns: number;
}
