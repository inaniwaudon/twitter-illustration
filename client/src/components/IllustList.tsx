import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import ColorTags from "./ColorTags";
import { blurRange, defaultBoxShadow, getKeyColor } from "@/const/styles";
import { getImageEndpoint, Tweet, TweetToTag, Work } from "@/utils/api";
import {
  getImagePixel,
  loadImage,
  Color,
  DisplayOptions,
  FilterMethod,
} from "@/utils/utils";

const Wrapper = styled.div`
  min-height: calc(100vh - 40px);
  padding: 20px 0;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: flex-start;
`;

const Column = styled.div<{ columnCount: number }>`
  flex-basis: ${(props) => 100 / props.columnCount}%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Illust = styled.div<{ aspectRatio: number; selected: boolean }>`
  aspect-ratio: 1 / ${(props) => props.aspectRatio};
  flex-shrink: 0;
  flex-grow: 0;
  border-radius: 2px;
  box-shadow: ${(props) =>
    props.selected ? `0 1px 14px ${getKeyColor(0.4)}` : defaultBoxShadow};
  overflow: hidden;
  transform: scale(${(props) => (props.selected ? 0.9 : 1.0)});
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: ${(props) =>
      props.selected
        ? `0 1px 16px ${getKeyColor(0.4)})`
        : "0 1px 4px rgba(0, 0, 0, 0.2)"};
    transform: scale(${(props) => (props.selected ? 0.89 : 0.98)});
  }
`;

const DivImage = styled.div<{ src: string; blur: boolean }>`
  width: 100%;
  height: 100%;
  vertical-align: top;
  background-image: url("${(props) => props.src}");
  background-position: center;
  background-size: cover;
  filter: blur(${(props) => (props.blur ? blurRange : 0)}px);
`;

interface IllustListProps {
  originalTweets: Tweet[];
  deletedTweetIds: string[];
  tweetToTags: TweetToTag;
  works: Work[];
  keyword: string;
  displayOptions: DisplayOptions;
  filterMethod: FilterMethod;
  selectedTweetIds: string[];
  selectedTags: string[];
  associatedTags: string[];
  onlyUnrelated: boolean;
  isShiftKeyPressed: boolean;
  setSelectedTweetIds: (value: string[]) => void;
  inSwitchAssociation: (tag: string) => void;
}

const IllustList = ({
  originalTweets,
  deletedTweetIds,
  tweetToTags,
  works,
  keyword,
  displayOptions,
  filterMethod,
  selectedTweetIds,
  selectedTags,
  associatedTags,
  onlyUnrelated,
  isShiftKeyPressed,
  setSelectedTweetIds,
  inSwitchAssociation,
}: IllustListProps) => {
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [onlyUnrelatedTweets, setOnlyUnrelatedTweets] = useState<Tweet[]>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [pixelColor, setPixelColor] = useState<Color>();
  const [mousePoint, setMousePoint] = useState<[number, number]>();

  const matchesTweet = (tweet: Tweet, tag: string) =>
    tweet.id in tweetToTags && tweetToTags[tweet.id].includes(tag);

  // filter
  useEffect(() => {
    const remainingTweets = originalTweets.filter(
      (tweet) => !deletedTweetIds.includes(tweet.id)
    );

    if (onlyUnrelated) {
      if (!onlyUnrelatedTweets) {
        const filteredTweets = remainingTweets.filter(
          (tweet) =>
            !(tweet.id in tweetToTags) || tweetToTags[tweet.id].length === 0
        );
        setFilteredTweets(filteredTweets);
        setOnlyUnrelatedTweets(filteredTweets);
      } else {
        setFilteredTweets(
          onlyUnrelatedTweets.filter(
            (tweet) => !deletedTweetIds.includes(tweet.id)
          )
        );
      }
      return;
    }

    const keywordFilteredTweets =
      keyword.length > 0
        ? keyword.startsWith("@")
          ? remainingTweets.filter((tweet) =>
              tweet.User.screenName.startsWith(keyword.slice(1))
            )
          : remainingTweets.filter((tweet) => tweet.body.includes(keyword))
        : remainingTweets;
    const filteredTweets =
      selectedTags.length > 0
        ? keywordFilteredTweets.filter((tweet) =>
            filterMethod === "and"
              ? selectedTags.every((tag) => matchesTweet(tweet, tag))
              : selectedTags.some((tag) => matchesTweet(tweet, tag))
          )
        : keywordFilteredTweets;
    setFilteredTweets(filteredTweets);
    setOnlyUnrelatedTweets(undefined);
  }, [
    originalTweets,
    deletedTweetIds,
    selectedTags,
    keyword,
    tweetToTags,
    filterMethod,
    onlyUnrelated,
  ]);

  const getRatio = (tweet: Tweet) =>
    displayOptions.isSquare
      ? 1
      : tweet.Images[0].height / tweet.Images[0].width;

  const tweetRows = useMemo(() => {
    const totalHeight = filteredTweets
      .filter((tweet) => tweet.Images.length > 0)
      .map((tweet) => getRatio(tweet))
      .reduce((previous, current) => previous + current, 0);

    let tweetsPerColumn: Tweet[][] = [[]];
    let columnHeight = 0;

    for (const tweet of filteredTweets) {
      tweetsPerColumn[tweetsPerColumn.length - 1]!.push(tweet);
      columnHeight += getRatio(tweet);
      if (
        columnHeight > totalHeight / displayOptions.columns &&
        tweetsPerColumn.length < displayOptions.columns
      ) {
        tweetsPerColumn.push([]);
        columnHeight = 0;
      }
    }
    return tweetsPerColumn;
  }, [filteredTweets, displayOptions]);

  const onClickTweet = async (e: React.MouseEvent, id: string) => {
    if (e.ctrlKey || e.metaKey) {
      const rect = e.currentTarget.getBoundingClientRect();

      // get color
      const img = new Image();
      img.src = getImageEndpoint(id, 0);
      await loadImage(img);

      let x = e.clientX - rect.x;
      let y = e.clientY - rect.y;
      if (displayOptions.isSquare) {
        if (img.naturalWidth > img.naturalHeight) {
          x += ((img.naturalWidth / img.naturalHeight - 1.0) * rect.height) / 2;
        } else {
          y += ((img.naturalHeight / img.naturalWidth - 1.0) * rect.width) / 2;
        }
      }

      const pixel = await getImagePixel(
        img,
        x / rect.width,
        y / ((img.height / img.width) * rect.width),
        rect.width
      );

      setPixelColor(pixel);
      setMousePoint([e.clientX, e.clientY]);
      if (selectedTweetIds.length === 0) {
        setSelectedTweetIds([id]);
      }
    } else {
      if (!pixelColor || !mousePoint) {
        setSelectedTweetIds(
          isShiftKeyPressed
            ? selectedTweetIds.includes(id)
              ? selectedTweetIds.filter((inId) => inId !== id)
              : [...selectedTweetIds, id]
            : selectedTweetIds.includes(id)
            ? []
            : [id]
        );
      }
      setPixelColor(undefined);
      setMousePoint(undefined);
    }
  };

  return (
    <>
      <Wrapper ref={wrapperRef}>
        {tweetRows.map((row, i) => (
          <Column columnCount={displayOptions.columns} key={i}>
            {row.map((tweet) => {
              return (
                <Illust
                  aspectRatio={displayOptions.isSquare ? 1 : getRatio(tweet)}
                  selected={selectedTweetIds.includes(tweet.id)}
                  onClick={(e) => onClickTweet(e, tweet.id)}
                  key={tweet.id}
                >
                  <DivImage
                    src={getImageEndpoint(tweet.id, 0)}
                    blur={process.env.BLUR === "true"}
                  />
                </Illust>
              );
            })}
          </Column>
        ))}
      </Wrapper>
      {mousePoint && pixelColor ? (
        <ColorTags
          works={works}
          point={mousePoint}
          color={pixelColor}
          associatedTags={associatedTags}
          inSwitchAssociation={inSwitchAssociation}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default IllustList;
