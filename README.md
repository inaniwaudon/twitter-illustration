# twitter-illustration

Twitter をイラスト共有サイトのように使用するための Web アプリケーションです。  
ユーザは、好きな絵師さんのイラストや写真等を含むツイートをローカルに蓄積し、後から見返したり、高度なフィルタリングを用いて検索したりすることができます。

解説記事：[Twitter 上のイラストを快適に閲覧するための Web アプリを開発しました](https://zenn.dev/inaniwaudon/articles/b361c4f996c980)

## 環境構築

### フロントエンド

環境変数 `client/.env` を記述します。

```bash
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

[Twitter API v2](https://developer.twitter.com/en/docs/twitter-api) を取得し、環境変数 `backend/.env` に Bearer Token を設定します。

```bash
PORT=3030
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

### Chrome Extension

[Releases](https://github.com/inaniwaudon/twitter-illustration/releases) からパッケージ化されたファイルを取得し、Chrome にドラッグアンドドロップして拡張機能 twitter-illustration を追加します。

## 使用方法

### ツイートを編集する

**ツイートの追加**

Google Chrome 拡張機能を導入し、ツイートのページに表示される + アイコンをクリックします。あるいは、アプリケーションの + ボタンをクリックして URL を入力します。

**ツイートへのタグ付与**

ツイートを選択して、左側のサイドバーにあるブックマークアイコンを操作します。

**ツイートの削除**

ツイートを選択して、左下のゴミ箱アイコンをクリックします。

### タグを編集する

以下の JSON ファイルを直接編集します。

- 作品・キャラクター情報：`backend/data/works.json`
- 共通タグ情報：`backend/data/common-tag.json`

## ライセンス・注意事項

本ソフトウェアは、MIT ライセンスに従って自由に利用・改変・再配布を行えます。  
Copyright (c) 2022 いなにわうどん. This software is released under the MIT Liscense.

使用にあたっては、他者の権利および Twitter の利用規約にご注意ください。私的複製の範囲内での画像のダウンロードは認められていますが、第三者の著作物を無断で公衆送信する行為は著作権法で禁止されています。
