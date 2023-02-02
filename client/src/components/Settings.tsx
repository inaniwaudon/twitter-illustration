import React from "react";
import styled from "styled-components";
import { defaultBoxShadow } from "@/const/styles";
import { DisplayOptions } from "@/utils/utils";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SettingLabel = styled.div`
  line-height: 1;
  margin-bottom: 8px;
`;

const Input = styled.input`
  height: 26px;
  line-height: 26px;
  padding: 0 0 0 8px;
  border-radius: 4px;
  border: none;
  box-shadow: ${defaultBoxShadow};
  box-sizing: content-box;
  appearance: none;
`;

interface SettingsProps {
  displayOptions: DisplayOptions;
  setDisplayOptions: (value: DisplayOptions) => void;
}

const Settings = ({ displayOptions, setDisplayOptions }: SettingsProps) => {
  const updateRowCount = (value: string) => {
    setDisplayOptions({
      ...displayOptions,
      columns: Number.isNaN(parseInt(value)) ? 1 : Math.max(parseInt(value), 1),
    });
  };

  const updateTweetPerPage = (value: string) => {
    setDisplayOptions({
      ...displayOptions,
      tweetsPerPage: Number.isNaN(parseInt(value))
        ? 100
        : Math.max(parseInt(value), 1),
    });
  };

  const updateIsSquare = (value: boolean) => {
    setDisplayOptions({ ...displayOptions, isSquare: value });
  };

  return (
    <Wrapper>
      <label>
        <SettingLabel>列数</SettingLabel>
        <Input
          type="number"
          value={displayOptions.columns}
          onChange={(e) => updateRowCount(e.target.value)}
        />
      </label>
      <label>
        <SettingLabel>1ページあたりの表示</SettingLabel>
        <Input
          type="number"
          value={displayOptions.tweetsPerPage}
          onChange={(e) => updateTweetPerPage(e.target.value)}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={displayOptions.isSquare}
          onChange={(e) => updateIsSquare(e.target.checked)}
        />
        正方形で表示する
      </label>
    </Wrapper>
  );
};
export default Settings;
