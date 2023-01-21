import React from "react";
import styled from "styled-components";
import Readme from "./Readme";
import TweetDisplay from "./TweetDisplay";
import { defaultBoxShadow } from "@/const/styles";
import { Tweet } from "@/utils/api";

const Wrapper = styled.div`
  height: calc(100vh - 40px);
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
`;

const Setting = styled.div`
  margin-bottom: 20px;
`;

const SettingItem = styled.label`
  line-height: 26px;
  display: flex;
  gap: 4px;
`;

const SettingLabel = styled.div`
  width: 40px;
`;

const Input = styled.input`
  height: 26px;
  padding: 0 0 0 8px;
  border-radius: 4px;
  border: none;
  box-shadow: ${defaultBoxShadow};
  box-sizing: content-box;
  appearance: none;
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
          <Setting>
            <SettingItem>
              <SettingLabel>列数</SettingLabel>
              <Input
                type="number"
                value={columnCount}
                onChange={(e) => updateRowCount(e.target.value)}
              />
            </SettingItem>
          </Setting>
          <Readme />
        </>
      )}
    </Wrapper>
  );
};

export default TweetPanel;
