import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlinePlus } from "react-icons/hi";
import KeywordInput from "./KeywordInput";
import { defaultBoxShadow, getKeyColor } from "@/const/styles";
import { addTweet } from "@/utils/api";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 10px;
`;

const Plus = styled.div`
  width: 20px;
  height: 20px;
  padding: 10px 10px;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  background: ${getKeyColor(1.0)};
  cursor: pointer;
  box-shadow: ${defaultBoxShadow};
  z-index: 1;
`;

const PlusIcon = styled.div<{ isPlus: boolean }>`
  width: 20px;
  height: 20px;
  transform: rotate(${(props) => (props.isPlus ? 0 : 45)}deg);
  transform-origin: center;
  transition: transform 0.2s;
`;

const Panel = styled.div<{ displays: boolean }>`
  width: 300px;
  height: 100%;
  padding: 14px;
  border-radius: 4px;
  box-shadow: ${defaultBoxShadow};
  opacity: ${(props) => (props.displays ? 1.0 : 0)};
  visibility: ${(props) => (props.displays ? "visible" : "hidden")};
  background: rgba(255, 255, 255, 0.9);
  transition: opacity 0.2s;
`;

const H2 = styled.h2`
  line-height: 1;
  color: #333;
  font-size: 16px;
  font-weight: normal;
  margin: 0 0 10px 0;
`;

const Form = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.input`
  color: #fff;
  padding: 0 10px;
  border: none;
  border-radius: 4px;
  box-shadow: ${defaultBoxShadow};
  appearance: none;
  background: ${getKeyColor(1.0)};
`;

const Message = styled.p<{ isError: boolean }>`
  color: ${(props) => (props.isError ? "#c00" : "#666")};
  line-height: 12px;
  font-size: 12px;
  margin: 10px 0 0 0;
`;

const AddTweet = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(
    "https://twitter.com/... の形式で URL を入力"
  );
  const [isMessageError, setMessageError] = useState(false);
  const [displaysPanel, setDisplaysPanel] = useState(false);

  const switchDisplaysPanel = () => {
    setDisplaysPanel(!displaysPanel);
  };

  const submit = async () => {
    if (!/^https:\/\/twitter.com\/.+\/status\/[0-9]+$/.test(url)) {
      setMessage("https://twitter.com/... の形式で指定してください");
      setMessageError(true);
      return;
    }
    const response = await addTweet(url.split("/").at(-1)!);
    if (response.ok) {
      setMessage("記録しました");
      setMessageError(false);
      setUrl("");
    } else {
      setMessage(
        `処理に失敗しました。${response.status} ${await response.text()}`
      );
      setMessageError(true);
    }
  };

  return (
    <Wrapper>
      <Panel displays={displaysPanel}>
        <H2>ツイートを追加</H2>
        <Form>
          <KeywordInput
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button type="button" value="追加" onClick={() => submit()} />
        </Form>
        <Message isError={isMessageError}>{message}</Message>
      </Panel>
      <Plus onClick={switchDisplaysPanel}>
        <PlusIcon isPlus={!displaysPanel}>
          <HiOutlinePlus size="20px" />
        </PlusIcon>
      </Plus>
    </Wrapper>
  );
};

export default AddTweet;
