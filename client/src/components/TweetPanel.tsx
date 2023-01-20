import React from "react";
import styled from "styled-components";
import TweetDisplay from "./TweetDisplay";
import Readme from "./Readme";
import { Tweet } from "@/utils/api";

const Wrapper = styled.div`
  height: calc(100vh - 40px);
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
`;

interface TweetProps {
  selectedTweet: Tweet | undefined;
  columnCount: number;
  setKeyword: (value: string) => void;
  setColumnCount: (value: number) => void;
}

const TweetPanel = ({
  selectedTweet,
  columnCount,
  setKeyword,
  setColumnCount,
}: TweetProps) => {
  const updateRowCount = (value: string) => {
    setColumnCount(
      Number.isNaN(parseInt(value)) ? 1 : Math.max(parseInt(value), 1)
    );
  };

  return (
    <Wrapper>
      {selectedTweet ? (
        <TweetDisplay selectedTweet={selectedTweet} setKeyword={setKeyword} />
      ) : (
        <>
          列数
          <input
            type="number"
            value={columnCount}
            onChange={(e) => updateRowCount(e.target.value)}
          />
          <Readme />
        </>
      )}
    </Wrapper>
  );
};

export default TweetPanel;
