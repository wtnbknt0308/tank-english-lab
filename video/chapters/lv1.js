// 文法 Lv1　日本語と英語の違い：なぜあなたの英語は伝わらないのか
import { h, ChunkRow, seg, ease, easeOutBack, fadeIn, ROLE } from '../engine/parts.js';
import { titleScene, anchorStory, practiceTimes } from '../engine/scenes.js';

export const meta = { code: 'Lv1', title: '日本語と英語の違い　なぜあなたの英語は伝わらないのか' };

const col = (role, text) => `<span style="color:${ROLE[role].color}">${text}</span>`;
const BOTH = ['full', 'digest'];

// ---- つかみ：日本語の順番のまま英語にすると…… ----
const hook = {
  id: 'hook', versions: BOTH, duration: 12,
  narration: [
    { t: 0, text: '「私は英語を毎日勉強します。」これを英語にしてみよう。' },
    { t: 3, text: '単語を、そのまま英語に置きかえると……' },
    { t: 6, text: '<em>I English every day study.</em>　これでは伝わりません！' },
    { t: 9, text: 'なぜでしょう？　日本語と英語では<em>「語順」</em>がちがうからです。' },
  ],
  setup(root) {
    const chunks = [
      { jp: '私', p: 'は', en: 'I', role: 's' },
      { jp: '英語', p: 'を', en: 'English', role: 'o' },
      { jp: '毎日', p: '', en: 'every day', role: 'm' },
      { jp: '勉強します', p: '', en: 'study', role: 'v' },
    ];
    const row = new ChunkRow(root, chunks, { y: 400 });
    const ng = h('div', 'mark ng', '✗'); ng.style.left = '880px'; ng.style.top = '620px';
    const q = h('div', 'mark', '？'); q.style.color = 'var(--sub)'; q.style.fontSize = '120px';
    q.style.left = '1500px'; q.style.top = '200px';
    root.append(ng, q);
    return { row, ng, q };
  },
  render({ row, ng, q }, t) {
    const order = [0, 1, 2, 3];
    row.chunks.forEach((_, i) => {
      const pf = ease(seg(t, 3.2 + i * 0.4, 4 + i * 0.4));
      const A = row.positions(order, 'jp'), B = row.positions(order, 'en');
      row.set(i, {
        x: A[i] + (B[i] - A[i]) * pf, w: row.w.jp[i] + (row.w.en[i] - row.w.jp[i]) * pf,
        lang: pf, opacity: seg(t, 0.3 + i * 0.2, 0.7 + i * 0.2),
        scale: 1 + 0.08 * Math.sin(Math.PI * seg(t, 3.2 + i * 0.4, 4 + i * 0.4)),
      });
    });
    ng.style.opacity = seg(t, 6, 6.2);
    ng.style.transform = `scale(${easeOutBack(seg(t, 6, 6.5))})`;
    q.style.opacity = seg(t, 6.6, 6.9);
    q.style.transform = `rotate(${Math.sin(t * 3) * 8}deg)`;
  },
};

// ---- 中心のアニメーション：分解 → 色分け → 下の枠へ1枚ずつ → 助詞が消える → 英語に ----
const demo = anchorStory({
  id: 'demo',
  chunks: [
    { jp: '私', p: 'は', en: 'I', role: 's' },
    { jp: '毎日', p: '', en: 'every day', role: 'm', q: 'いつ' },
    { jp: '学校', p: 'で', en: 'at school', role: 'm', q: 'どこで' },
    { jp: '英語', p: 'を', en: 'English', role: 'o' },
    { jp: '勉強します', p: '', en: 'study', role: 'v' },
  ],
  jpOrder: [0, 1, 2, 3, 4],
  enOrder: [0, 4, 3, 2, 1],
  sentence: `${col('s', 'I')} ${col('v', 'study')} ${col('o', 'English')} ${col('m', 'at school every day')}.`,
  T: { split: 3, glow: 6.5, color: 14, anchors: 0.8, move: 22, step: 1.3, flip: 30, done: 34, end: 40 },
  narration: [
    { t: 0, text: '「私は毎日学校で英語を勉強します。」この文を見てみましょう。' },
    { t: 3, text: '日本語の文は、このように<em>「文節」</em>に分けられます。' },
    { t: 6.5, text: '注目してほしいのは<em>「は」「で」「を」</em>。これは<em>「助詞」</em>です。' },
    { t: 10, text: '日本語では、助詞が「だれが」「どこで」「何を」を決めています。' },
    { t: 14, text: '役割ごとに色を付けます。<em>青＝主語</em>、<em>赤＝述部</em>、<em>緑＝目的語</em>、<em>灰色＝修飾語</em>。' },
    { t: 18, text: '下の枠は英語の順番。<em>だれが → どうする → 何を → どこで → いつ</em>。' },
    { t: 22, text: '主語から順番に、枠に当てはめていきます。' },
    { t: 30, text: '英語に変えると……英語には助詞がありません。<em>「位置」</em>が役割を決めます。' },
    { t: 34, text: '<em>I study English at school every day.</em>　正しい英文になりました！' },
  ],
});

// ---- ルールのまとめ ----
const rule = {
  id: 'rule', versions: BOTH, duration: { full: 14, digest: 9 },
  narration: {
    full: [
      { t: 0, text: '英語の文は、いつもこの順番で並びます。' },
      { t: 3, text: '<em>だれが</em> → <em>どうする</em> → <em>何を</em> → <em>どこで・いつ</em>。' },
      { t: 8, text: '修飾語が2つあるときは、<em>場所 → 時</em> の順番が基本です。' },
      { t: 11, text: '日本語は助詞があるので順番が自由。英語は順番が命です。' },
    ],
    digest: [
      { t: 0, text: '英語の順番：<em>だれが → どうする → 何を → どこで・いつ</em>。' },
      { t: 5, text: '修飾語が2つあるときは、<em>場所 → 時</em> の順番。' },
    ],
  },
  setup(root) {
    const head = h('div', 'heading'); head.innerHTML = '英語の語順のルール'; root.appendChild(head);
    const slots = [
      ['s', '主語', 'だれが'], ['v', '述部', 'どうする'], ['o', '目的語', '何を'], ['m', '修飾語', 'どこで・いつ'],
    ].map(([r, name, q], i) => {
      const b = h('div', 'box');
      b.style.left = 150 + i * 420 + 'px'; b.style.top = '330px'; b.style.width = '360px'; b.style.height = '260px';
      b.style.borderColor = ROLE[r].color; b.style.borderWidth = '6px';
      b.innerHTML = `<div style="height:110px;background:${ROLE[r].color};color:#fff;border-radius:20px 20px 0 0;display:flex;align-items:center;justify-content:center;font-size:58px;font-weight:900">${name}</div>
        <div style="height:140px;display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:900">${q}</div>`;
      root.appendChild(b);
      let arrow = null;
      if (i < 3) {
        arrow = h('div', 'mark', '→'); arrow.style.fontSize = '72px'; arrow.style.color = 'var(--sub)';
        arrow.style.left = 150 + i * 420 + 365 + 'px'; arrow.style.top = '410px';
        root.appendChild(arrow);
      }
      return { b, arrow };
    });
    const note = h('div', 'sentence');
    note.style.top = '660px'; note.style.fontSize = '52px';
    note.innerHTML = `修飾語が2つ → ${col('m', '場所')} → ${col('m', '時')}　（at school → every day）`;
    root.appendChild(note);
    return { head, slots, note };
  },
  render({ head, slots, note }, t, ctx) {
    const fast = ctx.version === 'digest';
    fadeIn(head, t, 0);
    slots.forEach(({ b, arrow }, i) => {
      const a = (fast ? 0.6 : 3) + i * (fast ? 0.5 : 1);
      const p = easeOutBack(seg(t, a, a + 0.6));
      b.style.opacity = seg(t, a, a + 0.3);
      b.style.transform = `scale(${p})`;
      if (arrow) fadeIn(arrow, t, a + 0.4, 0.4, 0);
    });
    fadeIn(note, t, fast ? 5 : 8);
  },
};

// ---- 例2：2語の述部（listen to） ----
const example2 = anchorStory({
  id: 'example2', versions: ['full'],
  heading: 'もう1つやってみよう',
  chunks: [
    { jp: '私', p: 'は', en: 'I', role: 's' },
    { jp: '毎日', p: '', en: 'every day', role: 'm', q: 'いつ' },
    { jp: '音楽', p: 'を', en: 'music', role: 'o' },
    { jp: '聞きます', p: '', en: 'listen to', role: 'v' },
  ],
  jpOrder: [0, 1, 2, 3],
  enOrder: [0, 3, 2, 1],
  sentence: `${col('s', 'I')} ${col('v', 'listen to')} ${col('o', 'music')} ${col('m', 'every day')}.`,
  T: { split: 0.8, glow: 2, color: 4, anchors: 0.5, move: 7.5, step: 1.1, flip: 12.5, done: 16.5, end: 22 },
  narration: [
    { t: 0, text: '「私は毎日音楽を聞きます。」' },
    { t: 4, text: '役割ごとに色分けして……' },
    { t: 7.5, text: '主語から順番に、下の枠へ。' },
    { t: 12.5, text: '英語に変えます。「聞きます」は <em>listen to</em>。2語でも、まとめて1つの<em>「述部」</em>です。' },
    { t: 16.5, text: '<em>I listen to music every day.</em>' },
  ],
});

// ---- 練習（詳しい版のみ）：上の日本語を、下の枠に当てはめる ----
function practice(no, { jp, chunks, enOrder, sentence }) {
  const T = practiceTimes(chunks.length);
  return anchorStory({
    id: `practice${no}`, versions: ['full'], practice: { no, think: 10 },
    heading: '英語の順番の枠に当てはめよう',
    chunks, jpOrder: chunks.map((_, i) => i), enOrder, sentence, T,
    narration: [
      { t: 0, text: `練習${no}　「${jp}」` },
      { t: T.think0, text: 'どのカードがどの枠に入るかな？　動画を止めて考えてもOK。' },
      { t: T.color, text: 'ヒント：カードに色がつきました。同じ色の枠を探そう！' },
      { t: T.answer, text: '答え合わせ。主語から順番に、枠に入れていきます。' },
      { t: T.flip, text: '英語に変えると……' },
      { t: T.done, text: sentence.replace(/<[^>]+>/g, '') },
    ],
  });
}
const p1 = practice(1, {
  jp: '私たちは毎週日曜日に公園でサッカーをします。',
  chunks: [
    { jp: '私たち', p: 'は', en: 'We', role: 's' },
    { jp: '毎週日曜日', p: 'に', en: 'every Sunday', role: 'm', q: 'いつ' },
    { jp: '公園', p: 'で', en: 'in the park', role: 'm', q: 'どこで' },
    { jp: 'サッカー', p: 'を', en: 'soccer', role: 'o' },
    { jp: 'します', p: '', en: 'play', role: 'v' },
  ],
  enOrder: [0, 4, 3, 2, 1],
  sentence: `${col('s', 'We')} ${col('v', 'play')} ${col('o', 'soccer')} ${col('m', 'in the park every Sunday')}.`,
});
const p2 = practice(2, {
  jp: '私は夕食の後にテレビを見ます。',
  chunks: [
    { jp: '私', p: 'は', en: 'I', role: 's' },
    { jp: '夕食の後', p: 'に', en: 'after dinner', role: 'm', q: 'いつ' },
    { jp: 'テレビ', p: 'を', en: 'TV', role: 'o' },
    { jp: '見ます', p: '', en: 'watch', role: 'v' },
  ],
  enOrder: [0, 3, 2, 1],
  sentence: `${col('s', 'I')} ${col('v', 'watch')} ${col('o', 'TV')} ${col('m', 'after dinner')}.`,
});
const p3 = practice(3, {
  jp: '私は毎晩母と話します。',
  chunks: [
    { jp: '私', p: 'は', en: 'I', role: 's' },
    { jp: '毎晩', p: '', en: 'every night', role: 'm', q: 'いつ' },
    { jp: '母', p: 'と', en: 'with my mother', role: 'm', q: 'だれと' },
    { jp: '話します', p: '', en: 'talk', role: 'v' },
  ],
  enOrder: [0, 3, 2, 1],
  sentence: `${col('s', 'I')} ${col('v', 'talk')} ${col('m', 'with my mother every night')}.`,
});

// ---- まとめ ----
const summary = {
  id: 'summary', versions: BOTH, duration: { full: 15, digest: 11 },
  narration: [
    { t: 0, text: 'まとめ。英語は<em>「位置」</em>で役割が決まります。' },
    { t: 4, text: 'この順番を守れば、あなたの英語は伝わります！' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = 'まとめ'; root.appendChild(head);
    const items = [
      `日本語は<b>助詞</b>で、英語は<b>位置</b>で役割が決まる`,
      `英語の順番：${col('s', '主語')} → ${col('v', '述部')} → ${col('o', '目的語')} → ${col('m', '修飾語（場所→時）')}`,
    ].map((html, i) => {
      const el = h('div', 'box');
      el.style.left = '210px'; el.style.width = '1500px'; el.style.top = 340 + i * 190 + 'px';
      el.style.padding = '30px 50px'; el.style.fontSize = '48px'; el.style.fontWeight = '700';
      el.innerHTML = `<span style="color:var(--accent);font-weight:900;margin-right:24px">${i + 1}</span>${html}`;
      root.appendChild(el);
      return el;
    });
    return { head, items };
  },
  render({ head, items }, t, ctx) {
    fadeIn(head, t, 0);
    const step = ctx.version === 'digest' ? 0.8 : 1.6;
    items.forEach((el, i) => fadeIn(el, t, 0.6 + i * step));
  },
};

export const scenes = [
  titleScene({
    kicker: '文法 Lv1', main: '日本語と英語の違い', sub: 'なぜあなたの英語は伝わらないのか',
    narration: [{ t: 1, text: '文法レベル1。なぜあなたの英語は伝わらないのか。その秘密は「語順」にあります。' }],
  }),
  hook, demo, rule, example2, p1, p2, p3, summary,
];
