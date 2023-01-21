import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import KeywordInput from "./KeywordInput";
import Tag from "./Tag";
import { linkColor } from "@/const/styles";
import { addTweetTag, deleteTweetTag, TweetToTag, Work } from "@/utils/api";
import {
  getCharacterTag,
  FilterMethod,
  getAllTags,
  splitCharacterTag,
} from "@/utils/utils";

const Wrapper = styled.nav`
  height: 100vh;
  padding: 0 20px;
  overflow-y: scroll;
`;

const Content = styled.div`
  font-size: 14px;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const KeywordDescription = styled.div`
  margin-bottom: 4px;
`;

const Header = styled.header`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const H3 = styled.h3`
  line-height: 16px;
  color: "#333";
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 6px 0;
`;

const FilterTypeList = styled.ul`
  list-style: none;
  margin: 0 0 2px 0;
  padding: 0;
  border: solid 1px #666;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
`;

const FilterType = styled.li<{ selected: boolean }>`
  color: ${(props) => (props.selected ? "#fff" : linkColor)};
  text-align: center;
  flex-basis: 50%;
  cursor: pointer;
  background: ${(props) => (props.selected ? linkColor : "transparent")};

  &:hover {
    background: ${(props) => (props.selected ? linkColor : "#eee")};
  }
`;

const Option = styled.a`
  color: ${linkColor};
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: #eee;
  text-underline-offset: 4px;

  &:hover {
    text-decoration-color: #ccc;
  }
`;

const WorkList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WorkItem = styled.div`
  line-height: 18px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: #666;
  }
`;

const TagList = styled.ul`
  margin: 4px 0px 0 -30px;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: margin 0.15s ease-out;
`;

interface SideNavProps {
  works: Work[];
  commonTags: string[];
  tagHues: { [key in string]: number };
  tweetToTags: TweetToTag;
  selectedTweetIds: string[];
  selectedTags: string[];
  keyword: string;
  filterMethod: FilterMethod;
  onlyUnrelated: boolean;
  setTweetToTags: (value: TweetToTag) => void;
  setSelectedTags: (value: string[]) => void;
  setKeyword: (value: string) => void;
  setFilterMethod: (value: FilterMethod) => void;
  setOnlyUnrelated: (value: boolean) => void;
}

const SideNav = ({
  works,
  commonTags,
  tagHues,
  tweetToTags,
  selectedTweetIds,
  selectedTags,
  keyword,
  filterMethod,
  onlyUnrelated,
  setTweetToTags,
  setSelectedTags,
  setKeyword,
  setFilterMethod,
  setOnlyUnrelated,
}: SideNavProps) => {
  const [_, setSearchParams] = useSearchParams();
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

  const updateParams = ({
    newFilterMethod,
    newTags,
  }: {
    newFilterMethod?: string;
    newTags?: string[];
  }) => {
    const tempTags = newTags || selectedTags;
    const params: { filterMethod: string; tags?: string } = {
      filterMethod: newFilterMethod || filterMethod,
    };
    if (tempTags.length > 0) {
      params.tags = tempTags.join("+");
    }
    setSearchParams(params);
  };

  const switchSelect = (id: string) => {
    const tags = selectedTags.includes(id)
      ? selectedTags.filter((tag) => tag !== id)
      : [...selectedTags, id];
    const filteredTags = tags.filter((tag) => tag.length > 0);
    setSelectedTags(filteredTags);
    updateParams({ newTags: filteredTags });
  };

  const switchSelectWork = (work: string) => {
    const targetWork = works.find((inWork) => inWork.title === work);
    if (targetWork) {
      const tags = targetWork.characters.map((character) =>
        getCharacterTag(targetWork, character)
      );
      const newTags = tags.every((tag) => selectedTags.includes(tag))
        ? selectedTags.filter((tag) => splitCharacterTag(tag).work !== work)
        : Array.from(new Set([...selectedTags, ...tags]));
      setSelectedTags(newTags);
      updateParams({ newTags });
    }
  };

  const switchFilterMethod = (method: FilterMethod) => {
    setFilterMethod(method);
    updateParams({ newFilterMethod: method });
  };

  const switchAssociation = (tag: string) => {
    const alreadyExsits = associatedTags.includes(tag);

    // update the data
    if (alreadyExsits) {
      deleteTweetTag(selectedTweetIds, [tag]);
    } else {
      addTweetTag(selectedTweetIds, [tag]);
    }

    // display
    const newTweetToTags: TweetToTag = {
      ...selectedTweetIds.reduce(
        (previous, id) => ({ ...previous, [id]: [] }),
        {}
      ),
      ...tweetToTags,
    };
    for (const id of selectedTweetIds) {
      newTweetToTags[id] = alreadyExsits
        ? newTweetToTags[id].filter((inTag) => inTag !== tag)
        : [...newTweetToTags[id], tag];
    }
    setTweetToTags(newTweetToTags);
  };

  const clear = () => {
    setSelectedTags([]);
    setSearchParams({});
  };

  return (
    <Wrapper>
      <Content>
        <div>
          <label>
            <KeywordDescription>キーワード検索</KeywordDescription>
            <KeywordInput
              type="search"
              value={keyword}
              placeholder="ツイート本文から検索"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <Header>
            <H3>絞り込み</H3>
            <FilterTypeList>
              <FilterType
                selected={filterMethod === "and"}
                onClick={() => switchFilterMethod("and")}
              >
                AND
              </FilterType>
              <FilterType
                selected={filterMethod === "or"}
                onClick={() => switchFilterMethod("or")}
              >
                OR
              </FilterType>
            </FilterTypeList>
            <Option onClick={clear}>絞り込みを解除</Option>
            <Option onClick={() => setOnlyUnrelated(!onlyUnrelated)}>
              {onlyUnrelated ? "元に戻す" : "タグ未設定のみ表示"}
            </Option>
          </Header>
          <WorkList>
            {works.map((work) => (
              <li key={work.title}>
                <WorkItem onClick={() => switchSelectWork(work.title)}>
                  {work.title}
                </WorkItem>
                <TagList>
                  {work.characters.map((character) => {
                    const tag = getCharacterTag(work, character);
                    return (
                      <Tag
                        selected={selectedTags.includes(tag)}
                        tweetAssociated={associatedTags.includes(tag)}
                        hue={tagHues[tag]}
                        label={character}
                        onClickBody={() => switchSelect(tag)}
                        onClickPlus={() => switchAssociation(tag)}
                        key={tag}
                      />
                    );
                  })}
                </TagList>
              </li>
            ))}
          </WorkList>
        </div>
        <div>
          <TagList>
            {commonTags.map((tag) => (
              <Tag
                selected={false}
                tweetAssociated={false}
                hue={0}
                label={tag}
                key={tag}
              />
            ))}
          </TagList>
        </div>
      </Content>
    </Wrapper>
  );
};

export default SideNav;
