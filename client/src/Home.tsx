import React, { useEffect, useState } from "react";
import styled from "styled-components";
import IllustList from "./components/IllustList";
import SideNav from "./components/SideNav";
import TweetPanel from "./components/TweetPanel";
import { getTweets } from "./utils/api";
import { Tweet } from "./const/types";
import AddTweet from "./components/AddTweet";

const Page = styled.div`
  background: #f9f9f9;
`;

const SideNavWrapper = styled.div`
  width: 220px;
  position: fixed;
  top: 0;
  left: 0;
`;

const Main = styled.main`
  margin-left: 240px;
  margin-right: 320px;
`;

const TweetWrapper = styled.div`
  width: 300px;
  position: fixed;
  top: 0;
  right: 0;
`;

const Plus = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  background: #069;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1;
`;

const AddTweetWrapper = styled.div`
  width: 400px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  position: fixed;
  right: 20px;
  bottom: 74px;
  z-index: 1;
`;

const Home = () => {
  const [originalTweets, setOriginalTweets] = useState<Tweet[]>([]);
  const [selectedTweetId, setSelectedTweetId] = useState<string>();
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setOriginalTweets(await getTweets());
    })();
  }, []);

  return (
    <Page>
      <SideNavWrapper>
        <SideNav
          selectedCharacters={selectedCharacters}
          setSelectedCharacters={setSelectedCharacters}
        />
      </SideNavWrapper>
      <Main>
        <IllustList
          originalTweets={originalTweets}
          selectedTweetId={selectedTweetId}
          selectedCharacters={selectedCharacters}
          setSelectedTweetId={setSelectedTweetId}
        />
      </Main>
      <TweetWrapper>
        <TweetPanel
          selectedTweet={originalTweets.find(
            (tweet) => tweet.id === selectedTweetId
          )}
        />
      </TweetWrapper>
      <Plus>＋</Plus>
      <AddTweetWrapper>
        <AddTweet />
      </AddTweetWrapper>
    </Page>
  );
};

export default Home;
