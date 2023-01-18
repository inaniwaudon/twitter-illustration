import React from "react";
import styled from "styled-components";
import { Tweet } from "@/const/types";
import { getImageEndpoint } from "@/utils/api";

const Wrapper = styled.div`
  height: calc(100vh - 40px);
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;

  a {
    color: #333;
    text-decoration: none;
  }
`;

const Name = styled.p`
  font-weight: bold;
  margin: 0;
`;

const ScreenName = styled.p`
  color: #666;
  margin: 0;
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

interface TweetProps {
  selectedTweet: Tweet | undefined;
}

const TweetPanel = ({ selectedTweet }: TweetProps) => {
  let dateStr = "";
  if (selectedTweet) {
    const date = new Date(selectedTweet.createdAt);
    const hours =
      date.getHours() > 12
        ? "午後" + (date.getHours() - 12)
        : "午前" + date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    dateStr = `${hours}:${minutes}・${date.getFullYear()}年${
      date.getMonth() + 1
    }月${date.getDay()}日`;
  }
  const url = selectedTweet
    ? `https://twitter.com/${selectedTweet["User.screenName"]}/status/${selectedTweet.id}`
    : "";

  return (
    <Wrapper>
      {selectedTweet ? (
        <>
          <a href={url}>
            <header>
              <Name>{selectedTweet["User.name"]}</Name>
              <ScreenName>@{selectedTweet["User.screenName"]}</ScreenName>
            </header>
            <p>{selectedTweet.body}</p>
            <Images>
              {[...Array(selectedTweet.imageCount)].map((_, i) => (
                <img src={getImageEndpoint(selectedTweet.id, i)} key={i} />
              ))}
            </Images>
            <DateTime>
              <time>{dateStr}</time>
            </DateTime>
          </a>
        </>
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

export default TweetPanel;
