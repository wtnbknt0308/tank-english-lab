// 文法 Lv3-3　進行形
import { titleScene, sectionScene, transformScene, fillBlankScene, compareStackScene } from '../engine/scenes.js';
import { FULL, chg } from './lv3-common.js';

export const meta = {
  code: 'Lv3-3',
  title: '進行形　「今まさに〜している」',
  toc: [
    { key: '1', label: '進行形の形' },
    { key: '2', label: '過去進行形・疑問文' },
    { key: '3', label: '練習' },
    { key: '4', label: 'シンプルな現在形からの変化' },
  ],
};

const sec1 = sectionScene({ id: 'sec1', toc: '1', no: 1, title: '進行形の形', sub: 'be動詞 ＋ -ing',
  narration: [{ t: 0.5, text: '進行形は「今まさに〜している」という言い方です。' }] });

const progressive = transformScene({
  id: 'progressive', toc: '1',
  heading: '進行形にするには？<small>現在形 → 進行形</small>',
  rows: ['現在形', '進行形'], jp: ['私はテニスをします。', '私は今テニスをしています。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'am', role: 'v', label: 'be動詞' }, { en: 'play', en2: 'play[ing]', role: 'v' },
    { en: 'tennis.', en2: 'tennis', role: 'o' }, { en: 'now.', role: 'm' },
  ],
  baseOrder: [0, 2, 3], newOrder: [0, 1, 2, 3, 4], insert: 1, changeAlt: [2, 3], extra: [4], note: 'be動詞 ＋ -ing',
  T: { show: 0, copy: 1.5, insert: 4.5, alt: 6, note: 6.5, mark: 6.5, end: 16 },
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形。<em>I play tennis.</em>　現在形は「いつもすること」。' },
    { t: 4.5, text: '「今まさにしている」と言いたいときは、be動詞を入れて、動詞に <em>-ing</em>。' },
    { t: 10, text: '<em>I am playing tennis now.</em>「私は今テニスをしています。」' },
  ],
});

const sec2 = sectionScene({ id: 'sec2', toc: '2', no: 2, title: '過去進行形・疑問文', sub: 'be動詞を変える・動かす',
  narration: [{ t: 0.5, text: '過去進行形と、進行形の疑問文です。' }] });

const pastProgressive = transformScene({
  id: 'past-progressive', toc: '2',
  heading: '過去進行形<small>現在形 → 過去進行形</small>',
  rows: ['現在形', '過去進行形'], jp: ['私はテニスをします。', '私はそのときテニスをしていました。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'was', role: 'v', label: 'be動詞' }, { en: 'play', en2: 'play[ing]', role: 'v' },
    { en: 'tennis.', en2: 'tennis', role: 'o' }, { en: 'then.', role: 'm' },
  ],
  baseOrder: [0, 2, 3], newOrder: [0, 1, 2, 3, 4], insert: 1, changeAlt: [2, 3], extra: [4], note: 'was ＋ -ing',
  T: { show: 0, copy: 1.5, insert: 4, alt: 5.5, note: 6, mark: 6, end: 14 },
  narration: [
    { t: 0, text: '過去のある時に「していた」は……' },
    { t: 4, text: 'be動詞を過去形の <em>was</em> に（you・複数なら were）。動詞に -ing。' },
    { t: 9.5, text: '<em>I was playing tennis then.</em>「そのときテニスをしていました。」' },
  ],
});

const progQuestion = transformScene({
  id: 'prog-question', toc: '2',
  heading: '進行形の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['あなたはテニスをしています。', 'あなたはテニスをしていますか？'],
  chunks: [
    { en: 'You', en2: 'you', role: 's' }, { en: 'are', en2: 'Are', role: 'v', label: 'be動詞' },
    { en: 'playing', role: 'v' }, { en: 'tennis.', en2: 'tennis?', role: 'o' },
  ],
  baseOrder: [0, 1, 2, 3], newOrder: [1, 0, 2, 3], insert: 1, changeAlt: [0, 1, 3], note: 'be動詞だけが先頭へ',
  T: { show: 0, copy: 1.5, insert: 4.5, alt: 6.5, note: 7, end: 15 },
  narration: [
    { t: 0, text: '進行形の疑問文は、be動詞の文と同じ。' },
    { t: 4.5, text: '<em>be動詞だけ</em>が先頭へ移動します。主語は動きません。' },
    { t: 10, text: '<em>Are you playing tennis?</em>　否定文は be動詞の後ろに not。' },
  ],
});

const sec3 = sectionScene({ id: 'sec3', toc: '3', versions: FULL, no: 3, title: '練習問題', sub: 'be動詞 ＋ -ing',
  narration: [{ t: 0.5, text: '練習問題。（　）に入る語を選ぼう。' }] });
const g1 = fillBlankScene({
  id: 'fill1', toc: '3', no: 1, jp: '彼は今テレビを見ています。',
  chunks: [{ en: 'He', role: 's' }, { en: 'is', role: 'v', label: 'be動詞' }, { en: 'watching', role: 'v' }, { en: 'TV', role: 'o' }, { en: 'now.', role: 'm' }],
  blank: 2, options: ['watch', 'watching', 'watched'], why: 'be動詞 ＋ <em>-ing</em> で「〜している」。',
});
const g2 = fillBlankScene({
  id: 'fill2', toc: '3', no: 2, jp: '私はそのとき本を読んでいました。',
  chunks: [{ en: 'I', role: 's' }, { en: 'was', role: 'v', label: 'be動詞' }, { en: 'reading', role: 'v' }, { en: 'a book', role: 'o' }, { en: 'then.', role: 'm' }],
  blank: 1, options: ['am', 'was', 'did'], why: '「そのとき〜していた」は過去なので <em>was</em>。',
});
const g3 = fillBlankScene({
  id: 'fill3', toc: '3', no: 3, jp: '彼らは今サッカーをしています。',
  chunks: [{ en: 'They', role: 's' }, { en: 'are', role: 'v', label: 'be動詞' }, { en: 'playing', role: 'v' }, { en: 'soccer', role: 'o' }, { en: 'now.', role: 'm' }],
  blank: 1, options: ['is', 'are', 'do'], why: '主語が they なので be動詞は <em>are</em>。',
});

const changes = compareStackScene({
  id: 'changes', toc: '4', duration: { full: 17, digest: 14 },
  base: { html: 'I play tennis.', jp: '私はテニスをします。' },
  items: [
    { label: '進行形', html: `I ${chg('am playing')} tennis now.`, jp: '今テニスをしている', t: 2.5 },
    { label: '過去進行形', html: `I ${chg('was playing')} tennis then.`, jp: 'そのときテニスをしていた', t: 5.5 },
    { label: '疑問文', html: `${chg('Are')} you ${chg('playing')} tennis?`, jp: 'テニスをしていますか？', t: 8.5 },
    { label: '否定文', html: `I ${chg('am not playing')} tennis.`, jp: 'テニスをしていない', t: 11 },
  ],
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形 <em>I play tennis.</em> から、何が変わったかな？' },
    { t: 2.5, text: 'be動詞 ＋ -ing で「今している」。be動詞を was にすると「そのときしていた」。' },
    { t: 8.5, text: '疑問文・否定文は、be動詞の文と同じルールです。' },
  ],
});

export const scenes = [
  titleScene({
    kicker: '文法 Lv3-3', main: '進行形', sub: '「今まさに〜している」',
    narration: [{ t: 1, text: '文法レベル3の3。進行形です。' }],
  }),
  sec1, progressive,
  sec2, pastProgressive, progQuestion,
  sec3, g1, g2, g3,
  changes,
];
