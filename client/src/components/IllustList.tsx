import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { defaultBoxShadow, getKeyColor } from "@/const/styles";
import { getImageEndpoint, Tweet, TweetToTag } from "@/utils/api";
import { FilterMethod } from "@/utils/utils";

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

const Image = styled.img<{ blur: boolean }>`
  width: 100%;
  vertical-align: top;
  filter: blur(${(props) => (props.blur ? 6 : 0)}px);
`;

interface IllustListProps {
  originalTweets: Tweet[];
  tweetToTags: TweetToTag;
  keyword: string;
  columnCount: number;
  filterMethod: FilterMethod;
  selectedTweetIds: string[];
  selectedTags: string[];
  onlyUnrelated: boolean;
  isShiftKeyPressed: boolean;
  setSelectedTweetIds: (value: string[]) => void;
}

const IllustList = ({
  originalTweets,
  tweetToTags,
  keyword,
  columnCount,
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
    if (onlyUnrelated) {
      if (!onlyUnrelatedTweets) {
        const filteredTweets = originalTweets.filter(
          (tweet) =>
            !(tweet.id in tweetToTags) || tweetToTags[tweet.id].length === 0
        );
        setFilteredTweets(filteredTweets);
        setOnlyUnrelatedTweets(filteredTweets);
      }
      return;
    }

    const keywordFilteredTweets =
      keyword.length > 0
        ? keyword.startsWith("@")
          ? originalTweets.filter((tweet) =>
              tweet.User.screenName.startsWith(keyword.slice(1))
            )
          : originalTweets.filter((tweet) => tweet.body.includes(keyword))
        : originalTweets;
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
    selectedTags,
    keyword,
    tweetToTags,
    filterMethod,
    onlyUnrelated,
  ]);

  const tweetRows = useMemo(() => {
    // TODO: when no image exists.
    const totalHeight = filteredTweets
      .map((tweet) => tweet.Images[0].height / tweet.Images[0].width)
      .reduce((previous, current) => previous + current, 0);

    let tweetsPerColumn: Tweet[][] = [[]];
    let columnHeight = 0;

    for (const tweet of filteredTweets) {
      tweetsPerColumn[tweetsPerColumn.length - 1]!.push(tweet);
      columnHeight += tweet.Images[0].height / tweet.Images[0].width;
      if (
        columnHeight > totalHeight / columnCount &&
        tweetsPerColumn.length < columnCount
      ) {
        tweetsPerColumn.push([]);
        columnHeight = 0;
      }
    }
    return tweetsPerColumn;
  }, [filteredTweets, columnCount]);

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

  console.log(process.env);

  return (
    <Wrapper ref={wrapperRef}>
      {tweetRows.map((row, i) => (
        <Column columnCount={columnCount} key={i}>
          {row.map((tweet) => (
            <Illust
              aspectRatio={tweet.Images[0].height / tweet.Images[0].width}
              selected={selectedTweetIds.includes(tweet.id)}
              onClick={(e) => onClickTweet(e, tweet.id)}
              key={tweet.id}
            >
              <Image
                src={getImageEndpoint(tweet.id, 0)}
                alt=""
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
