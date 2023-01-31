import React from "react";
import styled from "styled-components";
import { HiOutlinePlus } from "react-icons/hi";
import { IoPricetag } from "react-icons/io5";
import { getKeyColor } from "@/const/styles";

const H2 = styled.h2`
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 8px;
  padding-bottom: 2px;
  border-bottom: solid 1px #eee;
`;

const H3 = styled.h3`
  font-size: 12px;
  margin: 0;
`;

const Paragpraph = styled.p`
  font-size: 12px;
  margin: 0;

  + ${H3} {
    margin-top: 10px;
  }
`;

const Wrapper = styled.div`
  ${Paragpraph} + ${Paragpraph} {
    margin-top: 8px;
  }
`;

const PlusButton = styled.span`
  width: 12px;
  height: 12px;
  line-height: 12px;
  color: #fff;
  text-align: center;
  margin: 0 4px;
  padding: 3px;
  border-radius: 50%;
  background: ${getKeyColor(1.0)};
  display: inline-block;
`;

const Readme = () => (
  <Wrapper>
    <H2>ツイートの追加</H2>
    <Paragpraph>
      追加したツイートの表示はページリロード後に反映されます。
    </Paragpraph>
    <H3>アプリケーションから</H3>
    <Paragpraph>
      右下の
      <PlusButton>
        <HiOutlinePlus />
      </PlusButton>
      を押してツイートの URL を入力します。
    </Paragpraph>
    <H3>拡張機能から</H3>
    <Paragpraph>
      Chrome 拡張機能を導入して、ツイートのページに表示される +
      アイコンをクリックします
    </Paragpraph>
    <H2>絞り込み</H2>
    <H3>タグ</H3>
    <Paragpraph>タグを選択して絞り込みます。</Paragpraph>
    <H3>キーワード</H3>
    <Paragpraph>
      @ から始めるとスクリーンネームを前方一致で検索します。
    </Paragpraph>
    <H2>タグの付与・削除</H2>
    <Paragpraph>
      ツイートを選択した状態で、左サイドパネルの <IoPricetag />{" "}
      をクリックします。
      <br />
      Ctrl
      キーを押しながら画像をクリックすると、画素色と類似するカラーのキャラクターを提示します。
    </Paragpraph>
    <H2>タグの編集</H2>
    <Paragpraph>
      backend/data 以下にある JSON ファイル works.json, common-tag.json
      を編集します。
    </Paragpraph>
  </Wrapper>
);

export default Readme;
