import React, { useEffect, useMemo, useState } from "react";
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
import {
  getCharacterTag,
  getAllTags,
  switchAssociation,
  DisplayOptions,
  FilterMethod,
  SearchParams,
} from "./utils/utils";

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
  const [originalTweets, setOriginalTweets] = useState<Tweet[]>([]);
  const [deletedTweetIds, setDeletedTweetIds] = useState<string[]>([]);
  const [selectedTweetIds, setSelectedTweetIds] = useState<string[]>([]);
  const [displayOptions, _setDisplayOptions] = useState<DisplayOptions>({
    isSquare: false,
    columns: 3,
    tweetsPerPage: 100,
  });
  const [isShiftKeyPressed, setShiftKeyPressed] = useState(false);

  const setDisplayOptions = (value: DisplayOptions) => {
    localStorage.setItem("displayOptions", JSON.stringify(value));
    _setDisplayOptions(value);
  };

  // searchParams
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = ({
    newFilterMethod,
    newTags,
    newKeyword,
  }: SearchParams) => {
    const tempTags = newTags || selectedTags;
    const tempKeyword = newKeyword || keyword;
    const params: { filterMethod: string; tags?: string; keyword?: string } = {
      filterMethod: newFilterMethod || filterMethod,
    };
    if (tempTags.length > 0) {
      params.tags = tempTags.join("+");
    }
    if (tempKeyword.length > 0) {
      params.keyword = tempKeyword;
    }
    setSearchParams(params);
  };

  // keyword
  const [keyword, setKeyword] = useState<string>("");

  const updateKeyword = (value: string) => {
    setKeyword(value);
    updateSearchParams({ newKeyword: value });
  };

  // tag
  const [works, setWorks] = useState<Work[]>([]);
  const [commonTags, setCommonTags] = useState<string[]>([]);
  const [tagHues, setTagHues] = useState<{ [key in string]: number }>({});
  const [tweetToTags, setTweetToTags] = useState<TweetToTag>({});
  const allTags = getAllTags(works, commonTags);

  const associatedTags = useMemo(() => {
    if (
      selectedTweetIds.length === 0 ||
      !selectedTweetIds.every((id) => id in tweetToTags)
    ) {
      return [];
    }
    return allTags.filter((tag) =>
      selectedTweetIds.every((id) => tweetToTags[id].includes(tag))
    );
  }, [allTags, selectedTweetIds, tweetToTags]);

  const inSwitchAssociation = (tag: string) => {
    setTweetToTags(
      switchAssociation(selectedTweetIds, tag, associatedTags, tweetToTags)
    );
  };

  // filter
  const [filterMethod, setFilterMethod] = useState<FilterMethod>("or");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [onlyUnrelated, setOnlyUnrelated] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      // display options
      const localDisplayOptions = localStorage.getItem("displayOptions");
      if (localDisplayOptions) {
        try {
          const parsedOptions = JSON.parse(localDisplayOptions);
          if (
            parsedOptions instanceof Object &&
            !Array.isArray(parsedOptions) &&
            typeof parsedOptions.isSquare === "boolean" &&
            Number.isInteger(parsedOptions.columns)
          ) {
            setDisplayOptions(parsedOptions);
          }
        } catch {
          // ignore
        }
      }

      // tag
      const works = await getWorks();
      const tempCommonTags = await getCommonTags();
      const hues: { [key in string]: number } = {};
      let i = 0;
      for (const work of works) {
        for (const character of work.characters) {
          hues[getCharacterTag(work, character)] = i;
          i += 20;
        }
      }
      setWorks(works);
      setTagHues(hues);
      setCommonTags(tempCommonTags);

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
      if (searchParams.has("keyword")) {
        setKeyword(searchParams.get("keyword")!);
      }

      // tweet, tweet-tag
      setOriginalTweets(await getTweets());
      setTweetToTags(await getTweetToTags());
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
          selectedTags={selectedTags}
          associatedTags={associatedTags}
          keyword={keyword}
          filterMethod={filterMethod}
          onlyUnrelated={onlyUnrelated}
          setSelectedTags={setSelectedTags}
          updateKeyword={updateKeyword}
          setFilterMethod={setFilterMethod}
          setOnlyUnrelated={setOnlyUnrelated}
          setSelectedTweetIds={setSelectedTweetIds}
          inSwitchAssociation={inSwitchAssociation}
          updateSearchParams={updateSearchParams}
        />
      </SideNavWrapper>
      <Main>
        <IllustList
          originalTweets={originalTweets}
          deletedTweetIds={deletedTweetIds}
          tweetToTags={tweetToTags}
          works={works}
          keyword={keyword}
          displayOptions={displayOptions}
          filterMethod={filterMethod}
          selectedTweetIds={selectedTweetIds}
          selectedTags={selectedTags}
          associatedTags={associatedTags}
          onlyUnrelated={onlyUnrelated}
          isShiftKeyPressed={isShiftKeyPressed}
          setSelectedTweetIds={setSelectedTweetIds}
          inSwitchAssociation={inSwitchAssociation}
        />
      </Main>
      <TweetWrapper>
        <TweetPanel
          selectedTweet={selectedTweet}
          displayOptions={displayOptions}
          updateKeyword={updateKeyword}
          setDisplayOptions={setDisplayOptions}
        />
      </TweetWrapper>
      <StatusWrapper>
        <Status
          selectedTweetIds={selectedTweetIds}
          deletedTweetIds={deletedTweetIds}
          isShiftKeyPressed={isShiftKeyPressed}
          setShiftKeyPressed={setShiftKeyPressed}
          setDeletedTweetIds={setDeletedTweetIds}
        />
      </StatusWrapper>
      <AddTweetWrapper>
        <AddTweet />
      </AddTweetWrapper>
    </Page>
  );
};

export default Home;
