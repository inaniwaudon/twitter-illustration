import React from "react";
import styled from "styled-components";
import Readme from "@/components/Readme";
import { linkColor } from "@/const/styles";
import { Tweet } from "@/const/types";
import { getImageEndpoint } from "@/utils/api";

const Wrapper = styled.div`
  height: calc(100vh - 40px);
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
`;

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

interface TweetProps {
  selectedTweet: Tweet | undefined;
  rowCount: number;
  setKeyword: (value: string) => void;
  setRowCount: (value: number) => void;
}

const TweetPanel = ({
  selectedTweet,
  rowCount,
  setKeyword,
  setRowCount,
}: TweetProps) => {
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

  const updateRowCount = (value: string) => {
    setRowCount(
      Number.isNaN(parseInt(value)) ? 1 : Math.max(parseInt(value), 1)
    );
  };

  return (
    <Wrapper>
      {selectedTweet ? (
        <>
          <header>
            <Name>{selectedTweet["User.name"]}</Name>
            <ScreenName
              onClick={() => setKeyword(`@${selectedTweet["User.screenName"]}`)}
            >
              @{selectedTweet["User.screenName"]}
            </ScreenName>
          </header>
          <MainAnchor href={url}>
            <p>{selectedTweet.body}</p>
            <Images>
              {[...Array(selectedTweet.imageCount)].map((_, i) => (
                <img src={getImageEndpoint(selectedTweet.id, i)} key={i} />
              ))}
            </Images>
            <DateTime>
              <time>{dateStr}</time>
            </DateTime>
          </MainAnchor>
        </>
      ) : (
        <>
          列数
          <input
            type="number"
            value={rowCount}
            onChange={(e) => updateRowCount(e.target.value)}
          />
          <Readme />
        </>
      )}
    </Wrapper>
  );
};

export default TweetPanel;
