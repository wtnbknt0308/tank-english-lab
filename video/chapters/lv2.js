// 文法 Lv2　日本語と英語の違い：なぜあなたは英語がわからなくなるのか
import { h, ChunkRow, seg, ease, easeOutBack, fadeIn, ROLE } from '../engine/parts.js';
import { titleScene, sectionScene, transformScene, fillBlankScene, answerScene } from '../engine/scenes.js';

export const meta = { code: 'Lv2', title: '日本語と英語の違い　なぜあなたは英語がわからなくなるのか' };
// 英語式の言葉の入れ替えと、文型（一般動詞の文・be動詞の文）の切り替え
// 右上の目次。scene.toc で今の項目（と表のマス）を光らせる
meta.toc = [
  { key: '1', label: '一般動詞の文とbe動詞の文' },
  { key: '2', label: '練習　be動詞？一般動詞？' },
  { key: '3', label: '疑問文・答え方・否定文', grid: {
    rows: [{ key: 'gen', label: '一般動詞' }, { key: 'be', label: 'be動詞' }],
    cols: [{ key: 'q', label: '疑問文' }, { key: 'a', label: '答え方' }, { key: 'n', label: '否定文' }],
  } },
  { key: '4', label: '練習　書きかえ・答え方' },
];

const col = (role, text) => `<span style="color:${ROLE[role].color}">${text}</span>`;
const BOTH = ['full', 'digest'];

// ---- つかみ：日本語は文末を変えるだけ、英語は do や be動詞が移動する ----
const hook = {
  id: 'hook', versions: BOTH, duration: 16,
  narration: [
    { t: 0, text: '日本語の疑問文・否定文は、文の<em>最後</em>を「〜か」「〜ません」に変えるだけ。' },
    { t: 3.5, text: '言葉の順番は、どこも変わりません。' },
    { t: 7, text: '英語はちがいます。<em>do</em> や be動詞が、文の前へ<em>移動</em>します。' },
    { t: 11, text: '英語がわからなくなる原因は、<em>語順</em>（Lv1）と、この<em>英語式の言葉の動き方</em>です。' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.innerHTML = '疑問文・否定文の作り方、日本語と英語でどうちがう？'; root.appendChild(head);
    const line = (top, html, size = 60) => {
      const e = h('div', 'sentence'); e.style.top = top + 'px'; e.style.fontSize = size + 'px'; e.innerHTML = html;
      root.appendChild(e); return e;
    };
    const hl = (t) => `<span class="hl">${t}</span>`;
    const jp1 = line(270, `あなたは英語を勉強します${hl('か')}？`);
    const jp2 = line(370, `私は英語を勉強し${hl('ません')}。`);
    const en1 = line(560, `${hl('Do')} you study English?`, 68);
    const en2 = line(665, `I ${hl("don't")} study English.`, 68);
    const tag = (top, text, bg) => {
      const e = h('div', 'badge', text); e.style.left = '1440px'; e.style.top = top + 'px'; e.style.background = bg;
      root.appendChild(e); return e;
    };
    const t1 = tag(330, '最後を変えるだけ', 'var(--sub)');
    const t2 = tag(620, '言葉が移動する', 'var(--x)');
    return { head, jp1, jp2, en1, en2, t1, t2, jpHl: [...jp1.querySelectorAll('.hl'), ...jp2.querySelectorAll('.hl')], enHl: [...en1.querySelectorAll('.hl'), ...en2.querySelectorAll('.hl')] };
  },
  render(st, t) {
    fadeIn(st.head, t, 0);
    fadeIn(st.jp1, t, 0.8); fadeIn(st.jp2, t, 1.4);
    fadeIn(st.en1, t, 7); fadeIn(st.en2, t, 7.6);
    const a = ease(seg(t, 3.5, 4.2)), b = ease(seg(t, 9, 9.7));
    st.jpHl.forEach((e) => { e.style.background = `rgba(255,214,10,${a})`; e.style.borderRadius = '10px'; });
    st.enHl.forEach((e) => { e.style.background = `rgba(242,157,18,${b})`; e.style.color = b > 0.5 ? '#fff' : ''; e.style.borderRadius = '10px'; e.style.padding = '0 8px'; });
    fadeIn(st.t1, t, 4.2); fadeIn(st.t2, t, 9.7);
  },
};

// ======== 1 一般動詞の文と be動詞の文 ========
const sec1 = sectionScene({
  id: 'sec1', toc: '1', no: 1, title: '一般動詞の文と be動詞の文', sub: '意味と使い方をくらべよう',
  narration: [{ t: 0.5, text: '1つ目のポイント。一般動詞の文と、be動詞の文をくらべます。' }],
});

const compare = {
  id: 'compare', toc: '1', versions: BOTH, duration: 24,
  narration: [
    { t: 0, text: '英語の文には、大きく2つのタイプがあります。' },
    { t: 2.5, text: '1つ目は <em>be動詞</em> の文。<em>I am a student.</em>「私は生徒です。」' },
    { t: 6.5, text: 'be動詞は「〜です」。主語と後ろの言葉を<em>イコール</em>でつなぎます。I ＝ a student。' },
    { t: 11, text: '2つ目は <em>一般動詞</em> の文。<em>I play tennis.</em>「私はテニスをします。」' },
    { t: 15, text: '一般動詞は「〜する」という<em>動作</em>を表します。後ろには「何を」が来ます。' },
    { t: 19, text: '述部の動詞は1つの文に1つだけ。be動詞か一般動詞か、どちらかを使います。' },
  ],
  setup(root) {
    const mkRow = (y, chunks) => new ChunkRow(root, chunks, { y });
    const r1 = mkRow(300, [
      { en: 'I', role: 's' }, { en: 'am', role: 'v', label: 'be動詞' }, { en: 'a student.', role: 'c' },
    ]);
    const r2 = mkRow(630, [
      { en: 'I', role: 's' }, { en: 'play', role: 'v', label: '一般動詞' }, { en: 'tennis.', role: 'o' },
    ]);
    const line = (top, html) => { const e = h('div', 'sentence'); e.style.top = top + 'px'; e.style.fontSize = '44px'; e.style.color = 'var(--sub)'; e.innerHTML = html; root.appendChild(e); return e; };
    const j1 = line(495, '「私は生徒です。」'), j2 = line(825, '「私はテニスをします。」');
    const tag = (top, text, bg) => { const e = h('div', 'badge', text); e.style.left = '80px'; e.style.top = top + 'px'; e.style.background = bg; e.style.fontSize = '38px'; root.appendChild(e); return e; };
    const t1 = tag(332, 'be動詞の文', ROLE.c.color), t2 = tag(662, '一般動詞の文', ROLE.v.color);
    const note = (top, text) => { const e = h('div', 'badge', text); e.style.left = '1280px'; e.style.top = top + 'px'; e.style.background = 'var(--x)'; e.style.fontSize = '38px'; root.appendChild(e); return e; };
    const n1 = note(332, 'I ＝ a student'), n2 = note(662, '動作を表す');
    return { r1, r2, j1, j2, t1, t2, n1, n2 };
  },
  render(st, t) {
    const show = (row, a) => {
      const xs = row.positions([0, 1, 2], 'en');
      row.chunks.forEach((_, i) => row.set(i, { x: xs[i], w: row.w.en[i], lang: 1, colored: 1, label: 1, opacity: seg(t, a + i * 0.2, a + 0.4 + i * 0.2) }));
    };
    show(st.r1, 2.5); show(st.r2, 11);
    fadeIn(st.t1, t, 2.5); fadeIn(st.j1, t, 3.5);
    fadeIn(st.t2, t, 11); fadeIn(st.j2, t, 12);
    fadeIn(st.n1, t, 7); fadeIn(st.n2, t, 15.5);
  },
};

const beTable = {
  id: 'be-table', toc: '1', versions: BOTH, duration: 13,
  narration: [
    { t: 0, text: 'be動詞は、主語によって形が変わります。' },
    { t: 3, text: '<em>I</em> のときは <em>am</em>。<em>you</em> や、2人以上のときは <em>are</em>。' },
    { t: 7.5, text: '<em>he・she・it</em> など、自分と相手以外の1人のときは <em>is</em>。' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = 'be動詞は主語で変わる'; root.appendChild(head);
    const rows = [['I', 'am'], ['you / we / they', 'are'], ['he / she / it', 'is']].map(([s, v], i) => {
      const b = h('div', 'box'); b.style.left = '460px'; b.style.width = '1000px'; b.style.top = 300 + i * 170 + 'px'; b.style.height = '130px';
      b.innerHTML = `<div style="position:absolute;left:50px;top:0;bottom:0;display:flex;align-items:center;font-size:56px;font-weight:900;color:${ROLE.s.color}">${s}</div>
        <div style="position:absolute;left:560px;top:0;bottom:0;display:flex;align-items:center;font-size:56px;font-weight:900;color:var(--sub)">→</div>
        <div style="position:absolute;left:680px;top:0;bottom:0;display:flex;align-items:center;font-size:64px;font-weight:900;color:${ROLE.v.color}">${v}</div>`;
      root.appendChild(b); return b;
    });
    return { head, rows };
  },
  render({ head, rows }, t) {
    fadeIn(head, t, 0);
    [3, 4.5, 7.5].forEach((a, i) => fadeIn(rows[i], t, a));
  },
};

const mistake = {
  id: 'mistake', toc: '1', versions: ['full'], duration: 12,
  narration: [
    { t: 0, text: 'よくあるまちがい。<em>I am play tennis.</em>' },
    { t: 3.5, text: 'be動詞の am と、一般動詞の play。述部の動詞が2つになっています。' },
    { t: 7.5, text: '動作を言うときは、一般動詞だけ。<em>I play tennis.</em>' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = 'よくあるまちがい'; root.appendChild(head);
    const line = (top, html, size = 84) => { const e = h('div', 'sentence'); e.style.top = top + 'px'; e.style.fontSize = size + 'px'; e.innerHTML = html; root.appendChild(e); return e; };
    const bad = line(300, `I <span class="am" style="position:relative;color:${ROLE.v.color}">am</span> <span style="color:${ROLE.v.color}">play</span> tennis.`);
    const strike = h('div'); strike.style.cssText = 'position:absolute;height:10px;background:#e0483e;border-radius:5px;'; root.appendChild(strike);
    const ng = h('div', 'mark ng', '✗'); ng.style.left = '1420px'; ng.style.top = '250px'; ng.style.fontSize = '130px';
    const good = line(560, `I <span style="color:${ROLE.v.color}">play</span> tennis.`);
    const ok = h('div', 'mark ok', '✓'); ok.style.left = '1300px'; ok.style.top = '510px'; ok.style.fontSize = '130px';
    root.append(ng, ok);
    return { head, bad, strike, ng, good, ok, am: bad.querySelector('.am') };
  },
  render(st, t) {
    fadeIn(st.head, t, 0); fadeIn(st.bad, t, 0.4);
    st.ng.style.opacity = seg(t, 3.5, 3.7); st.ng.style.transform = `scale(${easeOutBack(seg(t, 3.5, 4))})`;
    const r = st.am.getBoundingClientRect();
    st.strike.style.left = r.left - 6 + 'px'; st.strike.style.top = r.top + r.height / 2 + 'px';
    st.strike.style.width = (r.width + 12) * ease(seg(t, 4.5, 5.2)) + 'px';
    fadeIn(st.good, t, 7.5);
    st.ok.style.opacity = seg(t, 8.2, 8.4); st.ok.style.transform = `scale(${easeOutBack(seg(t, 8.2, 8.7))})`;
  },
};

// ======== 2 練習問題 ========
const sec2 = sectionScene({ id: 'sec2', toc: '2', versions: ['full'], no: 2, title: '練習問題', sub: 'be動詞？ それとも一般動詞？',
  narration: [{ t: 0.5, text: '練習問題。be動詞と一般動詞、どちらが入るかな？' }] });
const f1 = fillBlankScene({
  id: 'fill1', toc: '2', no: 1, jp: '私は中学生です。',
  chunks: [{ en: 'I', role: 's' }, { en: 'am', role: 'v', label: 'be動詞' }, { en: 'a junior high school student.', role: 'c' }],
  blank: 1, options: ['am', 'are', 'play'],
  why: '「〜です」で、I ＝ 中学生。主語が I なので <em>am</em>。',
});
const f2 = fillBlankScene({
  id: 'fill2', toc: '2', no: 2, jp: '私たちは毎日サッカーをします。',
  chunks: [{ en: 'We', role: 's' }, { en: 'play', role: 'v', label: '一般動詞' }, { en: 'soccer', role: 'o' }, { en: 'every day.', role: 'm' }],
  blank: 1, options: ['are', 'play', 'is'],
  why: '「サッカーをする」は動作なので、一般動詞の <em>play</em>。',
});
const f3 = fillBlankScene({
  id: 'fill3', toc: '2', no: 3, jp: 'あなたはとても親切です。',
  chunks: [{ en: 'You', role: 's' }, { en: 'are', role: 'v', label: 'be動詞' }, { en: 'very kind.', role: 'c' }],
  blank: 1, options: ['am', 'are', 'like'],
  why: '「〜です」で、you ＝ 親切。主語が you なので <em>are</em>。',
});

// ======== 3 肯定・否定・疑問の作り方と答え方 ========
const sec3 = sectionScene({ id: 'sec3', toc: '3', no: 3, title: '否定文・疑問文の作り方と答え方', sub: '一般動詞の文 → be動詞の文',
  narration: [{ t: 0.5, text: '3つ目のポイント。否定文・疑問文の作り方と、答え方です。' }] });

// ---- 疑問文：一般動詞の後ろにかくれていた do が、先頭へスライドしてくる ----
const question = transformScene({
  id: 'question', toc: { item: '3', row: 'gen', col: 'q' },
  rows: ['肯定文', '疑問文'], jp: ['あなたは毎日学校で英語を勉強します。', 'あなたは毎日学校で英語を勉強しますか？'],
  heading: '一般動詞の疑問文<small>肯定文 → 疑問文</small>',
  chunks: [
    { en: 'do', en2: 'Do', role: 'x' },
    { en: 'You', en2: 'you', role: 's' },
    { en: 'study', role: 'v' },
    { en: 'English', role: 'o' },
    { en: 'at school', role: 'm' },
    { en: 'every day.', en2: 'every day?', role: 'm' },
  ],
  baseOrder: [1, 2, 3, 4, 5], newOrder: [0, 1, 2, 3, 4, 5], insert: 0, behind: 2, changeAlt: [0, 1, 5],
  peekNote: 'かくれている do', note: '質問の合図',
  T: { show: 0, copy: 1.5, peek: 2.5, insert: 8, alt: 10, note: 11, end: 19 },
  narration: [
    { t: 0, text: '「あなたは毎日学校で英語を勉強します。」これを疑問文にします。' },
    { t: 3.5, text: '実は、一般動詞 <em>study</em> の後ろには <em>do</em> がかくれています。' },
    { t: 8, text: '疑問文では、かくれていた <em>do</em> が文の先頭に出てきます。' },
    { t: 11, text: '<em>Do</em> は「これから質問しますよ」の合図。最後は「?」に変わります。' },
    { t: 15, text: '<em>Do you study English at school every day?</em>　後ろの語順はそのまま！' },
  ],
});

// ---- 否定文：かくれていた do が動詞の前に出て、not とくっつく ----
const negative = transformScene({
  id: 'negative', toc: { item: '3', row: 'gen', col: 'n' },
  rows: ['肯定文', '否定文'], jp: ['私は毎日学校で英語を勉強します。', '私は毎日学校で英語を勉強しません。'],
  heading: '一般動詞の否定文<small>肯定文 → 否定文</small>',
  chunks: [
    { en: 'I', role: 's' },
    { en: 'do', en2: "don't", role: 'x' },
    { en: 'study', role: 'v' },
    { en: 'English', role: 'o' },
    { en: 'at school', role: 'm' },
    { en: 'every day.', role: 'm' },
  ],
  baseOrder: [0, 2, 3, 4, 5], newOrder: [0, 1, 2, 3, 4, 5], insert: 1, behind: 2, changeAlt: [1],
  peekNote: 'かくれている do', note: 'do + not = don\'t',
  T: { show: 0, copy: 1.5, peek: 2.5, insert: 7, alt: 9.5, note: 9.5, end: 18 },
  narration: [
    { t: 0, text: '今度は否定文。「私は毎日学校で英語を勉強します。」' },
    { t: 3.5, text: 'ここでも、<em>study</em> の後ろに <em>do</em> がかくれています。' },
    { t: 7, text: '否定文では、<em>do</em> が study の前に出てきて……' },
    { t: 9.5, text: '<em>not</em> とくっついて <em>don\'t</em>（do not）になります。「〜しない」の合図です。' },
    { t: 14, text: '<em>I don\'t study English at school every day.</em>　これも語順はそのまま！' },
  ],
});

const genAnswer = answerScene({
  id: 'gen-answer', toc: { item: '3', row: 'gen', col: 'a' }, heading: '答え方（一般動詞の文）',
  lines: [
    { html: '<span class="hl">Do</span> you study English?', t: 0.3 },
    { html: 'Yes, I <span class="hl">do</span>.', tag: 'はい', color: ROLE.o.color, t: 3 },
    { html: 'No, I <span class="hl">don\'t</span>.', tag: 'いいえ', color: ROLE.v.color, t: 6 },
  ],
  hlAt: 9.5, duration: 14,
  narration: [
    { t: 0, text: '<em>Do</em> で聞かれたら、どう答える？' },
    { t: 3, text: '「はい」は <em>Yes, I do.</em>' },
    { t: 6, text: '「いいえ」は <em>No, I don\'t.</em>' },
    { t: 9.5, text: '質問の <em>do</em> が、答えにもそのまま出てくる！' },
  ],
});

// ---- be動詞の疑問文：be動詞だけが先頭へ移動し、もとの場所は空欄になる（主語は動かない） ----
const beQuestion = transformScene({
  id: 'be-question', toc: { item: '3', row: 'be', col: 'q' },
  rows: ['肯定文', '疑問文'], jp: ['あなたは生徒です。', 'あなたは生徒ですか？'],
  heading: 'be動詞の疑問文<small>肯定文 → 疑問文</small>',
  chunks: [
    { en: 'You', en2: 'you', role: 's' },
    { en: 'are', en2: 'Are', role: 'v', label: 'be動詞' },
    { en: 'a student.', en2: 'a student?', role: 'c' },
  ],
  baseOrder: [0, 1, 2], newOrder: [1, 0, 2], insert: 1, changeAlt: [0, 1, 2],
  note: 'be動詞だけが先頭へ',
  T: { show: 0, copy: 1.5, insert: 7, alt: 9, note: 9.5, end: 18 },
  narration: [
    { t: 0, text: '次は be動詞の文。「あなたは生徒です。」<em>You are a student.</em>' },
    { t: 3.5, text: 'be動詞の文には、<em>do</em> はかくれていません。' },
    { t: 7, text: '疑問文では、<em>be動詞だけ</em>が文の先頭へ移動します。主語は動きません。' },
    { t: 11.5, text: 'be動詞がいた場所は、空っぽになります。' },
    { t: 14.5, text: '<em>Are you a student?</em>' },
  ],
});
const beAnswer = answerScene({
  id: 'be-answer', toc: { item: '3', row: 'be', col: 'a' }, heading: '答え方（be動詞の文）',
  lines: [
    { html: '<span class="hl">Are</span> you a student?', t: 0.3 },
    { html: 'Yes, I <span class="hl">am</span>.', tag: 'はい', color: ROLE.o.color, t: 3 },
    { html: 'No, <span class="hl">I\'m</span> not.', tag: 'いいえ', color: ROLE.v.color, t: 6 },
  ],
  hlAt: 9.5, duration: 15,
  narration: [
    { t: 0, text: 'be動詞で聞かれたら、be動詞で答えます。' },
    { t: 3, text: '「はい」は <em>Yes, I am.</em>　you で聞かれたので、I am で答えます。' },
    { t: 6, text: '「いいえ」は <em>No, I\'m not.</em>　I\'m は I am の短い形です。' },
    { t: 10.5, text: 'Do には do で、be動詞には be動詞で答える。これがルールです。' },
  ],
});
const beNegative = transformScene({
  id: 'be-negative', toc: { item: '3', row: 'be', col: 'n' },
  rows: ['肯定文', '否定文'], jp: ['私は生徒です。', '私は生徒ではありません。'],
  heading: 'be動詞の否定文<small>肯定文 → 否定文</small>',
  chunks: [
    { en: 'I', role: 's' },
    { en: 'am', role: 'v', label: 'be動詞' },
    { en: 'not', role: 'x' },
    { en: 'a student.', role: 'c' },
  ],
  baseOrder: [0, 1, 3], newOrder: [0, 1, 2, 3], insert: 2,
  note: 'be動詞のあとに not',
  T: { show: 0, insert: 5, alt: 7, note: 7, end: 14 },
  narration: [
    { t: 0, text: '否定文。<em>I am a student.</em>' },
    { t: 5, text: 'be動詞の文では、be動詞のすぐ後ろに <em>not</em> を入れるだけ。' },
    { t: 9.5, text: '<em>I am not a student.</em>「私は生徒ではありません。」' },
  ],
});

// ======== 4 練習問題 ========
const p4 = transformScene({
  id: 'practice4', toc: { item: '4', row: 'gen', col: 'q' },
  rows: ['肯定文', '疑問文'], jp: ['あなたは毎日ピアノをひきます。', 'あなたは毎日ピアノをひきますか？'], versions: ['full'], practice: '練習 4',
  heading: '疑問文にしよう',
  chunks: [
    { en: 'do', en2: 'Do', role: 'x' }, { en: 'You', en2: 'you', role: 's' }, { en: 'play', role: 'v' },
    { en: 'the piano', role: 'o' }, { en: 'every day.', en2: 'every day?', role: 'm' },
  ],
  baseOrder: [1, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], insert: 0, behind: 2, changeAlt: [0, 1, 4],
  peekNote: 'かくれている do', note: '質問の合図',
  T: { show: 0, copy: 0.6, peek: 0.6, insert: 3, alt: 5, note: 6, end: 11 },
  narration: [
    { t: 0, text: '練習4　この文を疑問文にしよう。' },
    { t: 1, text: '<em>play</em> の後ろの <em>do</em> は、どこへ出てくるかな？　止めて考えてもOK！' },
    { t: 11, text: '答え：<em>do</em> が先頭に出て <em>Do</em>、最後は「?」。' },
    { t: 14, text: '<em>Do you play the piano every day?</em>' },
  ],
});
const p5 = transformScene({
  id: 'practice5', toc: { item: '4', row: 'gen', col: 'n' },
  rows: ['肯定文', '否定文'], jp: ['私たちは夕食の後にテレビを見ます。', '私たちは夕食の後にテレビを見ません。'], versions: ['full'], practice: '練習 5',
  heading: '否定文にしよう',
  chunks: [
    { en: 'We', role: 's' }, { en: 'do', en2: "don't", role: 'x' }, { en: 'watch', role: 'v' },
    { en: 'TV', role: 'o' }, { en: 'after dinner.', role: 'm' },
  ],
  baseOrder: [0, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], insert: 1, behind: 2, changeAlt: [1],
  peekNote: 'かくれている do', note: 'do + not = don\'t',
  T: { show: 0, copy: 0.6, peek: 0.6, insert: 3, alt: 5, note: 5, end: 11 },
  narration: [
    { t: 0, text: '練習5　この文を否定文にしよう。' },
    { t: 1, text: '<em>watch</em> の後ろの <em>do</em> は、どこへ出てくるかな？　止めて考えてもOK！' },
    { t: 11, text: '答え：<em>do</em> が主語と述部のあいだに出て、<em>not</em> とくっつく。' },
    { t: 14, text: '<em>We don\'t watch TV after dinner.</em>' },
  ],
});


const sec4 = sectionScene({ id: 'sec4', toc: '4', versions: ['full'], no: 4, title: '練習問題', sub: '否定文・疑問文に書きかえよう',
  narration: [{ t: 0.5, text: '最後の練習問題。否定文・疑問文に書きかえよう。' }] });
const p6 = transformScene({
  id: 'practice6', toc: { item: '4', row: 'be', col: 'q' },
  rows: ['肯定文', '疑問文'], jp: ['彼は先生です。', '彼は先生ですか？'], versions: ['full'], practice: '練習 6',
  heading: '疑問文にしよう',
  chunks: [
    { en: 'He', en2: 'he', role: 's' }, { en: 'is', en2: 'Is', role: 'v', label: 'be動詞' }, { en: 'a teacher.', en2: 'a teacher?', role: 'c' },
  ],
  baseOrder: [0, 1, 2], newOrder: [1, 0, 2], insert: 1, changeAlt: [0, 1, 2],
  note: 'be動詞だけが先頭へ',
  T: { show: 0, copy: 0.6, peek: 0.6, insert: 3, alt: 4.5, note: 5, end: 10 },
  narration: [
    { t: 0, text: '練習6　この文を疑問文にしよう。' },
    { t: 1, text: 'be動詞の文だね。どのカードが動くかな？　止めて考えてもOK！' },
    { t: 11, text: '答え：be動詞 <em>is</em> だけが先頭へ移動する。' },
    { t: 13.5, text: '<em>Is he a teacher?</em>' },
  ],
});
const p7 = transformScene({
  id: 'practice7', toc: { item: '4', row: 'be', col: 'n' },
  rows: ['肯定文', '否定文'], jp: ['私たちは忙しいです。', '私たちは忙しくありません。'], versions: ['full'], practice: '練習 7',
  heading: '否定文にしよう',
  chunks: [
    { en: 'We', role: 's' }, { en: 'are', role: 'v', label: 'be動詞' }, { en: 'not', role: 'x' }, { en: 'busy.', role: 'c' },
  ],
  baseOrder: [0, 1, 3], newOrder: [0, 1, 2, 3], insert: 2,
  note: 'be動詞のあとに not',
  T: { show: 0, copy: 0.6, peek: 0.6, insert: 3, alt: 4.5, note: 4.5, end: 10 },
  narration: [
    { t: 0, text: '練習7　この文を否定文にしよう。' },
    { t: 1, text: 'be動詞の文だね。not はどこに入るかな？　止めて考えてもOK！' },
    { t: 11, text: '答え：be動詞 <em>are</em> のあとに not。' },
    { t: 13.5, text: '<em>We are not busy.</em>' },
  ],
});
const p8 = answerScene({
  id: 'practice8', toc: { item: '4', row: 'be', col: 'a' }, versions: ['full'], practice: { label: '練習 8', think0: 2.5, think: 7 },
  heading: '「いいえ」で答えよう<small>「あなたはおなかがすいていますか？」</small>',
  lines: [
    { html: '<span class="hl">Are</span> you hungry?', t: 0.3 },
    { html: 'No, <span class="hl">I\'m</span> not.', tag: 'いいえ', color: ROLE.v.color, t: 10 },
  ],
  hlAt: 11, duration: 16,
  narration: [
    { t: 0, text: '練習8　「いいえ」で答えよう。' },
    { t: 2.5, text: 'Are で聞かれているね。止めて考えてもOK！' },
    { t: 10, text: '答え：<em>No, I\'m not.</em>　be動詞で聞かれたら、be動詞で答える。' },
  ],
});
const p9 = answerScene({
  id: 'practice9', toc: { item: '4', row: 'gen', col: 'a' }, versions: ['full'], practice: { label: '練習 9', think0: 2.5, think: 7 },
  heading: '「はい」で答えよう<small>「あなたはネコが好きですか？」</small>',
  lines: [
    { html: '<span class="hl">Do</span> you like cats?', t: 0.3 },
    { html: 'Yes, I <span class="hl">do</span>.', tag: 'はい', color: ROLE.o.color, t: 10 },
  ],
  hlAt: 11, duration: 16,
  narration: [
    { t: 0, text: '練習9　「はい」で答えよう。' },
    { t: 2.5, text: 'Do で聞かれているね。止めて考えてもOK！' },
    { t: 10, text: '答え：<em>Yes, I do.</em>　Do で聞かれたら、do で答える。' },
  ],
});

// ---- まとめ ----
const summary = {
  id: 'summary', versions: BOTH, duration: { full: 16, digest: 12 },
  narration: [
    { t: 0, text: 'まとめ。英語がわからなくなる原因は、<em>語順</em>と<em>英語式の入れ替え</em>。' },
    { t: 4.5, text: '一般動詞は do が出てくる。be動詞は自分が動く。主語は動かない！' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = 'まとめ'; root.appendChild(head);
    const items = [
      `be動詞は「＝（イコール）」、一般動詞は「動作」。動詞は1文に1つ`,
      `一般動詞の文：かくれた <b style="color:var(--x)">do</b> が前に出る（Do you〜? / I don't〜.）`,
      `be動詞の文：<b style="color:var(--v)">be動詞</b>だけが先頭へ移動、否定は後ろに not`,
      `答えるときは、聞かれた形（do / be動詞）で答える`,
    ].map((html, i) => {
      const el = h('div', 'box');
      el.style.left = '160px'; el.style.width = '1600px'; el.style.top = 260 + i * 150 + 'px';
      el.style.padding = '26px 44px'; el.style.fontSize = '44px'; el.style.fontWeight = '700';
      el.innerHTML = `<span style="color:var(--accent);font-weight:900;margin-right:24px">${i + 1}</span>${html}`;
      root.appendChild(el);
      return el;
    });
    return { head, items };
  },
  render({ head, items }, t, ctx) {
    fadeIn(head, t, 0);
    const step = ctx.version === 'digest' ? 0.7 : 1.4;
    items.forEach((el, i) => fadeIn(el, t, 0.6 + i * step));
  },
};

export const scenes = [
  titleScene({
    kicker: '文法 Lv2', main: '日本語と英語の違い', sub: 'なぜあなたは英語がわからなくなるのか',
    narration: [{ t: 1, text: 'なぜ英語がわからなくなるのか。カギは英語式の「入れ替え」です。' }],
  }),
  hook,
  sec1, compare, beTable, mistake,
  sec2, f1, f2, f3,
  sec3, question, genAnswer, negative, beQuestion, beAnswer, beNegative,
  sec4, p4, p5, p6, p7, p8, p9,
  summary,
];
