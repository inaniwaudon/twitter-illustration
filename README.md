# twitter-illustration

Twitter 上の画像を保存し、一覧表示するための Web アプリケーション

＜スクリーンショット＞

## 機能
本アプリケーションは主に以下の機能を備えます。

- 好みのツイートを保存し、ツイートに掲載された画像を一覧表示する
- タグ付けを通じて、作品・キャラクター・ラベル等に応じてツイートを分類する
- 付与したタグを元にフィルタリングを行う
- 保存したツイートはローカルに蓄積され、快適かつオフライン環境でも閲覧可能

解説記事：[Twitter 上のイラストを快適に閲覧するための Web アプリを開発しました](https://zenn.dev/inaniwaudon/articles/b361c4f996c980)

## 環境構築

アプリケーションの実行には Node.js および SQLite3 が必要です。

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

### Chrome 拡張機能

[Releases](https://github.com/inaniwaudon/twitter-illustration/releases) から `chrome-extension.zip` を取得し、解凍します。続いて chrome://extensions にアクセスし、デベロッパーモードを有効にした状態で「パッケージ化されていない拡張機能を読み込む」から解凍したディレクトリを読み込み、拡張機能を追加および有効化します。

## 使用方法

### ツイートを編集する

**ツイートの追加**

上記の Google Chrome 拡張機能を導入し、ツイートのページ（https://twitter.com/id/status/...）に表示される + アイコンをクリックします。
または、アプリケーション右下に表示される + ボタンをクリックしてツイートの URL を入力します。  
追加したツイートの表示はページリロード後に反映されます。

**ツイートへのタグ付与・削除**

ツイートを選択して、左側のサイドパネルにあるブックマークアイコンを操作します。

**ツイートの削除**

ツイートを選択して、左下に表示されるゴミ箱アイコンをクリックします。

### タグを編集する

以下の JSON ファイルを直接編集します。

- 作品・キャラクター情報：`backend/data/works.json`
- 共通タグ情報：`backend/data/common-tag.json`

## ライセンス・注意事項

本ソフトウェアは、MIT ライセンスに従って自由に利用・改変・再配布を行えます。  
Copyright (c) 2023 いなにわうどん. This software is released under the MIT Liscense.

使用にあたっては、他者の権利および Twitter の利用規約にご注意ください。私的複製の範囲内での画像のダウンロードは認められていますが、第三者の著作物を無断で公衆送信する行為は著作権法で禁止されています。
