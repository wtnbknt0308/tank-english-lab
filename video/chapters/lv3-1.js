// 文法 Lv3-1　現在形（三単現）・過去形・未来表現
// いちばんシンプルな現在形「I play tennis.」を上に、新しい表現を下に並べて、何がどう変わるかを見せる。
// plays の s は、かくれている does の s。played の d は、かくれている did の d（同じ印で光らせる）。
import { h } from '../engine/parts.js';
import { titleScene, sectionScene, transformScene, fillBlankScene, compareStackScene } from '../engine/scenes.js';
import { BOTH, FULL, chg, hook, timeline } from './lv3-common.js';

export const meta = {
  code: 'Lv3-1',
  title: '現在形（三単現）・過去形・未来表現',
  toc: [
    { key: '1', label: '現在形と三単現（does）' },
    { key: '2', label: '過去形（did）' },
    { key: '3', label: '未来表現（will）' },
    { key: '4', label: '練習' },
    { key: '5', label: 'シンプルな現在形からの変化' },
  ],
};

// ---------------------------------------------------------------------------
// 1 現在形と三単現
const sec1 = sectionScene({ id: 'sec1', toc: '1', no: 1, title: '現在形と三単現', sub: '主語が he / she / it のとき',
  narration: [{ t: 0.5, text: 'まずは現在形。主語によって、動詞の形が少し変わります。' }] });

const thirdPerson = transformScene({
  id: 'third-person', toc: '1',
  heading: '三単現の -s<small>I → He にすると？</small>',
  rows: ['現在形', '三単現'], jp: ['私はテニスをします。', '彼はテニスをします。'],
  chunks: [
    { en: 'I', en2: 'He', role: 's' }, { en: 'play', en2: 'play[s]', role: 'v' }, { en: 'tennis.', role: 'o' },
  ],
  baseOrder: [0, 1, 2], newOrder: [0, 1, 2], changeAlt: [0, 1], noteAt: 1, note: '動詞に -s',
  T: { show: 0, copy: 1.5, insert: 4, alt: 4.5, note: 5.5, mark: 5.5, end: 17 },
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形。<em>I play tennis.</em>「私はテニスをします。」' },
    { t: 4, text: '主語を <em>He</em> にすると、動詞に <em>-s</em> がつきます。<em>He plays tennis.</em>' },
    { t: 9, text: 'he・she・it など「自分と相手以外の1人」が主語のとき、動詞に -s（-es）。' },
    { t: 13.5, text: 'これを<em>三人称単数現在</em>、略して<em>三単現</em>と言います。' },
  ],
});

const doesQuestion = transformScene({
  id: 'does-question', toc: '1',
  heading: '三単現の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['彼はテニスをします。', '彼はテニスをしますか？'],
  chunks: [
    { en: 'doe[s]', en2: 'Doe[s]', role: 'x' }, { en: 'He', en2: 'he', role: 's' },
    { en: 'play[s]', en2: 'play', role: 'v' }, { en: 'tennis.', en2: 'tennis?', role: 'o' },
  ],
  baseOrder: [1, 2, 3], newOrder: [0, 1, 2, 3], insert: 0, behind: 2, changeAlt: [0, 1, 2, 3],
  peekNote: 'かくれている does', note: '質問の合図',
  T: { show: 0, copy: 1.5, peek: 3, mark: 7, insert: 11, alt: 12.5, note: 13.5, end: 22 },
  narration: [
    { t: 0, text: '三単現の疑問文。<em>He plays tennis.</em>' },
    { t: 3.5, text: '実は plays の後ろには、<em>does</em> がかくれています。' },
    { t: 7, text: 'plays の最後の <em>s</em> は、かくれている does の <em>s</em> と同じもの！' },
    { t: 11, text: '疑問文では does だけが先頭へ移動。s も一緒に持っていくので……' },
    { t: 14.5, text: '動詞は<em>原形</em>の play にもどります。主語は動きません。' },
    { t: 18, text: '<em>Does he play tennis?</em>' },
  ],
});

const doesNegative = transformScene({
  id: 'does-negative', toc: '1',
  heading: '三単現の否定文<small>肯定文 → 否定文</small>',
  rows: ['肯定文', '否定文'], jp: ['彼はテニスをします。', '彼はテニスをしません。'],
  chunks: [
    { en: 'He', role: 's' }, { en: 'doe[s]', en2: "doe[s]n't", role: 'x' },
    { en: 'play[s]', en2: 'play', role: 'v' }, { en: 'tennis.', role: 'o' },
  ],
  baseOrder: [0, 2, 3], newOrder: [0, 1, 2, 3], insert: 1, behind: 2, changeAlt: [1, 2],
  peekNote: 'かくれている does', note: "does + not = doesn't",
  T: { show: 0, copy: 1.5, peek: 2.5, mark: 5, insert: 8, alt: 10, note: 10, end: 18 },
  narration: [
    { t: 0, text: '三単現の否定文。' },
    { t: 3, text: 'ここでも plays の s は、かくれている <em>does</em> の s。' },
    { t: 8, text: 'does が動詞の前に出て、not とくっついて <em>doesn\'t</em>。' },
    { t: 12, text: 's は does が持っていったので、動詞は<em>原形</em>。<em>He doesn\'t play tennis.</em>' },
  ],
});

// ---------------------------------------------------------------------------
// 2 過去形
const sec2 = sectionScene({ id: 'sec2', toc: '2', no: 2, title: '過去形', sub: '終わったことを言う',
  narration: [{ t: 0.5, text: '次は過去形。終わったことの言い方です。' }] });

const toPast = transformScene({
  id: 'to-past', toc: '2',
  heading: '過去形にするには？<small>現在形 → 過去形</small>',
  rows: ['現在形', '過去形'], jp: ['私はテニスをします。', '私はテニスをしました。'],
  chunks: [{ en: 'I', role: 's' }, { en: 'play', en2: 'playe[d]', role: 'v' }, { en: 'tennis.', role: 'o' }],
  baseOrder: [0, 1, 2], newOrder: [0, 1, 2], changeAlt: [1], noteAt: 1, note: '-ed で過去',
  T: { show: 0, copy: 1.5, insert: 4, alt: 4.5, note: 5.5, mark: 99, end: 15 },
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形。<em>I play tennis.</em>' },
    { t: 4, text: '動詞に <em>-ed</em> をつけると過去形。<em>play → played</em>。「テニスをしました」' },
    { t: 9, text: '語順はそのまま。変わるのは述部だけ！' },
    { t: 11.5, text: '<em>go → went</em> のように、形が大きく変わる動詞（不規則動詞）もあります。' },
  ],
});

const pastQuestion = transformScene({
  id: 'past-question', toc: '2',
  heading: '過去形の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['あなたはテニスをしました。', 'あなたはテニスをしましたか？'],
  chunks: [
    { en: 'di[d]', en2: 'Di[d]', role: 'x' }, { en: 'You', en2: 'you', role: 's' },
    { en: 'playe[d]', en2: 'play', role: 'v' }, { en: 'tennis.', en2: 'tennis?', role: 'o' },
  ],
  baseOrder: [1, 2, 3], newOrder: [0, 1, 2, 3], insert: 0, behind: 2, changeAlt: [0, 1, 2, 3],
  peekNote: 'かくれている did', note: '質問の合図',
  T: { show: 0, copy: 1.5, peek: 3, mark: 7, insert: 11, alt: 12.5, note: 13.5, end: 22 },
  narration: [
    { t: 0, text: '過去形の疑問文。<em>You played tennis.</em>' },
    { t: 3.5, text: 'played の後ろには、<em>did</em> がかくれています。do の過去形です。' },
    { t: 7, text: 'played の最後の <em>d</em> は、かくれている did の <em>d</em> と同じもの！' },
    { t: 11, text: '疑問文では did だけが先頭へ移動。d も一緒に持っていくので……' },
    { t: 14.5, text: '動詞は<em>原形</em>の play にもどります。主語は動きません。' },
    { t: 18, text: '<em>Did you play tennis?</em>' },
  ],
});

const pastNegative = transformScene({
  id: 'past-negative', toc: '2',
  heading: '過去形の否定文<small>肯定文 → 否定文</small>',
  rows: ['肯定文', '否定文'], jp: ['私はテニスをしました。', '私はテニスをしませんでした。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'di[d]', en2: "di[d]n't", role: 'x' },
    { en: 'playe[d]', en2: 'play', role: 'v' }, { en: 'tennis.', role: 'o' },
  ],
  baseOrder: [0, 2, 3], newOrder: [0, 1, 2, 3], insert: 1, behind: 2, changeAlt: [1, 2],
  peekNote: 'かくれている did', note: "did + not = didn't",
  T: { show: 0, copy: 1.5, peek: 2.5, mark: 5, insert: 8, alt: 10, note: 10, end: 18 },
  narration: [
    { t: 0, text: '過去形の否定文。' },
    { t: 3, text: 'played の d は、かくれている <em>did</em> の d。' },
    { t: 8, text: 'did が動詞の前に出て、not とくっついて <em>didn\'t</em>。' },
    { t: 12, text: '動詞は<em>原形</em>。<em>I didn\'t play tennis.</em>　went のような不規則動詞でも同じです。' },
  ],
});

// ---------------------------------------------------------------------------
// 3 未来表現
const sec3 = sectionScene({ id: 'sec3', toc: '3', no: 3, title: '未来表現', sub: 'これからのことを言う',
  narration: [{ t: 0.5, text: '最後は未来。これからのことの言い方です。' }] });

const future = transformScene({
  id: 'future', toc: '3',
  heading: '未来のことを言うには？<small>現在形 → 未来</small>',
  rows: ['現在形', '未来'], jp: ['私はテニスをします。', '私はテニスをするつもりです。'],
  chunks: [{ en: 'I', role: 's' }, { en: 'will', role: 'x', label: '助動詞' }, { en: 'play', role: 'v' }, { en: 'tennis.', role: 'o' }],
  baseOrder: [0, 2, 3], newOrder: [0, 1, 2, 3], insert: 1, note: 'will ＋ 原形',
  T: { show: 0, copy: 1.5, insert: 4, alt: 6, note: 6, end: 15 },
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形。<em>I play tennis.</em>' },
    { t: 4, text: '動詞の前に <em>will</em> を置くと未来。動詞は<em>原形</em>のまま。' },
    { t: 8.5, text: '<em>I will play tennis.</em>「テニスをするつもりです。」' },
    { t: 11.5, text: '<em>be going to ＋ 原形</em>でも、未来を表せます。' },
  ],
});

// ---------------------------------------------------------------------------
// 4 練習
const sec4 = sectionScene({ id: 'sec4', toc: '4', versions: FULL, no: 4, title: '練習問題', sub: '三単現・過去形・未来',
  narration: [{ t: 0.5, text: '練習問題。（　）に入る語を選ぼう。' }] });
const f1 = fillBlankScene({
  id: 'fill1', toc: '4', no: 1, jp: '彼女は毎日英語を勉強します。',
  chunks: [{ en: 'She', role: 's' }, { en: 'studies', role: 'v' }, { en: 'English', role: 'o' }, { en: 'every day.', role: 'm' }],
  blank: 1, options: ['study', 'studies', 'studied'], why: '主語が she なので三単現。study は y を i にかえて <em>-es</em>。',
});
const f2 = fillBlankScene({
  id: 'fill2', toc: '4', no: 2, jp: 'あなたのお兄さんはネコが好きですか？',
  chunks: [{ en: 'Does', role: 'x' }, { en: 'your brother', role: 's' }, { en: 'like', role: 'v' }, { en: 'cats?', role: 'o' }],
  blank: 0, options: ['Do', 'Does', 'Is'], why: 'your brother は三単現。かくれている <em>does</em> が先頭へ。',
});
const f3 = fillBlankScene({
  id: 'fill3', toc: '4', no: 3, jp: '私は昨日サッカーをしました。',
  chunks: [{ en: 'I', role: 's' }, { en: 'played', role: 'v' }, { en: 'soccer', role: 'o' }, { en: 'yesterday.', role: 'm' }],
  blank: 1, options: ['play', 'played', 'will play'], why: '「昨日」のことなので、過去形の <em>played</em>。',
});
const f4 = fillBlankScene({
  id: 'fill4', toc: '4', no: 4, jp: 'あなたは昨日テレビを見ましたか？',
  chunks: [{ en: 'Did', role: 'x' }, { en: 'you', role: 's' }, { en: 'watch', role: 'v' }, { en: 'TV', role: 'o' }, { en: 'yesterday?', role: 'm' }],
  blank: 0, options: ['Do', 'Did', 'Will'], why: '「昨日」の質問なので <em>Did</em>。動詞 watch は原形。',
});
const f5 = fillBlankScene({
  id: 'fill5', toc: '4', no: 5, jp: '明日は雨がふるでしょう。',
  chunks: [{ en: 'It', role: 's' }, { en: 'will', role: 'x', label: '助動詞' }, { en: 'rain', role: 'v' }, { en: 'tomorrow.', role: 'm' }],
  blank: 1, options: ['will', 'did', 'is'], why: '未来のことなので <em>will</em>。後ろの動詞は原形 rain。',
});

// ---------------------------------------------------------------------------
// 5 シンプルな現在形からの変化
const changes = compareStackScene({
  id: 'changes', toc: '5', duration: { full: 20, digest: 16 },
  base: { html: 'I play tennis.', jp: '私はテニスをします。' },
  items: [
    { label: '三単現', html: `He ${chg('plays')} tennis.`, jp: '彼はテニスをします。', t: 2.5 },
    { label: '疑問文', html: `${chg('Does')} he ${chg('play')} tennis?`, jp: '彼はテニスをしますか？', t: 5 },
    { label: '過去形', html: `I ${chg('played')} tennis.`, jp: '私はテニスをしました。', t: 7.5 },
    { label: '疑問文', html: `${chg('Did')} you ${chg('play')} tennis?`, jp: 'テニスをしましたか？', t: 10 },
    { label: '未来', html: `I ${chg('will play')} tennis.`, jp: '私はテニスをするつもりです。', t: 12.5 },
  ],
  narration: [
    { t: 0, text: 'いちばんシンプルな現在形 <em>I play tennis.</em> から、何が変わったかな？' },
    { t: 2.5, text: '三単現は -s。s は、かくれている does の s。' },
    { t: 7.5, text: '過去形は -ed。d は、かくれている did の d。' },
    { t: 12.5, text: '未来は will ＋ 原形。語順はどれも同じ。変わるのは述部だけ！' },
  ],
});

export const scenes = [
  titleScene({
    kicker: '文法 Lv3-1', main: '現在形（三単現）・<br>過去形・未来表現', sub: '「いつ」のことかを述部で表す',
    narration: [{ t: 1, text: '文法レベル3の1。現在形・過去形・未来の表し方です。' }],
  }),
  hook, { ...timeline, toc: null },
  sec1, thirdPerson, doesQuestion, doesNegative,
  sec2, toPast, pastQuestion, pastNegative,
  sec3, future,
  sec4, f1, f2, f3, f4, f5,
  changes,
];
