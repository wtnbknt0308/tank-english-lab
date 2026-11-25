// 文法 Lv3-5　現在完了形
import { titleScene, sectionScene, transformScene, fillBlankScene, compareStackScene } from '../engine/scenes.js';
import { FULL, chg, perfectUses } from './lv3-common.js';

export const meta = {
  code: 'Lv3-5',
  title: '現在完了形　過去から「今」へつながる',
  toc: [
    { key: '1', label: '現在完了形の形' },
    { key: '2', label: '3つの使い方' },
    { key: '3', label: '疑問文・否定文' },
    { key: '4', label: '練習' },
    { key: '5', label: 'シンプルな現在形からの変化' },
  ],
};

const sec1 = sectionScene({ id: 'sec1', toc: '1', no: 1, title: '現在完了形の形', sub: 'have ＋ 過去分詞',
  narration: [{ t: 0.5, text: '現在完了形は、過去から今へ、つながっている言い方です。' }] });

const perfect = transformScene({
  id: 'perfect', toc: '1',
  heading: '現在完了形にするには？<small>現在形 → 現在完了形</small>',
  rows: ['現在形', '現在完了'], jp: ['私はテニスをします。', '私は5年間ずっとテニスをしています。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'have', role: 'x', label: 'have' }, { en: 'play', en2: 'played', role: 'v' },
    { en: 'tennis.', en2: 'tennis', role: 'o' }, { en: 'for five years.', role: 'm' },
  ],
  baseOrder: [0, 2, 3], newOrder: [0, 1, 2, 3, 4], insert: 1, changeAlt: [2, 3], extra: [4], note: 'have ＋ 過去分詞',
  T: { show: 0, copy: 1.5, insert: 5, alt: 6.5, note: 7, mark: 99, end: 17 },
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形。<em>I play tennis.</em>' },
    { t: 2.5, text: '「5年前から今まで、ずっとしている」と言いたいときは……' },
    { t: 5, text: '<em>have</em> と、動詞の<em>過去分詞</em>を使います。これが現在完了形。' },
    { t: 11, text: '<em>I have played tennis for five years.</em>　主語が he なら has。' },
  ],
});

const sec2 = sectionScene({ id: 'sec2', toc: '2', no: 2, title: '3つの使い方', sub: '継続・経験・完了',
  narration: [{ t: 0.5, text: '現在完了形には、3つの使い方があります。' }] });

const sec3 = sectionScene({ id: 'sec3', toc: '3', no: 3, title: '疑問文・否定文', sub: 'have だけが動く',
  narration: [{ t: 0.5, text: '現在完了形の疑問文と否定文です。' }] });

const perfectQuestion = transformScene({
  id: 'perfect-question', toc: '3',
  heading: '現在完了形の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['あなたは宿題を終えました。', 'あなたは宿題を終えましたか？'],
  chunks: [
    { en: 'You', en2: 'you', role: 's' }, { en: 'have', en2: 'Have', role: 'x', label: 'have' },
    { en: 'finished', role: 'v' }, { en: 'your homework.', en2: 'your homework?', role: 'o' },
  ],
  baseOrder: [0, 1, 2, 3], newOrder: [1, 0, 2, 3], insert: 1, changeAlt: [0, 1, 3], note: 'have だけが先頭へ',
  T: { show: 0, copy: 1.5, insert: 4.5, alt: 6.5, note: 7, end: 16 },
  narration: [
    { t: 0, text: '現在完了形の疑問文。' },
    { t: 2.5, text: 'have も、be動詞や助動詞と同じです。' },
    { t: 4.5, text: '<em>have だけ</em>が先頭へ移動します。主語は動きません。' },
    { t: 10.5, text: '<em>Have you finished your homework?</em>　答えは Yes, I have. / No, I haven\'t.' },
  ],
});

const perfectNegative = transformScene({
  id: 'perfect-negative', toc: '3',
  heading: '現在完了形の否定文<small>肯定文 → 否定文</small>',
  rows: ['肯定文', '否定文'], jp: ['私は宿題を終えました。', '私はまだ宿題を終えていません。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'have', en2: "haven't", role: 'x', label: 'have' },
    { en: 'finished', role: 'v' }, { en: 'my homework.', en2: 'my homework', role: 'o' }, { en: 'yet.', role: 'm' },
  ],
  baseOrder: [0, 1, 2, 3], newOrder: [0, 1, 2, 3, 4], changeAlt: [1, 3], extra: [4], noteAt: 1, note: "have + not = haven't",
  T: { show: 0, copy: 1.5, insert: 4, alt: 4.5, note: 5, end: 13 },
  narration: [
    { t: 0, text: '否定文は……' },
    { t: 4, text: 'have のすぐ後ろに not。have not は短く <em>haven\'t</em>。' },
    { t: 8.5, text: '<em>I haven\'t finished my homework yet.</em>「まだ終えていません。」' },
  ],
});

const sec4 = sectionScene({ id: 'sec4', toc: '4', versions: FULL, no: 4, title: '練習問題', sub: 'have ＋ 過去分詞',
  narration: [{ t: 0.5, text: '練習問題。（　）に入る語を選ぼう。' }] });
const pf1 = fillBlankScene({
  id: 'fill1', toc: '4', no: 1, jp: '私は3年間ずっと英語を勉強しています。',
  chunks: [{ en: 'I', role: 's' }, { en: 'have', role: 'x', label: 'have' }, { en: 'studied', role: 'v' }, { en: 'English', role: 'o' }, { en: 'for three years.', role: 'm' }],
  blank: 2, options: ['study', 'studied', 'studying'], why: 'have ＋ <em>過去分詞</em>で「ずっと〜している」。',
});
const pf2 = fillBlankScene({
  id: 'fill2', toc: '4', no: 2, jp: 'あなたは今までに京都に行ったことがありますか？',
  chunks: [{ en: 'Have', role: 'x', label: 'have' }, { en: 'you', role: 's' }, { en: 'ever', role: 'm' }, { en: 'been', role: 'v' }, { en: 'to Kyoto?', role: 'm' }],
  blank: 0, options: ['Do', 'Have', 'Are'], why: '「〜したことがありますか？」は <em>Have you ever 〜?</em>。',
});
const pf3 = fillBlankScene({
  id: 'fill3', toc: '4', no: 3, jp: 'ケンはちょうど昼ごはんを食べたところです。',
  chunks: [{ en: 'Ken', role: 's' }, { en: 'has', role: 'x', label: 'have' }, { en: 'just', role: 'm' }, { en: 'eaten', role: 'v' }, { en: 'lunch.', role: 'o' }],
  blank: 1, options: ['have', 'has', 'is'], why: '主語 Ken は三単現なので <em>has</em>。',
});

const changes = compareStackScene({
  id: 'changes', toc: '5', duration: { full: 18, digest: 15 },
  base: { html: 'I play tennis.', jp: '私はテニスをします。' },
  items: [
    { label: '継続', html: `I ${chg('have played')} tennis ${chg('for five years')}.`, jp: '5年間ずっとしている', t: 2.5 },
    { label: '経験', html: `I ${chg('have played')} tennis ${chg('twice')}.`, jp: '2回したことがある', t: 5.5 },
    { label: '完了', html: `I ${chg('have just played')} tennis.`, jp: 'ちょうどしたところ', t: 8.5 },
    { label: '疑問文', html: `${chg('Have')} you ${chg('ever played')} tennis?`, jp: 'したことがありますか？', t: 11.5 },
  ],
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形 <em>I play tennis.</em> から、何が変わったかな？' },
    { t: 2.5, text: 'have ＋ 過去分詞で、過去から今へつながる。一緒に使う語で意味が決まります。' },
    { t: 11.5, text: '疑問文は、have だけが先頭へ移動します。' },
  ],
});

export const scenes = [
  titleScene({
    kicker: '文法 Lv3-5', main: '現在完了形', sub: '過去から「今」へつながる',
    narration: [{ t: 1, text: '文法レベル3の5。現在完了形です。' }],
  }),
  sec1, perfect,
  sec2, { ...perfectUses, toc: '2' },
  sec3, perfectQuestion, perfectNegative,
  sec4, pf1, pf2, pf3,
  changes,
];
