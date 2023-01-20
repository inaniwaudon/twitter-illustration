import { Work } from "@/utils/api";

const tagDelimiter = "/";

export const getCharacterTag = (work: Work, character: string) =>
  work.title + tagDelimiter + character;

export const splitCharacterTag = (
  tag: string
): { work: string; character: string } => {
  const splited = tag.split(tagDelimiter)[0];
  return {
    work: splited[0],
    character: splited[1],
  };
};

export const getAllTags = (works: Work[], commonTags: string[]) => [
  ...works.flatMap((work) =>
    work.characters.map((character) => getCharacterTag(work, character))
  ),
  ...commonTags,
];

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export type Mode = "filter" | "tag";
export type FilterMethod = "and" | "or";
