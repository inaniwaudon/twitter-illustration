import React from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import KeywordInput from "./KeywordInput";
import Tag from "./Tag";
import { linkColor } from "@/const/styles";
import { Work } from "@/utils/api";
import {
  getCharacterTag,
  getUniqueCommonTag,
  splitCharacterTag,
  FilterMethod,
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
  selectedTags: string[];
  associatedTags: string[];
  keyword: string;
  filterMethod: FilterMethod;
  onlyUnrelated: boolean;
  setSelectedTags: (value: string[]) => void;
  setKeyword: (value: string) => void;
  setFilterMethod: (value: FilterMethod) => void;
  setOnlyUnrelated: (value: boolean) => void;
  setSelectedTweetIds: (value: string[]) => void;
  inSwitchAssociation: (tag: string) => void;
}

const SideNav = ({
  works,
  commonTags,
  tagHues,
  selectedTags,
  associatedTags,
  keyword,
  filterMethod,
  onlyUnrelated,
  setSelectedTags,
  setKeyword,
  setFilterMethod,
  setOnlyUnrelated,
  setSelectedTweetIds,
  inSwitchAssociation,
}: SideNavProps) => {
  const [_, setSearchParams] = useSearchParams();

  const updateParams = ({
    newFilterMethod,
    newTags,
    newKeyword,
  }: {
    newFilterMethod?: string;
    newTags?: string[];
    newKeyword?: string;
  }) => {
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

  const updateKeyword = (value: string) => {
    setKeyword(value);
    updateParams({ newKeyword: value });
  };

  const switchSelect = (id: string) => {
    const tags = selectedTags.includes(id)
      ? selectedTags.filter((tag) => tag !== id)
      : [...selectedTags, id];
    const filteredTags = tags.filter((tag) => tag.length > 0);
    setSelectedTags(filteredTags);
    updateParams({ newTags: filteredTags });
    setSelectedTweetIds([]);
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
      setSelectedTweetIds([]);
    }
  };

  const switchFilterMethod = (method: FilterMethod) => {
    setFilterMethod(method);
    updateParams({ newFilterMethod: method });
    setSelectedTweetIds([]);
  };

  const clear = () => {
    setKeyword("");
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
              onChange={(e) => updateKeyword(e.target.value)}
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
                        label={character.name}
                        onClickBody={() => switchSelect(tag)}
                        onClickPlus={() => inSwitchAssociation(tag)}
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
            {commonTags.map((tag) => {
              const uniqueTag = getUniqueCommonTag(tag);
              return (
                <Tag
                  selected={selectedTags.includes(uniqueTag)}
                  tweetAssociated={associatedTags.includes(uniqueTag)}
                  hue={0}
                  label={tag}
                  onClickBody={() => switchSelect(uniqueTag)}
                  onClickPlus={() => inSwitchAssociation(uniqueTag)}
                  key={tag}
                />
              );
            })}
          </TagList>
        </div>
      </Content>
    </Wrapper>
  );
};

export default SideNav;
