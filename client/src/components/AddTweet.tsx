import React, { useState } from "react";
import styled from "styled-components";
import { HiOutlinePlus } from "react-icons/hi";
import KeywordInput from "./KeywordInput";
import { defaultBoxShadow } from "@/const/styles";
import { collectTweet } from "@/utils/api";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: end;
  justify-content: end;
  gap: 10px;
`;

const Plus = styled.div`
  width: 20px;
  height: 20px;
  padding: 10px 10px;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  background: #069;
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
  pointer-events: ${(props) => (props.displays ? "auto" : "none")};
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
  background: #069;
`;

const Message = styled.p`
  color: #666;
  height: 12px;
  line-height: 12px;
  font-size: 12px;
  margin: 10px 0 0 0;
`;

const AddTweet = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(
    "https://twitter.com/... の形式で URL を入力"
  );
  const [displaysPanel, setDisplaysPanel] = useState(false);

  const switchDisplaysPanel = () => {
    setDisplaysPanel(!displaysPanel);
  };

  const submit = async () => {
    if (!/^https:\/\/twitter.com\/.+\/status\/[0-9]+$/.test(url)) {
      setMessage("https://twitter.com/... の形式で指定してください");
      return;
    }
    const response = await collectTweet(url.split("/").at(-1)!);
    setMessage(response.status === 204 ? "記録しました" : "記録に失敗しました");
    setUrl("");
  };

  return (
    <Wrapper>
      <Plus onClick={switchDisplaysPanel}>
        <PlusIcon isPlus={!displaysPanel}>
          <HiOutlinePlus size="20px" />
        </PlusIcon>
      </Plus>
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
        <Message>{message}</Message>
      </Panel>
    </Wrapper>
  );
};

export default AddTweet;
