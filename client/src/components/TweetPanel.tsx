import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
`;

interface TweetProps {
  selectedTweetId: string | undefined;
}

const TweetPanel = ({ selectedTweetId }: TweetProps) => {
  return <Wrapper>{selectedTweetId}</Wrapper>;
};

export default TweetPanel;
