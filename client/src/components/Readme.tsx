import React from "react";
import styled from "styled-components";

const H2 = styled.h2`
  font-size: 16px;
  padding-bottom: 4px;
  border-bottom: solid 1px #eee;
`;

const H3 = styled.h3`
  font-size: 14px;
`;

const Paragpraph = styled.p`
  font-size: 14px;
`;

const Button = styled.span`
  line-height: 1.8;
  color: #666;
  margin: 0 4px;
  padding: 2px;
  border: solid 1px #ccc;
  border-radius: 2px;
`;

const Readme = () => (
  <>
    <H2>ツイートを追加する</H2>
    <Paragpraph>
      ツイートを追加するには、右下の<Button>+</Button>ボタンを押してツイートの
      URL を入力するか、
    </Paragpraph>
    <H3>拡張機能</H3>
    <Paragpraph>Google Chrome の拡張機能を利用します。</Paragpraph>
    <H2>ツイートを絞り込む</H2>
    <H3>キーワードで検索</H3>
    <Paragpraph>@ から始まるとスクリーンネームで検索</Paragpraph>
    <H2>ツイートを選択する</H2>
    <Paragpraph>
      Shift キーを押すと複数のツイートを一度に選択できます。
    </Paragpraph>
    <H2>タグを編集する</H2>
    <Paragpraph>
      左側のサイドパネルの<Button>タグ付け</Button>
      をクリックするか、Ctrl（Command）キーを押すとタグ編集モードに移行します。
      左側のサイドパネルに表示されているタグを選択することで、現在選択されているツイートにタグを付与します。
    </Paragpraph>
  </>
);

export default Readme;
