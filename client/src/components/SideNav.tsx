import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useKeyPressEvent } from "react-use";
import styled from "styled-components";
import KeywordInput from "./KeywordInput";
import Tag from "./Tag";
import { linkColor } from "@/const/styles";
import { Work } from "@/const/types";
import { getCharacterId, Mode } from "@/utils/utils";

const Wrapper = styled.nav`
  height: 100vh;
  padding: 0 20px;
  overflow-x: hidden;
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
`;

const HeaderTypeList = styled.ul`
  list-style: none;
  margin: 0 0 8px 0;
  padding: 0;
  display: flex;
  gap: 10px;
`;

const HeaderType = styled.li<{ selected: boolean }>`
  line-height: 16px;
  color: ${(props) => (props.selected ? "#333" : linkColor)};
  font-size: 16px;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  margin: 0;

  ${(props) =>
    !props.selected &&
    `text-decoration: underline;
  text-decoration-color: #eee;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  &:hover {
    text-decoration-color: #ccc;
    cursor: pointer;
  }`}
`;

const FilterTypeList = styled.ul`
  list-style: none;
  margin: 0 0 4px 0;
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
`;

const TagList = styled.ul<{ mode: Mode }>`
  margin: ${(props) =>
    `4px ${props.mode === "tag" ? -30 : 0}px 0 ${
      props.mode === "filter" ? -30 : 0
    }px`};
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: margin 0.15s ease-out;
`;

interface SideNavProps {
  works: Work[];
  tagHues: { [key in string]: number };
  commonTags: string[];
  selectedCharacters: string[];
  keyword: string;
  setSelectedCharacters: (value: string[]) => void;
  setKeyword: (value: string) => void;
}

const SideNav = ({
  works,
  tagHues,
  commonTags,
  selectedCharacters,
  keyword,
  setSelectedCharacters,
  setKeyword,
}: SideNavProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>("filter");
  const [originalMode, setOriginalMode] = useState<Mode>("filter");
  const [filterType, setFilterType] = useState<"and" | "or">("or");

  useEffect(() => {
    (async () => {
      if (searchParams.has("characters")) {
        setSelectedCharacters(searchParams.get("characters")!.split("+"));
      }
    })();
  }, []);

  useKeyPressEvent(
    "Meta",
    () => {
      setMode("tag");
    },
    () => {
      setMode(originalMode);
    }
  );

  const switchMode = (mode: Mode) => {
    setMode(mode);
    setOriginalMode(mode);
  };

  const switchPerson = (id: string) => {
    const characters = selectedCharacters.includes(id)
      ? selectedCharacters.filter((item) => item !== id)
      : [...selectedCharacters, id];
    const trimedCharacters = characters.filter((item) => item.length > 0);
    setSelectedCharacters(trimedCharacters);
    setSearchParams({ filterType, characters: trimedCharacters.join("+") });
  };

  const clear = () => {
    setSelectedCharacters([]);
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
              onChange={(e) => setKeyword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <Header>
            <HeaderTypeList>
              <HeaderType
                selected={mode === "filter"}
                onClick={() => switchMode("filter")}
              >
                絞り込み
              </HeaderType>
              <HeaderType
                selected={mode === "tag"}
                onClick={() => switchMode("tag")}
              >
                タグ付け
              </HeaderType>
            </HeaderTypeList>
            <FilterTypeList>
              <FilterType
                selected={filterType === "and"}
                onClick={() => setFilterType("and")}
              >
                AND
              </FilterType>
              <FilterType
                selected={filterType === "or"}
                onClick={() => setFilterType("or")}
              >
                OR
              </FilterType>
            </FilterTypeList>
            <Option onClick={clear}>絞り込みを解除</Option>
            <Option>タグ未設定のみ表示</Option>
          </Header>
          <WorkList>
            {works.map((work) => (
              <li key={work.title}>
                <WorkItem>{work.title}</WorkItem>
                <TagList mode={mode}>
                  {work.characters.map((character) => {
                    const id = getCharacterId(work, character);
                    return (
                      <Tag
                        hue={tagHues[id]}
                        selected={selectedCharacters.includes(id)}
                        onClick={() => switchPerson(id)}
                        label={character}
                        mode={mode}
                        key={id}
                      />
                    );
                  })}
                </TagList>
              </li>
            ))}
          </WorkList>
        </div>
        <div>
          <TagList mode={mode}>
            {commonTags.map((tag) => (
              <Tag hue={0} selected={false} label={tag} mode={mode} key={tag} />
            ))}
          </TagList>
        </div>
      </Content>
    </Wrapper>
  );
};

export default SideNav;
