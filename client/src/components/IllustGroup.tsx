import React, { useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import { blurRange, defaultBoxShadow, getKeyColor } from "@/const/styles";
import { getImageEndpoint, Tweet } from "@/utils/api";
import { getImagePixel, loadImage, Color, DisplayOptions } from "@/utils/utils";

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
  isShiftKeyPressed: boolean;
  pixelColor: number[] | undefined;
  mousePoint: [number, number] | undefined;
  selectedTweetIds: string[];
  tweets: Tweet[];
  displayOptions: DisplayOptions;
  setPixelColor: (value: Color | undefined) => void;
  setMousePoint: (value: [number, number] | undefined) => void;
  setSelectedTweetIds: (value: string[]) => void;
}

const IllustGroup = ({
  isShiftKeyPressed,
  pixelColor,
  mousePoint,
  selectedTweetIds,
  tweets,
  displayOptions,
  setPixelColor,
  setMousePoint,
  setSelectedTweetIds,
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

  const onClickTweet = async (e: React.MouseEvent, id: string) => {
    // color picker
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
                  onClick={(e) => onClickTweet(e, tweet.id)}
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
