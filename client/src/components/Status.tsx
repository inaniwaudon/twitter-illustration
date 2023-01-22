import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { ImArrowUp } from "react-icons/im";
import { useKeyPressEvent } from "react-use";
import styled from "styled-components";
import { defaultBoxShadow, getKeyColor } from "@/const/styles";
import { deleteTweets } from "@/utils/api";

const Wrapper = styled.div<{ displays: boolean }>`
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  padding: 0;
  opacity: ${(props) => (props.displays ? 1.0 : 0)};
  visibility: ${(props) => (props.displays ? "visible" : "hidden")};
  position: relative;
  transition: opacity 0.2s;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 12px;
`;

const Item = styled.li`
  display: flex;
  gap: 4px;
`;

const Key = styled.div<{ pressed: boolean }>`
  height: 16px;
  line-height: 16px;
  color: ${(props) => (props.pressed ? "#fff" : "#888")};
  margin-right: 4px;
  padding: 6px 8px 6px 7px;
  border-radius: 4px;
  box-shadow: ${defaultBoxShadow};
  cursor: pointer;
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

const DeleteIcon = styled.span`
  width: 16px;
  height: 16px;
  line-height: 16px;
  color: #fff;
  text-align: center;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: ${defaultBoxShadow};
  background: rgba(204, 0, 0, 0.8);
`;

interface StatusProps {
  selectedTweetIds: string[];
  deletedTweetIds: string[];
  isShiftKeyPressed: boolean;
  setShiftKeyPressed: (value: boolean) => void;
  setDeletedTweetIds: (value: string[]) => void;
}

const Status = ({
  selectedTweetIds,
  deletedTweetIds,
  isShiftKeyPressed,
  setShiftKeyPressed,
  setDeletedTweetIds,
}: StatusProps) => {
  useKeyPressEvent(
    "Shift",
    () => {
      setShiftKeyPressed(true);
    },
    () => {
      setShiftKeyPressed(false);
    }
  );

  const confirmDeletingTweet = () => {
    if (
      confirm(
        `${selectedTweetIds.length} 個のツイートを削除します。よろしいですか？`
      )
    ) {
      deleteTweets(selectedTweetIds);
      setDeletedTweetIds([...deletedTweetIds, ...selectedTweetIds]);
    }
  };

  return (
    <Wrapper displays={selectedTweetIds.length > 0}>
      <List>
        <Item onClick={confirmDeletingTweet}>
          <DeleteIcon>
            <AiOutlineDelete />
          </DeleteIcon>
        </Item>
        <Item>
          <Key
            pressed={isShiftKeyPressed}
            onClick={() => setShiftKeyPressed(!isShiftKeyPressed)}
          >
            <KeyIcon>
              <ImArrowUp size="16px" />
            </KeyIcon>
            <div>Shift</div>
          </Key>
          <Label>複数選択</Label>
        </Item>
      </List>
    </Wrapper>
  );
};

export default Status;
