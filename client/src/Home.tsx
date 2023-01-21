import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import AddTweet from "./components/AddTweet";
import IllustList from "./components/IllustList";
import SideNav from "./components/SideNav";
import Status from "./components/Status";
import TweetPanel from "./components/TweetPanel";
import { breakpoint0, breakpoint1 } from "./const/styles";
import {
  getCommonTags,
  getTweets,
  getTweetToTags,
  getWorks,
  Tweet,
  TweetToTag,
  Work,
} from "./utils/api";
import { getCharacterTag, FilterMethod, getAllTags } from "./utils/utils";

const SideNavWidth = 220;
const TweetPanelWidth = 300;

const Page = styled.div`
  color: #333;
  background: #fcfcfc;
`;

const SideNavWrapper = styled.div`
  width: ${SideNavWidth}px;
  position: fixed;
  top: 0;
  left: 0;

  @media screen and (max-width: ${breakpoint1}px) {
    display: none;
  }
`;

const Main = styled.main`
  padding: 0 20px 0 0;
  margin-left: ${SideNavWidth}px;
  margin-right: ${TweetPanelWidth}px;

  @media screen and (max-width: ${breakpoint1}px) {
    margin-left: 20px;
  }

  @media screen and (max-width: ${breakpoint0}px) {
    margin-right: 0;
  }
`;

const TweetWrapper = styled.div`
  width: ${TweetPanelWidth}px;
  position: fixed;
  top: 0;
  right: 0;

  @media screen and (max-width: ${breakpoint0}px) {
    display: none;
  }
`;

const StatusWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: ${SideNavWidth}px;

  @media screen and (max-width: ${breakpoint1}px) {
    left: 20px;
  }
`;

const AddTweetWrapper = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1;
`;

const Home = () => {
  const [searchParams, _] = useSearchParams();

  const [originalTweets, setOriginalTweets] = useState<Tweet[]>([]);
  const [selectedTweetIds, setSelectedTweetIds] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [columnCount, setColumnCount] = useState(3);
  const [isShiftKeyPressed, setShiftKeyPressed] = useState(false);

  // tag
  const [works, setWorks] = useState<Work[]>([]);
  const [commonTags, setCommonTags] = useState<string[]>([]);
  const [tagHues, setTagHues] = useState<{ [key in string]: number }>({});
  const [tweetToTags, setTweetToTags] = useState<TweetToTag>({});

  // filter
  const [filterMethod, setFilterMethod] = useState<FilterMethod>("or");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [onlyUnrelated, setOnlyUnrelated] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      // tag
      const works = await getWorks();
      const hues: { [key in string]: number } = {};
      let i = 0;
      for (const work of works) {
        for (const character of work.characters) {
          hues[getCharacterTag(work, character)] = i;
          i += 20;
        }
      }
      const tempCommonTags = await getCommonTags();
      setWorks(works);
      setTagHues(hues);
      setCommonTags(tempCommonTags);

      // tweet, tweet-tag
      setOriginalTweets(await getTweets());
      setTweetToTags(await getTweetToTags());

      // params
      if (searchParams.has("tags")) {
        setSelectedTags(
          searchParams
            .get("tags")!
            .split("+")
            .filter((tag) => getAllTags(works, tempCommonTags).includes(tag))
        );
      }
      if (searchParams.has("filterMethod")) {
        setFilterMethod(
          searchParams.get("filterMethod") === "and" ? "and" : "or"
        );
      }
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
          commonTags={commonTags}
          tagHues={tagHues}
          tweetToTags={tweetToTags}
          selectedTweetIds={selectedTweetIds}
          selectedTags={selectedTags}
          keyword={keyword}
          filterMethod={filterMethod}
          onlyUnrelated={onlyUnrelated}
          setTweetToTags={setTweetToTags}
          setSelectedTags={setSelectedTags}
          setKeyword={setKeyword}
          setFilterMethod={setFilterMethod}
          setOnlyUnrelated={setOnlyUnrelated}
          setSelectedTweetIds={setSelectedTweetIds}
        />
      </SideNavWrapper>
      <Main>
        <IllustList
          originalTweets={originalTweets}
          tweetToTags={tweetToTags}
          keyword={keyword}
          columnCount={columnCount}
          filterMethod={filterMethod}
          selectedTweetIds={selectedTweetIds}
          selectedTags={selectedTags}
          onlyUnrelated={onlyUnrelated}
          isShiftKeyPressed={isShiftKeyPressed}
          setSelectedTweetIds={setSelectedTweetIds}
        />
      </Main>
      <TweetWrapper>
        <TweetPanel
          selectedTweet={selectedTweet}
          columnCount={columnCount}
          setKeyword={setKeyword}
          setColumnCount={setColumnCount}
        />
      </TweetWrapper>
      <StatusWrapper>
        <Status
          selectedTweetIds={selectedTweetIds}
          isShiftKeyPressed={isShiftKeyPressed}
          setShiftKeyPressed={setShiftKeyPressed}
        />
      </StatusWrapper>
      <AddTweetWrapper>
        <AddTweet />
      </AddTweetWrapper>
    </Page>
  );
};

export default Home;
