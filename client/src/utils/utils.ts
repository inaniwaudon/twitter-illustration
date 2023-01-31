import {
  addTweetTag,
  deleteTweetTag,
  Character,
  TweetToTag,
  Work,
} from "@/utils/api";

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export type Mode = "filter" | "tag";
export type FilterMethod = "and" | "or";

export interface DisplayOptions {
  isSquare: boolean;
  columns: number;
}

// tag
const tagDelimiter = "/";

export const getCharacterTag = (work: Work, character: Character) =>
  work.title + tagDelimiter + character.name;

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

export const switchAssociation = (
  tweetIds: string[],
  tag: string,
  associatedTags: string[],
  tweetToTags: TweetToTag
) => {
  const alreadyExsits = associatedTags.includes(tag);

  // update the data
  if (alreadyExsits) {
    deleteTweetTag(tweetIds, [tag]);
  } else {
    addTweetTag(tweetIds, [tag]);
  }

  // display
  const newTweetToTags: TweetToTag = {
    ...tweetIds.reduce((previous, id) => ({ ...previous, [id]: [] }), {}),
    ...tweetToTags,
  };
  for (const id of tweetIds) {
    newTweetToTags[id] = alreadyExsits
      ? newTweetToTags[id].filter((inTag) => inTag !== tag)
      : [...newTweetToTags[id], tag];
  }
  return newTweetToTags;
};

// color
export type Color = [number, number, number];

export const hexToRgb = (hex: string): Color => {
  const colorCode = hex.replace("#", "");
  const hexRgb: [string, string, string] = [
    colorCode.slice(0, 2),
    colorCode.slice(2, 4),
    colorCode.slice(4, 6),
  ];
  return hexRgb.map((color) => parseInt(color, 16)) as Color;
};

export const rgbToHex = (color: Color) =>
  `#${color[0].toString(16)}${color[1].toString(16)}${color[2].toString(16)}`;

export const rgbToHsl = (color: Color) => {
  const [r, g, b] = color;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h =
    ((max === r
      ? 60 * ((g - b) / (max - min))
      : max === g
      ? 60 * ((b - r) / (max - min)) + 120
      : 60 * ((r - g) / (max - min)) + 240) +
      360) %
    360;
  const l = (max + min) / 2;
  const s =
    l > 127 ? (max - min) / (510 - max - min) : (max - min) / (max + min);
  return [h, s, l];
};

// image
export const loadImage = (img: HTMLImageElement) =>
  new Promise<void>((resolve) => {
    if (img.complete) {
      resolve();
    } else {
      img.onload = () => resolve();
    }
  });

export const getImagePixel = async (
  img: HTMLImageElement,
  xRatio: number,
  yRatio: number,
  width: number
): Promise<Color> => {
  await loadImage(img);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = (img.naturalHeight / img.naturalWidth) * width;

  const context = canvas.getContext("2d");
  if (!context) {
    return [0, 0, 0];
  }
  context.drawImage(img, 0, 0, width, canvas.height);
  const imgData = context.getImageData(
    xRatio * canvas.width,
    yRatio * canvas.height,
    1,
    1
  );
  return [imgData.data[0], imgData.data[1], imgData.data[2]];
};
