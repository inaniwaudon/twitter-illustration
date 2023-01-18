# twitter-illustration

Twitter をイラスト共有サイトのように使用するための Web アプリケーションです。  
ユーザは、好きな絵師さんのイラストや写真等を含むツイートをローカルに蓄積し、後から見返したり、高度なフィルタリングを用いて検索したりすることができます。

## 環境構築

### フロントエンド

環境変数 `client/.env` を記述します。

```
BACKEND_URL=http://localhost:3030
```

起動

```bash
cd client
yarn install

# localhost:3000 で起動
yarn run start
```

### バックエンド

[Twitter API](https://developer.twitter.com/en/docs/twitter-api) を取得し、環境変数 `backend/.env` に Bearer Token を設定します。

```
TWITTER_BEARER_TOKEN=<BEARER_TOKEN>
```

起動

```bash
cd backend
yarn install

# 初回仕様時は DB のマイグレーションを行う
npx sequelize-cli-esm db:migrate

# localhost:3030 で起動
yarn run start
```

## 使用方法

### ツイートをストックする

右下の + ボタン、または Google Chrome 拡張機能を用いて追加します。

### ツイートを削除する、ツイートにタグを付与する

右側のサイドバーから操作します。

### タグを編集する

以下の JSON ファイルを直接編集します。

- 作品・キャラクター情報：`data/works.json`
- 共通タグ情報：`data/common-tag.json`

## ライセンス・注意事項

本ソフトウェアは、MIT ライセンスに従って自由に使用・改変・再配布等を行えます。  
Copyright (c) 2022 いなにわうどん. This software is released under the MIT Liscense.

使用にあたっては、他者の権利および Twitter の利用規約にご注意ください。私的複製の範囲内での画像のダウンロードは認められていますが、第三者の著作物を無断で公衆送信する行為は著作権法で禁止されています。
