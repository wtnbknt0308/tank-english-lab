// 文法 Lv3-4　受動態
import { titleScene, sectionScene, transformScene, fillBlankScene, compareStackScene } from '../engine/scenes.js';
import { FULL, chg, passive } from './lv3-common.js';

export const meta = {
  code: 'Lv3-4',
  title: '受動態　「〜される」',
  toc: [
    { key: '1', label: '受動態の形' },
    { key: '2', label: '疑問文・by の省略' },
    { key: '3', label: '練習' },
    { key: '4', label: 'シンプルな現在形からの変化' },
  ],
};

const sec1 = sectionScene({ id: 'sec1', toc: '1', no: 1, title: '受動態の形', sub: 'be動詞 ＋ 過去分詞',
  narration: [{ t: 0.5, text: '受動態は「〜される」という言い方です。' }] });

const sec2 = sectionScene({ id: 'sec2', toc: '2', no: 2, title: '疑問文・by の省略', sub: 'be動詞だけが動く',
  narration: [{ t: 0.5, text: '受動態の疑問文と、by を使わない言い方です。' }] });

const passiveQuestion = transformScene({
  id: 'passive-question', toc: '2',
  heading: '受動態の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['テニスは日本でされています。', 'テニスは日本でされていますか？'],
  chunks: [
    { en: 'Tennis', en2: 'tennis', role: 's' }, { en: 'is', en2: 'Is', role: 'v', label: 'be動詞' },
    { en: 'played', role: 'v' }, { en: 'in Japan.', en2: 'in Japan?', role: 'm' },
  ],
  baseOrder: [0, 1, 2, 3], newOrder: [1, 0, 2, 3], insert: 1, changeAlt: [0, 1, 3], note: 'be動詞だけが先頭へ',
  T: { show: 0, copy: 1.5, insert: 6, alt: 8, note: 8.5, end: 17 },
  narration: [
    { t: 0, text: '<em>Tennis is played in Japan.</em>「テニスは日本でされています。」' },
    { t: 3, text: 'だれがするかを言う必要がないときは、<em>by</em> はつけません。' },
    { t: 6, text: '受動態も be動詞の文。疑問文は <em>be動詞だけ</em>が先頭へ。主語は動きません。' },
    { t: 12, text: '<em>Is tennis played in Japan?</em>' },
  ],
});

const sec3 = sectionScene({ id: 'sec3', toc: '3', versions: FULL, no: 3, title: '練習問題', sub: 'be動詞 ＋ 過去分詞',
  narration: [{ t: 0.5, text: '練習問題。（　）に入る語を選ぼう。' }] });
const pv1 = fillBlankScene({
  id: 'fill1', toc: '3', no: 1, jp: 'この部屋は毎日そうじされます。',
  chunks: [{ en: 'This room', role: 's' }, { en: 'is', role: 'v', label: 'be動詞' }, { en: 'cleaned', role: 'v' }, { en: 'every day.', role: 'm' }],
  blank: 2, options: ['clean', 'cleaned', 'cleaning'], why: '「〜される」は be動詞 ＋ <em>過去分詞</em>。',
});
const pv2 = fillBlankScene({
  id: 'fill2', toc: '3', no: 2, jp: 'この本は漱石によって書かれました。',
  chunks: [{ en: 'This book', role: 's' }, { en: 'was', role: 'v', label: 'be動詞' }, { en: 'written', role: 'v' }, { en: 'by Soseki.', role: 'm' }],
  blank: 1, options: ['is', 'was', 'did'], why: '「書かれた」は過去なので <em>was</em>。written は write の過去分詞。',
});
const pv3 = fillBlankScene({
  id: 'fill3', toc: '3', no: 3, jp: 'この歌は多くの人に愛されています。',
  chunks: [{ en: 'This song', role: 's' }, { en: 'is', role: 'v', label: 'be動詞' }, { en: 'loved', role: 'v' }, { en: 'by many people.', role: 'm' }],
  blank: 2, options: ['love', 'loved', 'loving'], why: 'be動詞 ＋ 過去分詞 <em>loved</em> で「愛されている」。',
});

const changes = compareStackScene({
  id: 'changes', toc: '4', duration: { full: 16, digest: 13 },
  base: { html: 'Many people play tennis.', jp: '多くの人がテニスをします。' },
  items: [
    { label: '受動態', html: `${chg('Tennis')} ${chg('is played')} by many people.`, jp: 'テニスは多くの人にされている', t: 2.5 },
    { label: 'by なし', html: `Tennis ${chg('is played')} in Japan.`, jp: 'テニスは日本でされている', t: 6 },
    { label: '疑問文', html: `${chg('Is')} tennis played in Japan?`, jp: 'テニスは日本でされていますか？', t: 9 },
  ],
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形 <em>Many people play tennis.</em> から、何が変わったかな？' },
    { t: 2.5, text: '「〜される」ものが主役になって先頭へ。動詞は be動詞 ＋ 過去分詞。' },
    { t: 9, text: '疑問文は、be動詞だけが先頭へ移動します。' },
  ],
});

export const scenes = [
  titleScene({
    kicker: '文法 Lv3-4', main: '受動態', sub: '「〜される」',
    narration: [{ t: 1, text: '文法レベル3の4。受動態です。' }],
  }),
  sec1, { ...passive, toc: '1' },
  sec2, passiveQuestion,
  sec3, pv1, pv2, pv3,
  changes,
];
