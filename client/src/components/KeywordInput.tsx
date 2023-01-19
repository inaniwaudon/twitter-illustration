import React from "react";
import styled from "styled-components";
import { defaultBoxShadow } from "@/const/styles";

const Input = styled.input`
  width: calc(100% - 10px * 2);
  padding: 8px 10px;
  border-radius: 4px;
  border: none;
  box-shadow: ${defaultBoxShadow};
  box-sizing: content-box;
`;

interface KeywordInputProps {
  type: "text" | "search";
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const KeywordInput = ({ type, value, onChange }: KeywordInputProps) => (
  <Input type={type} value={value} onChange={onChange} />
);

export default KeywordInput;
