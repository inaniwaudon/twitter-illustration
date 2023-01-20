import React from "react";
import { HiOutlineCheck } from "react-icons/hi";
import { IoPricetag } from "react-icons/io5";
import styled from "styled-components";
import { defaultBoxShadow } from "@/const/styles";

const Wrapper = styled.div`
  display: flex;
`;

const Body = styled.div<{ selected: boolean; hue: number }>`
  color: ${(props) =>
    props.selected ? "#fff" : `hsl(${props.hue}, 50%, 50%)`};
  height: 14px;
  flex-grow: 1;
  padding: 5px 10px 5px 0;
  border-radius: 4px;
  box-shadow: ${(props) => (props.selected ? defaultBoxShadow : "")};
  cursor: pointer;
  border: solid 1px
    ${(props) => `hsl(${props.hue}, 50%, ${props.selected ? 50 : 60}%)`};
  background: ${(props) =>
    props.selected ? `hsl(${props.hue}, 50%, 50%)` : ""};
  transition: margin 0.15s ease-out;
  display: flex;

  &:hover {
    margin-right: 10px;
  }
`;

const Check = styled.div`
  width: 18px;
  height: 14px;
  margin: -1px 0 0 12px;
`;

const Label = styled.div`
  line-height: 14px;
`;

const Plus = styled.div<{ tweetAssociated: boolean; hue: number }>`
  width: 16px;
  height: 16px;
  line-height: 16px;
  color: ${(props) =>
    props.tweetAssociated ? `hsl(${props.hue}, 50%, 60%)` : "#eee"};
  font-size: 16px;
  padding: 5px 0 5px 5px;
  cursor: pointer;

  &:hover {
    color: ${(props) =>
      `hsl(${props.hue}, 50%, ${props.tweetAssociated ? 60 : 80}%)`};
  }
`;

interface TagProps {
  selected: boolean;
  tweetAssociated: boolean;
  hue: number;
  label: string;
  onClickBody?: () => void;
  onClickPlus?: () => void;
}

const Tag = ({
  selected,
  tweetAssociated,
  hue,
  label,
  onClickBody,
  onClickPlus,
}: TagProps) => (
  <Wrapper>
    <Body selected={selected} hue={hue} onClick={onClickBody}>
      <Check>{selected && <HiOutlineCheck size="16px" />}</Check>
      <Label>{label}</Label>
    </Body>
    <Plus tweetAssociated={tweetAssociated} hue={hue} onClick={onClickPlus}>
      <IoPricetag />
    </Plus>
  </Wrapper>
);

export default Tag;
