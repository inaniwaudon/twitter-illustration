import React from "react";
import styled from "styled-components";
import { HiOutlinePlus } from "react-icons/hi";
import { IoPricetag } from "react-icons/io5";
import { getKeyColor } from "@/const/styles";

const H2 = styled.h2`
  font-size: 14px;
  margin-top: 12px;
  margin-bottom: 6px;
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
    margin-top: 4px;
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
  <>
    <H2>ツイートの追加</H2>
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
      Chrome 拡張を導入して、ツイートのページに表示される +
      アイコンをクリックします
    </Paragpraph>
    <H2>絞り込み</H2>
    <H3>タグ</H3>
    <Paragpraph>複数個のタグを選択して絞り込みます。</Paragpraph>
    <H3>キーワード</H3>
    <Paragpraph>
      @ から始めるとスクリーンネームを前方一致で検索します。
    </Paragpraph>
    <H2>タグを編集する</H2>
    <Paragpraph>
      ツイートを選択した状態で、左側のサイドパネルの <IoPricetag />{" "}
      をクリックします。
    </Paragpraph>
  </>
);

export default Readme;
