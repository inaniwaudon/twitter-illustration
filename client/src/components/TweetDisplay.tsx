import React from "react";
import styled from "styled-components";
import { linkColor } from "@/const/styles";
import { getImageEndpoint, Tweet } from "@/utils/api";

const Name = styled.p`
  font-weight: bold;
  margin: 0;
`;

const ScreenName = styled.a`
  color: ${linkColor};
  color: #666;
  font-size: 14px;
  text-decoration: underline;
  text-decoration-color: #eee;
  text-underline-offset: 4px;
  cursor: pointer;

  &:hover {
    text-decoration-color: #ccc;
  }
`;

const MainAnchor = styled.a`
  color: inherit;
  text-decoration: none;
`;

const Images = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DateTime = styled.p`
  color: #666;
  font-size: 14px;
  margin: 10px 0 0 0;
`;

interface TweetDisplayProps {
  selectedTweet: Tweet;
  setKeyword: (value: string) => void;
}

const TweetDisplay = ({ selectedTweet, setKeyword }: TweetDisplayProps) => {
  const url = selectedTweet
    ? `https://twitter.com/${selectedTweet.User.screenName}/status/${selectedTweet.id}`
    : "";

  const date = new Date(selectedTweet.tweetCreatedAt);
  const hours =
    date.getHours() > 12
      ? "午後" + (date.getHours() - 12)
      : "午前" + date.getHours();
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const dateStr = `${hours}:${minutes}・${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDay()}日`;

  return (
    <>
      <header>
        <Name>{selectedTweet.User.name}</Name>
        <ScreenName
          onClick={() => setKeyword(`@${selectedTweet.User.screenName}`)}
        >
          @{selectedTweet.User.screenName}
        </ScreenName>
      </header>
      <MainAnchor href={url} target="_blank">
        <p>{selectedTweet.body}</p>
        <Images>
          {[...Array(selectedTweet.Images.length)].map((_, i) => (
            <img src={getImageEndpoint(selectedTweet.id, i)} key={i} />
          ))}
        </Images>
        <DateTime>
          <time>{dateStr}</time>
        </DateTime>
      </MainAnchor>
    </>
  );
};

export default TweetDisplay;
