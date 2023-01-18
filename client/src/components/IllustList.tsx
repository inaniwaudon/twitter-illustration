import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Tweet } from "@/const/types";
import { getImageEndpoint } from "@/utils/api";

const Wrapper = styled.div`
  width: 680px;
  height: calc(100vh - 40px);
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Row = styled.div`
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Illust = styled.div<{ height: number; selected: boolean }>`
  height: auto;
  flex-shrink: 0;
  flex-grow: 0;
  border: ${(props) => (props.selected ? "solid 2px #c03" : "none")};
`;

const Image = styled.img`
  width: 100%;
  vertical-align: top;
`;

interface IllustListProps {
  originalTweets: Tweet[];
  selectedTweetId: string | undefined;
  selectedCharacters: string[];
  setSelectedTweetId: (value: string | undefined) => void;
}

const IllustList = ({
  originalTweets,
  selectedTweetId,
  selectedCharacters,
  setSelectedTweetId,
}: IllustListProps) => {
  const [tweetRows, setTweetRows] = useState<Tweet[][]>([]);

  useEffect(() => {
    (async () => {
      const rows = 3;
      const filteredTweets = originalTweets.filter((tweet) =>
        selectedCharacters.some((selectedCharacter) =>
          tweet.characters
            .map((tweetCharacter) => tweet.work + "/" + tweetCharacter)
            .includes(selectedCharacter)
        )
      );
      setTweetRows(
        [...Array(rows)].map((_, i) =>
          filteredTweets.filter((_, j) => j % rows === i)
        )
      );
    })();
  }, [originalTweets, selectedCharacters]);

  const onClickTweet = (id: string) => {
    setSelectedTweetId(id);
  };

  return (
    <Wrapper>
      {tweetRows.map((row, i) => (
        <Row key={i}>
          {row.map((tweet) => (
            <Illust
              height={200}
              selected={tweet.id === selectedTweetId}
              onClick={() => onClickTweet(tweet.id)}
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
