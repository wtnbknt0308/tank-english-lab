// 文法 Lv3-2　助動詞
import { h, fadeIn } from '../engine/parts.js';
import { titleScene, sectionScene, transformScene, fillBlankScene, compareStackScene } from '../engine/scenes.js';
import { BOTH, FULL, chg } from './lv3-common.js';

export const meta = {
  code: 'Lv3-2',
  title: '助動詞　動詞に「気持ち」をプラスする',
  toc: [
    { key: '1', label: '助動詞とは' },
    { key: '2', label: '疑問文・否定文' },
    { key: '3', label: '練習' },
    { key: '4', label: 'シンプルな現在形からの変化' },
  ],
};

const sec1 = sectionScene({ id: 'sec1', toc: '1', no: 1, title: '助動詞とは', sub: '動詞に「気持ち」をプラスする',
  narration: [{ t: 0.5, text: '助動詞は、動詞の前に置いて、気持ちや判断をプラスします。' }] });

const modalAdd = transformScene({
  id: 'modal-add', toc: '1',
  heading: '助動詞を足すと？<small>現在形 → 助動詞</small>',
  rows: ['現在形', '助動詞'], jp: ['私はテニスをします。', '私はテニスをすることができます。'],
  chunks: [{ en: 'I', role: 's' }, { en: 'can', role: 'x', label: '助動詞' }, { en: 'play', role: 'v' }, { en: 'tennis.', role: 'o' }],
  baseOrder: [0, 2, 3], newOrder: [0, 1, 2, 3], insert: 1, note: 'can ＋ 原形',
  T: { show: 0, copy: 1.5, insert: 4, alt: 5, note: 5, end: 13 },
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形。<em>I play tennis.</em>' },
    { t: 4, text: '動詞の前に <em>can</em> を置くと「〜できる」。動詞は<em>原形</em>のまま。' },
    { t: 9, text: '<em>I can play tennis.</em>「私はテニスをすることができます。」' },
  ],
});

const modalTable = {
  id: 'modal-table', toc: '1', versions: BOTH, duration: 17,
  narration: [
    { t: 0, text: 'can のほかにも、いろいろな助動詞があります。' },
    { t: 3, text: '<em>can</em> できる、<em>will</em> だろう、<em>must</em> しなければならない、<em>may</em> してもよい、<em>should</em> すべきだ。' },
    { t: 12, text: 'どの助動詞でも、後ろの動詞は<em>原形</em>です。' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = '助動詞 ＋ 動詞の原形'; root.appendChild(head);
    const rows = [['can', '〜できる'], ['will', '〜だろう・〜するつもり'], ['must', '〜しなければならない'], ['may', '〜してもよい'], ['should', '〜すべきだ']].map(([w, m], i) => {
      const b = h('div', 'box'); b.style.left = '380px'; b.style.width = '1100px'; b.style.top = 250 + i * 118 + 'px'; b.style.height = '100px';
      b.innerHTML = `<div style="position:absolute;left:46px;top:0;bottom:0;display:flex;align-items:center;font-size:54px;font-weight:900;color:var(--x)">${w} <span style="color:var(--ink);margin-left:16px">play</span></div>
        <div style="position:absolute;left:420px;top:0;bottom:0;display:flex;align-items:center;font-size:46px;font-weight:700">${m}</div>`;
      root.appendChild(b); return b;
    });
    return { head, rows };
  },
  render({ head, rows }, t) {
    fadeIn(head, t, 0);
    rows.forEach((b, i) => fadeIn(b, t, 3 + i * 1.6));
  },
};

// 三単現でも、助動詞の後ろは原形（plays の s が消える）
const modalThird = transformScene({
  id: 'modal-third', toc: '1',
  heading: '主語が he でも？<small>三単現 → 助動詞</small>',
  rows: ['三単現', '助動詞'], jp: ['彼はテニスをします。', '彼はテニスをすることができます。'],
  chunks: [{ en: 'He', role: 's' }, { en: 'can', role: 'x', label: '助動詞' }, { en: 'play[s]', en2: 'play', role: 'v' }, { en: 'tennis.', role: 'o' }],
  baseOrder: [0, 2, 3], newOrder: [0, 1, 2, 3], insert: 1, changeAlt: [2], note: '後ろは原形',
  T: { show: 0, copy: 1.5, mark: 2.5, insert: 5, alt: 6, note: 6.5, end: 14 },
  narration: [
    { t: 0, text: '主語が he のときは？　<em>He plays tennis.</em>' },
    { t: 5, text: 'can を置くと、plays の <em>s</em> は消えて<em>原形</em> play に。' },
    { t: 10, text: '<em>He can play tennis.</em>　助動詞の後ろは、いつも原形！' },
  ],
});

const sec2 = sectionScene({ id: 'sec2', toc: '2', no: 2, title: '疑問文・否定文', sub: '助動詞だけが動く',
  narration: [{ t: 0.5, text: '助動詞の疑問文と否定文です。' }] });

const modalQuestion = transformScene({
  id: 'modal-question', toc: '2',
  heading: '助動詞の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['あなたはテニスをすることができます。', 'あなたはテニスをすることができますか？'],
  chunks: [{ en: 'You', en2: 'you', role: 's' }, { en: 'can', en2: 'Can', role: 'x', label: '助動詞' }, { en: 'play', role: 'v' }, { en: 'tennis.', en2: 'tennis?', role: 'o' }],
  baseOrder: [0, 1, 2, 3], newOrder: [1, 0, 2, 3], insert: 1, changeAlt: [0, 1, 3], note: '助動詞だけが先頭へ',
  T: { show: 0, copy: 1.5, insert: 5, alt: 7, note: 7.5, end: 16 },
  narration: [
    { t: 0, text: '助動詞の疑問文。<em>You can play tennis.</em>' },
    { t: 2.5, text: '助動詞の文には、do はかくれていません。' },
    { t: 5, text: 'be動詞と同じように、<em>助動詞だけ</em>が先頭へ移動します。主語は動きません。' },
    { t: 11, text: '<em>Can you play tennis?</em>　答えは Yes, I can. / No, I can\'t.' },
  ],
});

const modalNegative = transformScene({
  id: 'modal-negative', toc: '2',
  heading: '助動詞の否定文<small>肯定文 → 否定文</small>',
  rows: ['肯定文', '否定文'], jp: ['私はテニスをすることができます。', '私はテニスをすることができません。'],
  chunks: [{ en: 'I', role: 's' }, { en: 'can', en2: "can't", role: 'x', label: '助動詞' }, { en: 'play', role: 'v' }, { en: 'tennis.', role: 'o' }],
  baseOrder: [0, 1, 2, 3], newOrder: [0, 1, 2, 3], changeAlt: [1], noteAt: 1, note: "can + not = can't",
  T: { show: 0, copy: 1.5, insert: 4, alt: 4.5, note: 5, end: 11 },
  narration: [
    { t: 0, text: '否定文は……' },
    { t: 4, text: '助動詞のすぐ後ろに not。can not は短く <em>can\'t</em>。' },
    { t: 8, text: '<em>I can\'t play tennis.</em>' },
  ],
});

const sec3 = sectionScene({ id: 'sec3', toc: '3', versions: FULL, no: 3, title: '練習問題', sub: 'どの助動詞が入る？',
  narration: [{ t: 0.5, text: '練習問題。（　）に入る助動詞を選ぼう。' }] });
const m1 = fillBlankScene({
  id: 'fill1', toc: '3', no: 1, jp: '私はとても速く泳ぐことができます。',
  chunks: [{ en: 'I', role: 's' }, { en: 'can', role: 'x', label: '助動詞' }, { en: 'swim', role: 'v' }, { en: 'very fast.', role: 'm' }],
  blank: 1, options: ['can', 'must', 'did'], why: '「〜できる」は <em>can</em>。',
});
const m2 = fillBlankScene({
  id: 'fill2', toc: '3', no: 2, jp: 'あなたは宿題をしなければなりません。',
  chunks: [{ en: 'You', role: 's' }, { en: 'must', role: 'x', label: '助動詞' }, { en: 'do', role: 'v' }, { en: 'your homework.', role: 'o' }],
  blank: 1, options: ['can', 'must', 'may'], why: '「〜しなければならない」は <em>must</em>。',
});
const m3 = fillBlankScene({
  id: 'fill3', toc: '3', no: 3, jp: '窓を開けてもいいですか？',
  chunks: [{ en: 'May', role: 'x', label: '助動詞' }, { en: 'I', role: 's' }, { en: 'open', role: 'v' }, { en: 'the window?', role: 'o' }],
  blank: 0, options: ['May', 'Must', 'Did'], why: '「〜してもいいですか？」は <em>May I 〜?</em>。',
});
const m4 = fillBlankScene({
  id: 'fill4', toc: '3', no: 4, jp: '彼はギターをひくことができます。',
  chunks: [{ en: 'He', role: 's' }, { en: 'can', role: 'x', label: '助動詞' }, { en: 'play', role: 'v' }, { en: 'the guitar.', role: 'o' }],
  blank: 2, options: ['play', 'plays', 'played'], why: '主語が he でも、助動詞の後ろは<em>原形</em> play。',
});

const changes = compareStackScene({
  id: 'changes', toc: '4', duration: { full: 19, digest: 15 },
  base: { html: 'I play tennis.', jp: '私はテニスをします。' },
  items: [
    { label: 'can', html: `I ${chg('can')} play tennis.`, jp: 'テニスをすることができる', t: 2.5 },
    { label: 'must', html: `I ${chg('must')} play tennis.`, jp: 'テニスをしなければならない', t: 4.5 },
    { label: 'may', html: `I ${chg('may')} play tennis.`, jp: 'テニスをしてもよい', t: 6.5 },
    { label: 'should', html: `I ${chg('should')} play tennis.`, jp: 'テニスをすべきだ', t: 8.5 },
    { label: '疑問文', html: `${chg('Can')} you play tennis?`, jp: 'テニスをすることができますか？', t: 10.5 },
  ],
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形 <em>I play tennis.</em> から、何が変わったかな？' },
    { t: 2.5, text: '動詞の前に助動詞を置くだけで、「気持ち」が変わります。' },
    { t: 10.5, text: '疑問文は、助動詞だけが先頭へ。後ろの動詞はいつも原形！' },
  ],
});


export const scenes = [
  titleScene({
    kicker: '文法 Lv3-2', main: '助動詞', sub: '動詞に「気持ち」をプラスする',
    narration: [{ t: 1, text: '文法レベル3の2。助動詞です。' }],
  }),
  sec1, modalAdd, modalTable, modalThird,
  sec2, modalQuestion, modalNegative,
  sec3, m1, m2, m3, m4,
  changes,
];
