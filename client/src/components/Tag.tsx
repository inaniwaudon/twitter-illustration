import React from "react";
import styled from "styled-components";
import { HiOutlineCheck } from "react-icons/hi";
import { defaultBoxShadow } from "@/const/styles";
import { Mode } from "@/utils/utils";

const Wrapper = styled.div<{ selected: boolean; hue: number; mode: Mode }>`
  color: ${(props) =>
    props.selected ? "#fff" : `hsl(${props.hue}, 50%, 50%)`};
  height: 14px;
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
    ${(props) =>
      props.mode === "filter" ? "margin-right: 10px;" : "margin-left: 10px"}
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

interface TagProps {
  selected: boolean;
  hue: number;
  label: string;
  mode: Mode;
  onClick?: () => void;
}

const Tag = ({ selected, hue, label, mode, onClick }: TagProps) => (
  <Wrapper selected={selected} hue={hue} mode={mode} onClick={onClick}>
    <Check>{selected && <HiOutlineCheck size="16px" />}</Check>
    <Label>{label}</Label>
  </Wrapper>
);

export default Tag;
