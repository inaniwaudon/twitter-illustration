# twitter-illustration/backend

## 環境変数

```bash
PORT=3030
TWITTER_BEARER_TOKEN=<BEARER_TOKEN>
```

## データ例

`data/works.json`

```json
[
  {
    "title": "ぼっち・ざ・ろっく！",
    "alias": ["ぼざろ"],
    "characters": [
      { "name": "後藤ひとり", "color": ["#eba6b6"] },
      { "name": "伊知地虹夏", "color": ["#ecd072"] },
      { "name": "喜多郁代", "color": ["#c15e53", "#da5448"] },
      { "name": "山田リョウ", "color": ["#4260a1"] },
      { "name": "伊知地星歌", "color": ["#d6be76"] },
      { "name": "廣井きくり", "color": ["#b5677d"] },
      { "name": "後藤ふたり", "color": ["#f1a3b0"] },
      { "name": "後藤美智代", "color": ["#e1a1b1"] },
      { "name": "PAさん" }
    ]
  },
  {
    "title": "まちカドまぞく",
    "alias": ["まぞく"],
    "characters": [
      { "name": "吉田優子", "color": ["#cd6561"] },
      { "name": "千代田桃", "color": ["#ffbecd"] },
      { "name": "陽夏木ミカン", "color": ["#f4b07f"] }
    ]
  },
  {
    "title": "やはり俺の青春ラブコメはまちがっている。",
    "alias": "俺ガイル",
    "characters": ["雪ノ下雪乃", "由比ヶ浜由比", "一色いろは", "平塚静"]
  },
  { "title": "C101", "characters": ["金曜日", "土曜日"] }
]
```

`data/common-tag.json`

```json
["公式", "創作", "二次創作", "R18", "漫画"]
```

## スクリプト

ツイートを一括で追加する（API Rate limit に注意）

```bash
# ["id", "id", ...] の形で JSON ファイルを指定
npx ts-node tools/register-tweets.ts <json>
```
