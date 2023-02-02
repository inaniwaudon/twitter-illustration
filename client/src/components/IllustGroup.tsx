import React, { useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import { blurRange, defaultBoxShadow, getKeyColor } from "@/const/styles";
import { getImageEndpoint, Tweet, TweetToTag, Work } from "@/utils/api";
import { DisplayOptions } from "@/utils/utils";

const Wrapper = styled.div`
  padding: 20px 0;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: flex-start;
`;

const Column = styled.div<{ columnCount: number; aspectRatio: number }>`
  aspect-ratio: 1 / ${(props) => props.aspectRatio};
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

interface IllustGroupProps {
  selectedTweetIds: string[];
  tweets: Tweet[];
  displayOptions: DisplayOptions;
}

const IllustGroup = ({
  selectedTweetIds,
  tweets,
  displayOptions,
}: IllustGroupProps) => {
  const [aspectRatios, setAspectRatios] = useState<number[]>([]);

  const { ref: wrapperRef, inView } = useInView({
    rootMargin: "0px",
    triggerOnce: false,
  });

  const getRatio = (tweet: Tweet) =>
    displayOptions.isSquare
      ? 1
      : tweet.Images[0].height / tweet.Images[0].width;

  const tweetRows = useMemo(() => {
    const totalHeight = tweets
      .filter((tweet) => tweet.Images.length > 0)
      .map((tweet) => getRatio(tweet))
      .reduce((previous, current) => previous + current, 0);

    let tweetsPerColumn: Tweet[][] = [[]];
    let columnHeights = [0];

    for (const tweet of tweets) {
      tweetsPerColumn[tweetsPerColumn.length - 1]!.push(tweet);
      columnHeights[columnHeights.length - 1] += getRatio(tweet);
      if (
        columnHeights[columnHeights.length - 1] >
          totalHeight / displayOptions.columns &&
        tweetsPerColumn.length < displayOptions.columns
      ) {
        tweetsPerColumn.push([]);
        columnHeights.push(0);
      }
    }
    setAspectRatios(columnHeights);
    return tweetsPerColumn;
  }, [tweets, displayOptions]);

  return (
    <Wrapper ref={wrapperRef}>
      {tweetRows.map((row, i) => (
        <Column
          columnCount={displayOptions.columns}
          aspectRatio={aspectRatios[i]}
          key={i}
        >
          {inView ? (
            row.map((tweet) => {
              return (
                <Illust
                  aspectRatio={displayOptions.isSquare ? 1 : getRatio(tweet)}
                  selected={selectedTweetIds.includes(tweet.id)}
                  //onClick={(e) => onClickTweet(e, tweet.id)}
                  key={tweet.id}
                >
                  <DivImage
                    src={getImageEndpoint(tweet.id, 0)}
                    blur={process.env.BLUR === "true"}
                  />
                </Illust>
              );
            })
          ) : (
            <></>
          )}
        </Column>
      ))}
    </Wrapper>
  );
};

export default IllustGroup;
