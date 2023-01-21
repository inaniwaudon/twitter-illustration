import React, { useState } from "react";
import { ImArrowUp } from "react-icons/im";
import { useKeyPressEvent } from "react-use";
import styled from "styled-components";
import { defaultBoxShadow, getKeyColor } from "@/const/styles";

const Wrapper = styled.div<{ displays: boolean }>`
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  padding: 0;
  opacity: ${(props) => (props.displays ? 1.0 : 0)};
  pointer-events: ${(props) => (props.displays ? "auto" : "none")};
  display: flex;
  gap: 6px;
  position: relative;
  transition: opacity 0.2s;
`;

const Key = styled.span<{ pressed: boolean }>`
  color: ${(props) => (props.pressed ? "#fff" : "#888")};
  height: 16px;
  line-height: 16px;
  margin-right: 4px;
  padding: 6px 8px 6px 7px;
  border-radius: 4px;
  box-shadow: ${defaultBoxShadow};
  display: inline-flex;
  gap: 2px;
  background: ${(props) =>
    props.pressed ? getKeyColor(0.8) : "rgba(255, 255, 255, 0.8)"};
`;

const KeyIcon = styled.div`
  margin-top: -1px;
`;

const Label = styled.div`
  line-height: 28px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6), 0 0 4px rgba(0, 0, 0, 0.6);
`;

interface StatusProps {
  selectedTweetCount: number;
}

const Status = ({ selectedTweetCount }: StatusProps) => {
  const [isShiftKeyPressed, setShiftKeyPressed] = useState(false);
  useKeyPressEvent(
    "Shift",
    () => {
      setShiftKeyPressed(true);
    },
    () => {
      setShiftKeyPressed(false);
    }
  );

  return (
    <Wrapper displays={selectedTweetCount > 0}>
      <Key pressed={isShiftKeyPressed}>
        <KeyIcon>
          <ImArrowUp size="16px" />
        </KeyIcon>
        <div>Shift</div>
      </Key>
      <Label>複数選択</Label>
    </Wrapper>
  );
};

export default Status;
