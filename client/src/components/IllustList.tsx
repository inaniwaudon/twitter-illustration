import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { blurRange, defaultBoxShadow, getKeyColor } from "@/const/styles";
import { getImageEndpoint, Tweet, TweetToTag } from "@/utils/api";
import { DisplayOptions, FilterMethod } from "@/utils/utils";

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

const Image = styled.div<{ src: string; blur: boolean }>`
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
  keyword: string;
  displayOptions: DisplayOptions;
  filterMethod: FilterMethod;
  selectedTweetIds: string[];
  selectedTags: string[];
  onlyUnrelated: boolean;
  isShiftKeyPressed: boolean;
  setSelectedTweetIds: (value: string[]) => void;
}

const IllustList = ({
  originalTweets,
  deletedTweetIds,
  tweetToTags,
  keyword,
  displayOptions,
  filterMethod,
  selectedTweetIds,
  selectedTags,
  onlyUnrelated,
  isShiftKeyPressed,
  setSelectedTweetIds,
}: IllustListProps) => {
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [onlyUnrelatedTweets, setOnlyUnrelatedTweets] = useState<Tweet[]>();
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const onClickTweet = (_: React.MouseEvent, id: string) => {
    setSelectedTweetIds(
      isShiftKeyPressed
        ? selectedTweetIds.includes(id)
          ? selectedTweetIds.filter((inId) => inId !== id)
          : [...selectedTweetIds, id]
        : selectedTweetIds.includes(id)
        ? []
        : [id]
    );
  };

  return (
    <Wrapper ref={wrapperRef}>
      {tweetRows.map((row, i) => (
        <Column columnCount={displayOptions.columns} key={i}>
          {row.map((tweet) => (
            <Illust
              aspectRatio={displayOptions.isSquare ? 1 : getRatio(tweet)}
              selected={selectedTweetIds.includes(tweet.id)}
              onClick={(e) => onClickTweet(e, tweet.id)}
              key={tweet.id}
            >
              <Image
                src={getImageEndpoint(tweet.id, 0)}
                blur={process.env.BLUR === "true"}
              />
            </Illust>
          ))}
        </Column>
      ))}
    </Wrapper>
  );
};

export default IllustList;
