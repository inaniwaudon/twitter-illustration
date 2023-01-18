import React, { useState } from "react";
import styled from "styled-components";
import { collectTweet } from "@/utils/api";

const Wrapper = styled.div`
  height: 100%;
  padding: 14px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
`;

const H2 = styled.h2`
  line-height: 1;
  color: #333;
  font-size: 16px;
  font-weight: normal;
  margin: 0 0 6px 0;
`;

const Form = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  height: 30px;
  line-height: 30px;
  flex-grow: 1;
  border-bottom: solid 1px #ccc;
  border-top: none;
  border-right: none;
  border-left: none;
`;

const Button = styled.input`
  color: #fff;
  padding: 0 10px;
  border: none;
  border-radius: 4px;
  background: #069;
`;

const Message = styled.p`
  color: #666;
  height: 12px;
  line-height: 12px;
  font-size: 12px;
  margin: 8px 0 0 0;
`;

const AddTweet = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(
    "https://twitter.com/... の形式で URL を入力"
  );

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
      <H2>ツイートを追加</H2>
      <Form>
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="button" value="追加" onClick={() => submit()} />
      </Form>
      <Message>{message}</Message>
    </Wrapper>
  );
};

export default AddTweet;
