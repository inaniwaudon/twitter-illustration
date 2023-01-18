import React, { useEffect, useState } from "react";
import styled from "styled-components";
import IllustList from "./components/IllustList";
import SideNav from "./components/SideNav";
import TweetPanel from "./components/TweetPanel";
import { getTweets } from "./utils/api";
import { Tweet } from "./const/types";

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
`;

const TweetWrapper = styled.div`
  width: 300px;
  position: fixed;
  top: 0;
  right: 0;
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
        <TweetPanel selectedTweetId={selectedTweetId} />
      </TweetWrapper>
    </Page>
  );
};

export default Home;
