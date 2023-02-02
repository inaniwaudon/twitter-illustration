import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import ColorTags from "./ColorTags";
import { Tweet, TweetToTag, Work } from "@/utils/api";
import { Color, DisplayOptions, FilterMethod } from "@/utils/utils";
import IllustGroup from "./IllustGroup";

const Wrapper = styled.div`
  min-height: calc(100vh - 40px);
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

  const splitedTweets = useMemo(() => {
    const array: Tweet[][] = [];
    const n = 100;
    for (let i = 0; i < Math.ceil(filteredTweets.length / n); i++) {
      array.push(filteredTweets.slice(i * n, (i + 1) * n));
    }
    console.log(array);
    return array;
  }, [filteredTweets]);

  return (
    <>
      <Wrapper>
        {splitedTweets.map((tweets, index) => (
          <IllustGroup
            isShiftKeyPressed={isShiftKeyPressed}
            pixelColor={pixelColor}
            mousePoint={mousePoint}
            selectedTweetIds={selectedTweetIds}
            tweets={tweets}
            displayOptions={displayOptions}
            key={index}
            setPixelColor={setPixelColor}
            setMousePoint={setMousePoint}
            setSelectedTweetIds={setSelectedTweetIds}
          />
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
