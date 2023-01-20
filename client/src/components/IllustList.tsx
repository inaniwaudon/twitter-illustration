import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { defaultBoxShadow } from "@/const/styles";
import { Tweet } from "@/const/types";
import { getImageEndpoint } from "@/utils/api";

const Wrapper = styled.div`
  height: calc(100vh - 40px);
  padding: 20px 0;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: flex-start;
`;

const Row = styled.div<{ rowCount: number }>`
  flex-basis: ${(props) => 100 / props.rowCount}%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Illust = styled.div<{ height: number; selected: boolean }>`
  height: auto;
  flex-shrink: 0;
  flex-grow: 0;
  border-radius: 2px;
  box-shadow: ${(props) =>
    props.selected ? "0 1px 10px rgba(0, 0, 0, 0.2)" : defaultBoxShadow};
  overflow: hidden;
  transform: scale(${(props) => (props.selected ? 0.9 : 1.0)});
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: ${(props) =>
      props.selected
        ? "0 1px 12px rgba(0, 0, 0, 0.2)"
        : "0 1px 4px rgba(0, 0, 0, 0.2)"};
    transform: scale(${(props) => (props.selected ? 0.89 : 0.98)});
  }
`;

const Image = styled.img`
  width: 100%;
  vertical-align: top;
`;

interface IllustListProps {
  originalTweets: Tweet[];
  selectedTweetIds: string[];
  selectedCharacters: string[];
  keyword: string;
  rowCount: number;
  setSelectedTweetIds: (value: string[]) => void;
}

const IllustList = ({
  originalTweets,
  selectedTweetIds,
  selectedCharacters,
  keyword,
  rowCount,
  setSelectedTweetIds,
}: IllustListProps) => {
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const keywordFilteredTweets =
        keyword.length > 0
          ? keyword.startsWith("@")
            ? originalTweets.filter((tweet) =>
                tweet.User.screenName.startsWith(keyword.slice(1))
              )
            : originalTweets.filter((tweet) => tweet.body.includes(keyword))
          : originalTweets;
      /*const filteredTweets = originalTweets.filter((tweet) =>
        selectedCharacters.some((selectedCharacter) =>
          tweet.characters
            .map((tweetCharacter) => tweet.work + "/" + tweetCharacter)
            .includes(selectedCharacter)
        )
      );*/
      setFilteredTweets(keywordFilteredTweets);
    })();
  }, [originalTweets, selectedCharacters, keyword]);

  const tweetRows = useMemo(() => {
    // TODO: height
    return [...Array(rowCount)].map((_, i) =>
      filteredTweets.filter((_, j) => j % rowCount === i)
    );
  }, [filteredTweets, rowCount]);

  const onClickTweet = (e: React.MouseEvent, id: string) => {
    setSelectedTweetIds(
      e.shiftKey
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
        <Row rowCount={rowCount} key={i}>
          {row.map((tweet) => (
            <Illust
              height={200}
              selected={selectedTweetIds.includes(tweet.id)}
              onClick={(e) => onClickTweet(e, tweet.id)}
              key={tweet.id}
            >
              <Image src={getImageEndpoint(tweet.id, 0)} alt="" />
            </Illust>
          ))}
        </Row>
      ))}
    </Wrapper>
  );
};

export default IllustList;
