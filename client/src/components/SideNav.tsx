import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { Work } from "@/const/types";
import { getWorks } from "@/utils/api";

const Wrapper = styled.nav`
  height: 100vh;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
`;

const KeywordInput = styled.input`
  width: calc(100% - 20px);
  padding: 4px 10px;
  border-bottom: solid 1px #ccc;
  border-top: none;
  border-left: none;
  border-right: none;
`;

const H3 = styled.h3`
  color: #333;
  font-size: 16px;
  font-weight: normal;
  margin: 0 0 4px 0;
`;

const WorkList = styled.ul`
  font-size: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WorkItem = styled.div`
  color: #333;
  font-weight: bold;
`;

const CharacterList = styled.ul`
  margin: 4px 0 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Character = styled.li<{ color: string }>`
  color: #fff;
  padding: 2px 10px;
  border-radius: 4px;
  cursor: pointer;
  background: ${(props) => props.color};
`;

const CharacterCheck = styled.span`
  width: 20px;
  display: inline-block;
`;

interface SideNavProps {
  selectedCharacters: string[];
  setSelectedCharacters: (value: string[]) => void;
}

const SideNav = ({
  selectedCharacters,
  setSelectedCharacters,
}: SideNavProps) => {
  const [works, setWorks] = useState<Work[]>([]);
  const [colors, setColors] = useState<{ [key in string]: string }>({});
  const [searchParams, setSearchParams] = useSearchParams();

  const getId = (work: Work, character: string) => work.title + "/" + character;

  useEffect(() => {
    (async () => {
      const works = await getWorks();
      const colors: { [key in string]: string } = {};
      let i = 0;
      for (const work of works) {
        for (const character of work.characters) {
          colors[getId(work, character)] = `hsl(${i}, 50%, 50%)`;
          i += 20;
        }
      }
      setWorks(works);
      setColors(colors);

      if (searchParams.has("characters")) {
        setSelectedCharacters(searchParams.get("characters")!.split("+"));
      }
    })();
  }, []);

  const switchPerson = (id: string) => {
    const characters = selectedCharacters.includes(id)
      ? selectedCharacters.filter((item) => item !== id)
      : [...selectedCharacters, id];
    const trimedCharacters = characters.filter((item) => item.length > 0);
    setSelectedCharacters(trimedCharacters);
    setSearchParams({ characters: trimedCharacters.join("+") });
  };

  return (
    <Wrapper>
      <div>
        <KeywordInput type="" />
      </div>
      <div>
        <H3>作品</H3>
        <WorkList>
          {works.map((work) => (
            <li key={work.title}>
              <WorkItem>{work.title}</WorkItem>
              <CharacterList>
                {work.characters.map((character) => {
                  const id = getId(work, character);
                  return (
                    <Character
                      color={colors[id]}
                      onClick={() => switchPerson(id)}
                      key={id}
                    >
                      <CharacterCheck>
                        {selectedCharacters.includes(id) ? "✓" : ""}
                      </CharacterCheck>
                      {character}
                    </Character>
                  );
                })}
              </CharacterList>
            </li>
          ))}
        </WorkList>
      </div>
      <div>
        <H3>全般</H3>
      </div>
    </Wrapper>
  );
};

export default SideNav;
