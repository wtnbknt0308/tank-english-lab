# 英文法ビデオ（中学3年間）

1つの台本データ（`chapters/*.js`）から「詳しい版」と「ダイジェスト版」の MP4 を書き出します。

## 書き出し
```
npm install            # 初回のみ（フォント）
node render.mjs lv1 full      # → out/lv1-full.mp4
node render.mjs lv1 digest    # → out/lv1-digest.mp4
node render.mjs lv1 full --stills 20,45   # 確認用の静止画
npm test
```
ブラウザで見る：`npx http-server .` などで配信し、`player.html?chapter=lv1&version=full` を開く。

## しくみ
- `engine/timeline.js` 場面の並びと時刻
- `engine/parts.js` 文節カード（ChunkRow）・カウントダウンなどの部品
- `engine/scenes.js` 場面の型（タイトル／並べ替えの実演／練習問題／疑問文・否定文への変形）
- `chapters/lv1.js` Lv1 の台本。各場面の `versions` で詳しい版・ダイジェスト版を切り替え、`narration` が字幕（のちに音声）になる

## 色と呼び名（全チャプター共通）
主語＝青、述部＝赤、目的語＝緑、修飾語＝灰、Do / don't などの合図＝オレンジ
