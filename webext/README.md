# twitter-illustration/webext

## Development

```bash
yarn install

yarn run format

# Google Chrome 用
yarn run build
# Firefox 用
yarn run build-firefox

# ホットリロードを有効にした状態でビルド
yarn run watch

```

## 環境変数

Twitter API を利用して取得する場合は `.env` に以下を記述します。

```
USE_API=true
```
