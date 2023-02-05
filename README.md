# twitter-illustration

Twitter 上の画像を保存し、一覧表示するための Web アプリケーション

![スクリーンショット](./screenshot.png)

## 機能
本アプリケーションは主に以下の機能を備えます。

- 好みのツイートを保存し、ツイートに掲載された画像を一覧表示する
- タグ付けを通じて、作品・キャラクター・ラベル等に応じてツイートを分類する
- 付与したタグを元にフィルタリングを行う
- 保存したツイートはローカルに蓄積され、快適かつオフライン環境でも閲覧可能

解説記事：[Twitter 上のイラストを快適に閲覧するための Web アプリを開発しました](https://zenn.dev/inaniwaudon/articles/b361c4f996c980)

## 環境構築

アプリケーションの実行には Node.js v18 以上および SQLite3 が必要です。

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

`backend/.env` に 環境変数を設定します。

```bash
PORT=3030
```

また、`backend/data` 以下に、タグの分類に使用する以下の JSON ファイルを追加します。
`characters` には、16 進数でカラーコードを指定できます。

`backend/data/works.json`

```json
[
  {
    "title": "作品名",
    "alias": ["別名"],
    "characters": [
      "登場人物1",
      { "name": "登場人物2", "color": "#カラーコード" },
      { "name": "登場人物3", "color": "#カラーコード" }
    ]
  }
]
```

`backend/data/common-tag.json`

```json
["タグ1", "タグ2", "タグ3"]
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

## ブラウザ拡張機能

Google Chrome または Firefox から、twitter-illustration にツイートを直接追加するための拡張機能を利用できます。

[Releases](https://github.com/inaniwaudon/twitter-illustration/releases) から `twitter-illustration-chrome-extension.zip` または `twitter-illustration-firefox-extension.zip` を取得し、解凍してください。

### Google Chrome

chrome://extensions にアクセスし、デベロッパーモードを有効にした状態で「パッケージ化されていない拡張機能を読み込む」から解凍したディレクトリを読み込み、拡張機能を有効化します。

### Firefox

about:debugging を開き、「この Firefox」→「一時的なアドオンを読み込む…」から解凍したディレクトリ内の `manifest.json` を選択します。

## 使用方法

### ツイートを編集する

**ツイートの追加**

Google Chrome または Firefox に拡張機能を導入し、ツイートのページ（https://twitter.com/id/status/...）に表示される + アイコンをクリックします。  

追加したツイートの表示はページリロード後に反映されます。

> **Note**  
> API を経由したツイートの取得は廃止されました

**ツイートへのタグ付与・削除**

ツイートを選択して、左側のサイドパネルにあるブックマークアイコンを操作します。
キャラクターのカラーが設定されている場合、Ctrl キーを押しながら画像をクリックすると、クリックした箇所の画素と類似するカラーのキャラクターを提示します。

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
