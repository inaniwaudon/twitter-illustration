import React from "react";
import styled from "styled-components";
import Readme from "./Readme";
import Settings from "./Settings";
import TweetDisplay from "./TweetDisplay";
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

const SettingsWrapper = styled.div`
  margin-bottom: 20px;
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
}: TweetProps) => (
  <Wrapper>
    {selectedTweet ? (
      <TweetDisplay selectedTweet={selectedTweet} setKeyword={setKeyword} />
    ) : (
      <SettingsWrapper>
        <Settings
          displayOptions={displayOptions}
          setDisplayOptions={setDisplayOptions}
        />
        <Readme />
      </SettingsWrapper>
    )}
  </Wrapper>
);

export default TweetPanel;
