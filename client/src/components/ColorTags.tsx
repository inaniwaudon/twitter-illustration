import React from "react";
import { IoPricetag } from "react-icons/io5";
import styled from "styled-components";
import { defaultBoxShadow } from "@/const/styles";
import { Work } from "@/utils/api";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  Color,
  getCharacterTag,
} from "@/utils/utils";

const Wrapper = styled.div<{ point: [number, number]; keyColor: Color }>`
  font-size: 14px;
  padding: 6px 0 4px 0;
  border-radius: 4px;
  box-shadow: ${defaultBoxShadow};
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  position: fixed;
  top: ${(props) => props.point[1]}px;
  left: ${(props) => props.point[0]}px;
  z-index: 4;
`;

const Header = styled.header`
  margin: 0 6px 4px 20px;
  display: flex;
  gap: 6px;
`;

const Circle = styled.div<{ keyColor: Color }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
  flex-grow: 0;
  position: absolute;
  top: -8px;
  left: -14px;
  background: ${(props) =>
    `rgb(${props.keyColor[0]}, ${props.keyColor[1]}, ${props.keyColor[2]})`};
`;

const ColorName = styled.h2`
  color: #666;
  font-size: 10px;
  font-weight: normal;
  margin: 0;
`;

const WorkList = styled.ul`
  font-size: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WorkItem = styled.li``;

const WorkTitle = styled.h3`
  font-size: 12px;
  margin: 0 6px 2px 20px;

  &::before {
    width: 15px;
    height: 1px;
    margin: 0 7px 4px -22px;
    content: "";
    background: #ccc;
    display: inline-block;
  }
`;

const CharacterList = styled.ul`
  margin: 0;
  padding: 0;
`;

const TagIconWrapper = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  margin-right: 4px;
  font-size: 12px;
`;

const Character = styled.li<{ keyColor: string }>`
  line-height: 1;
  padding: 4px 6px 4px 20px;
  cursor: pointer;
  display: flex;

  &:hover {
    color: #fff;
    background: ${(props) => props.keyColor};

    ${TagIconWrapper} {
      color: #fff;
    }
  }
`;

const CharacterName = styled.div`
  flex-grow: 1;
`;

interface ColorTagsProps {
  works: Work[];
  point: [number, number];
  color: Color;
  associatedTags: string[];
  inSwitchAssociation: (tag: string) => void;
}

export const ColorTags = ({
  works,
  point,
  color,
  associatedTags,
  inSwitchAssociation,
}: ColorTagsProps) => {
  const hue = rgbToHsl(color)[0];
  const maxDiff = 20;

  const filteredWorks = works
    .map((work) => ({
      ...work,
      characters: work.characters
        .map((character) => ({
          ...character,
          diff: Math.min(
            ...(character.color ? character.color : []).map((color) =>
              Math.abs(rgbToHsl(hexToRgb(color))[0] - hue)
            ),
            360
          ),
        }))
        .filter((character) => character.diff < maxDiff)
        .sort((a, b) => a.diff - b.diff),
    }))
    .filter((work) => work.characters.length > 0);

  return (
    <Wrapper point={point} keyColor={color}>
      <Circle keyColor={color} />
      <Header>
        <ColorName>{rgbToHex(color)}</ColorName>
      </Header>
      <WorkList>
        {filteredWorks.map((work) => (
          <WorkItem key={work.title}>
            <WorkTitle>{work.title}</WorkTitle>
            <CharacterList>
              {work.characters.map((character) => {
                const tag = getCharacterTag(work, character);
                return (
                  <Character
                    keyColor={character.color![0]}
                    onClick={() => inSwitchAssociation(tag)}
                    key={character.name}
                  >
                    <CharacterName>{character.name}</CharacterName>
                    <TagIconWrapper
                      color={
                        associatedTags.includes(tag)
                          ? character.color![0]
                          : "#ccc"
                      }
                    >
                      <IoPricetag />
                    </TagIconWrapper>
                  </Character>
                );
              })}
            </CharacterList>
          </WorkItem>
        ))}
      </WorkList>
    </Wrapper>
  );
};
export default ColorTags;
