# twitter-illustration/backend

## 環境変数

```bash
PORT=3030
TWITTER_BEARER_TOKEN=<BEARER_TOKEN>
```


## スクリプト

ツイートを一括で追加する（API Rate limit に注意）

```bash
# ["id", "id", ...] の形で JSON ファイルを指定
npx ts-node tools/register-tweets.ts <json>
```
