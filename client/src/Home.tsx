import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AddTweet from "./components/AddTweet";
import IllustList from "./components/IllustList";
import SideNav from "./components/SideNav";
import Status from "./components/Status";
import TweetPanel from "./components/TweetPanel";
import { Tweet, Work } from "./const/types";
import { getCommonTags, getTweets, getWorks } from "./utils/api";
import { getCharacterId } from "./utils/utils";

const mainLeft = 220;

const Page = styled.div`
  color: #333;
  background: #f9f9f9;
`;

const SideNavWrapper = styled.div`
  width: 220px;
  position: fixed;
  top: 0;
  left: 0;
`;

const Main = styled.main`
  margin-left: ${mainLeft}px;
  margin-right: 320px;
`;

const TweetWrapper = styled.div`
  width: 300px;
  position: fixed;
  top: 0;
  right: 0;
`;

const StatusWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: ${mainLeft}px;
`;

const AddTweetWrapper = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1;
`;

const Home = () => {
  const [originalTweets, setOriginalTweets] = useState<Tweet[]>([]);
  const [selectedTweetIds, setSelectedTweetIds] = useState<string[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [tagHues, setTagHues] = useState<{ [key in string]: number }>({});
  const [commonTags, setCommonTags] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [rowCount, setRowCount] = useState(3);

  useEffect(() => {
    (async () => {
      // works, tags
      const works = await getWorks();
      const hues: { [key in string]: number } = {};
      let i = 0;
      for (const work of works) {
        for (const character of work.characters) {
          hues[getCharacterId(work, character)] = i;
          i += 20;
        }
      }
      setWorks(works);
      setTagHues(hues);
      setCommonTags(await getCommonTags());

      // tweets
      setOriginalTweets(await getTweets());
    })();
  }, []);

  const selectedTweet =
    selectedTweetIds.length > 0
      ? originalTweets.find((tweet) => tweet.id === selectedTweetIds[0])
      : undefined;

  return (
    <Page>
      <SideNavWrapper>
        <SideNav
          works={works}
          tagHues={tagHues}
          commonTags={commonTags}
          selectedCharacters={selectedCharacters}
          keyword={keyword}
          setSelectedCharacters={setSelectedCharacters}
          setKeyword={setKeyword}
        />
      </SideNavWrapper>
      <Main>
        <IllustList
          originalTweets={originalTweets}
          selectedTweetIds={selectedTweetIds}
          selectedCharacters={selectedCharacters}
          keyword={keyword}
          rowCount={rowCount}
          setSelectedTweetIds={setSelectedTweetIds}
        />
      </Main>
      <TweetWrapper>
        <TweetPanel
          selectedTweet={selectedTweet}
          rowCount={rowCount}
          setKeyword={setKeyword}
          setRowCount={setRowCount}
        />
      </TweetWrapper>
      <StatusWrapper>
        <Status />
      </StatusWrapper>
      <AddTweetWrapper>
        <AddTweet />
      </AddTweetWrapper>
    </Page>
  );
};

export default Home;
