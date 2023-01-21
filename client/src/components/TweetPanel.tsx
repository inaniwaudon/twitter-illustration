import React from "react";
import styled from "styled-components";
import Readme from "./Readme";
import TweetDisplay from "./TweetDisplay";
import { defaultBoxShadow } from "@/const/styles";
import { Tweet } from "@/utils/api";
import { DisplayOptions } from "@/utils/utils";

const Wrapper = styled.div`
  height: calc(100vh - 40px);
  font-size: 14px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
`;

const Setting = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  displayOptions: DisplayOptions;
  setKeyword: (value: string) => void;
  setDisplayOptions: (value: DisplayOptions) => void;
}

const TweetPanel = ({
  selectedTweet,
  displayOptions,
  setKeyword,
  setDisplayOptions,
}: TweetProps) => {
  const updateRowCount = (value: string) => {
    setDisplayOptions({
      ...displayOptions,
      columns: Number.isNaN(parseInt(value)) ? 1 : Math.max(parseInt(value), 1),
    });
  };

  const updateIsSquare = (value: boolean) => {
    setDisplayOptions({ ...displayOptions, isSquare: value });
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
                value={displayOptions.columns}
                onChange={(e) => updateRowCount(e.target.value)}
              />
            </SettingItem>
            <SettingItem>
              <input
                type="checkbox"
                checked={displayOptions.isSquare}
                onChange={(e) => updateIsSquare(e.target.checked)}
              />
              正方形で表示する
            </SettingItem>
          </Setting>
          <Readme />
        </>
      )}
    </Wrapper>
  );
};

export default TweetPanel;
