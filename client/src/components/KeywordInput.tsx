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
  appearance: none;
`;

interface KeywordInputProps {
  type: "text" | "search";
  value: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const KeywordInput = ({
  type,
  value,
  placeholder,
  onChange,
}: KeywordInputProps) => (
  <Input
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
  />
);

export default KeywordInput;
