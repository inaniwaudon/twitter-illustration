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

Twitter API を利用して取得する場合は `.env` の `USE_API` を `true` に設定します。

```
BACKEND_URL=http://localhost:3030
USE_API=true
```
