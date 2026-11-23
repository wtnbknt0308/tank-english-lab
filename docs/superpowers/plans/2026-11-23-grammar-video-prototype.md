# 文法動画 試作 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 1つの台本データから「詳しい版」と「ダイジェスト版」の MP4 を書き出せる仕組みを作り、まず文法Lv1（音声なし・字幕あり）を完成させる。

**Architecture:** 各チャプターは JS の場面リスト（scene）として書く。場面は `render(el, t)` で時刻 t の見た目を決める（CSS トランジションは使わない）。そのため、どのコマでも同じ絵が出る。`render.mjs` は Playwright で 1/30 秒ずつ `__seek(t)` してスクリーンショットを撮り、ffmpeg に流し込んで MP4 にする。

**Tech Stack:** HTML/CSS/JS（ビルドなし）、Node 22、Playwright（プリインストール済み）、ffmpeg、Noto Sans JP（@fontsource）

**Spec:** docs/superpowers/specs/2026-11-23-english-grammar-video-design.md

## Global Constraints
- 1920×1080、30fps、H.264 MP4（yuv420p）
- 色：主語＝青 #2f6fdf、述部＝赤 #e0483e、目的語＝緑 #2e9e5b、修飾語＝灰 #7a8494
- 呼び名：主語・述部・目的語・修飾語（「述語」とは書かない）
- 場面には versions: ['full','digest'] のどちらか、または両方を付ける
- 字幕（ナレーション文）は画面下に表示する。のちに音声に差し替えられるよう、場面ごとの narration 配列で持つ

## Review Focus
- 長い日本語の字幕が1行に収まらない → 自動で折り返し、最大2行
- 文節カードの幅は文字数で変わる → 並び替え後の位置は、実際に測った幅から計算する（重なってはいけない）
- ダイジェスト版には練習問題を入れない → タイムラインのテストで確認する
- 書き出しの途中でフォントが読み込まれていない → 撮影前に document.fonts.ready を待つ
- 動画の長さ ＝ 場面の長さの合計 → ffprobe で確認する

---

### Task 1: タイムラインエンジン
**Files:** Create `video/engine/timeline.js`, `video/test/timeline.test.mjs`
**Interfaces:** Produces `buildTimeline(scenes, version) -> {items:[{scene,start,end}], duration}`、`sceneAt(timeline, t) -> {scene, local}`
- [ ] テスト：digest には versions に 'digest' を含む場面だけが入る／start・end が連続している／sceneAt が境界で次の場面を返す
- [ ] 実装 → `node --test video/test` で PASS → commit

### Task 2: 描画部品（カード・字幕・タイトル・カウントダウン）とプレイヤーページ
**Files:** Create `video/engine/stage.css`, `video/engine/parts.js`, `video/player.html`
**Interfaces:** `chunkRow(el, chunks, opts)`（文節カード列の生成と幅の計測）、`layoutPositions(widths, order, gap) -> x[]`、`ease(t)`、`window.__seek(t)`、`window.__duration`
- [ ] テスト：layoutPositions が重ならず、中央寄せになる
- [ ] player.html?chapter=lv1&version=full をブラウザで開き、スクリーンショットで目視確認 → commit

### Task 3: 書き出しスクリプト
**Files:** Create `video/render.mjs`
- [ ] `node video/render.mjs lv1 digest` で `video/out/lv1-digest.mp4` ができる。ffprobe の長さが __duration と ±0.1 秒以内 → commit

### Task 4: Lv1 の台本と場面
**Files:** Create `video/chapters/lv1.js`
- 場面：タイトル／つかみ（語順を間違えた英文）／分解→色付け→並び替え→助詞が消える→英語に変わる／ルールのまとめ／例2（listen to）／練習×3（full のみ）／疑問文／否定文／書き換え練習×2（full のみ）／まとめ
- [ ] 両方の版を書き出し、主要な場面のコマを抜き出して目視確認 → commit・push

### Task 5（音声が手に入ってから）：ナレーション音声の差し込み、発音の基礎チャプター
