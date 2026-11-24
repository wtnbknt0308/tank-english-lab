// 文法 Lv3　日本語と英語の違い：細かいニュアンスを伝えるための工夫と決まり
// 語順（Lv1）はそのまま。述部のカードの形を変えると、時・気持ち・様子が変わる。
// 先頭へ移動するのは do / did・be動詞・助動詞・have だけ。主語は動かない（Lv2 と同じ）。
import { h, ChunkRow, layoutPositions, seg, ease, easeOutBack, mix, fadeIn, ROLE } from '../engine/parts.js';
import { titleScene, sectionScene, transformScene, fillBlankScene } from '../engine/scenes.js';

export const meta = {
  code: 'Lv3',
  title: '細かいニュアンスを伝えるための工夫と決まり',
  toc: [
    { key: '1', label: '現在形・過去形・未来表現' },
    { key: '2', label: '助動詞' },
    { key: '3', label: '進行形' },
    { key: '4', label: '受動態' },
    { key: '5', label: '完了形' },
  ],
};

const BOTH = ['full', 'digest'];
const FULL = ['full'];
const V = ROLE.v.color;

// ---------------------------------------------------------------------------
// つかみ：I ＿＿ tennis ＿＿. の述部だけを入れかえていく
const hook = {
  id: 'hook', versions: BOTH, duration: 20,
  narration: [
    { t: 0, text: 'Lv1 で学んだ語順は、そのまま。' },
    { t: 2.5, text: '<em>述部</em>のカードの形を変えるだけで……' },
    { t: 7, text: '「した」「するつもり」「できる」「している」「ずっとしている」。' },
    { t: 13, text: '時や気持ち、様子といった、細かいニュアンスが伝えられます。' },
    { t: 17, text: 'これが Lv3 のテーマです。' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.innerHTML = '述部の形を変えると、ニュアンスが変わる'; root.appendChild(head);
    const row = h('div'); row.style.cssText = 'position:absolute;left:0;right:0;top:400px;display:flex;justify-content:center;gap:28px;';
    const card = (text, color) => {
      const c = h('div'); c.style.cssText = `height:132px;padding:0 40px;border-radius:24px;background:${color};color:#fff;font-size:64px;font-weight:900;display:flex;align-items:center;white-space:nowrap;box-shadow:0 10px 0 rgba(29,36,51,0.15)`;
      c.textContent = text; row.appendChild(c); return c;
    };
    card('I', ROLE.s.color);
    const verb = card('play', V);
    card('tennis', ROLE.o.color);
    const time = card('every day.', ROLE.m.color);
    root.appendChild(row);
    const jp = h('div', 'sentence'); jp.style.top = '590px'; jp.style.fontSize = '46px'; jp.style.color = 'var(--sub)'; root.appendChild(jp);
    const tag = h('div', 'badge'); tag.style.left = '50%'; tag.style.top = '300px'; tag.style.transform = 'translateX(-50%)'; tag.style.background = 'var(--x)'; tag.style.fontSize = '38px'; root.appendChild(tag);
    return { head, row, verb, time, jp, tag };
  },
  render(st, t) {
    fadeIn(st.head, t, 0);
    fadeIn(st.row, t, 0.3);
    const V6 = [
      ['play', 'every day.', '私は毎日テニスをします。', '現在形'],
      ['played', 'yesterday.', '私は昨日テニスをしました。', '過去形'],
      ['will play', 'tomorrow.', '私は明日テニスをするつもりです。', '未来'],
      ['can play', 'well.', '私はテニスが上手にできます。', '助動詞'],
      ['am playing', 'now.', '私は今テニスをしています。', '進行形'],
      ['have played', 'for five years.', '私は5年間ずっとテニスをしています。', '完了形'],
    ];
    const k = Math.max(0, Math.min(V6.length - 1, Math.floor((t - 3) / 2.3) + 1));
    const i = t < 3 ? 0 : k;
    const [v, m, j, name] = V6[i];
    if (st.verb.textContent !== v) st.verb.textContent = v;
    if (st.time.textContent !== m) st.time.textContent = m;
    st.jp.textContent = `「${j}」`;
    st.tag.textContent = name;
    const since = t < 3 ? t : (t - 3) % 2.3;
    const pop = Math.sin(Math.PI * seg(since, 0, 0.35));
    st.verb.style.transform = `scale(${1 + 0.12 * pop})`;
    st.tag.style.opacity = seg(t, 1, 1.4);
    fadeIn(st.jp, t, 0.8);
  },
};

// ---------------------------------------------------------------------------
// 1 現在形・過去形・未来表現
const sec1 = sectionScene({ id: 'sec1', toc: '1', no: 1, title: '現在形・過去形・未来表現', sub: '「いつ」のことかを述部で表す',
  narration: [{ t: 0.5, text: '1つ目は「時」の表し方。現在形・過去形・未来です。' }] });

const timeline = {
  id: 'timeline', toc: '1', versions: BOTH, duration: 21,
  narration: [
    { t: 0, text: '時の表し方を、時間の矢印で見てみましょう。' },
    { t: 2.5, text: '現在形 <em>I play tennis every day.</em>　現在形は「いつもすること」です。' },
    { t: 7.5, text: '過去形 <em>I played tennis yesterday.</em>　もう終わったこと。動詞に -ed をつけます。' },
    { t: 12.5, text: '未来 <em>I will play tennis tomorrow.</em>　will ＋ 動詞の元の形です。' },
    { t: 17, text: '語順はどれも同じ。変わるのは述部だけ！' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = '時の表し方'; root.appendChild(head);
    const line = h('div'); line.style.cssText = 'position:absolute;left:180px;top:420px;height:8px;background:var(--ink);border-radius:4px;'; root.appendChild(line);
    const tip = h('div'); tip.style.cssText = 'position:absolute;top:406px;width:0;height:0;border-left:34px solid var(--ink);border-top:18px solid transparent;border-bottom:18px solid transparent;'; root.appendChild(tip);
    const xs = [460, 960, 1460];
    const marks = ['過去', '今', '未来'].map((n, i) => {
      const m = h('div', 'badge', n); m.style.left = xs[i] + 'px'; m.style.top = '330px'; m.style.transform = 'translateX(-50%)';
      m.style.background = i === 1 ? 'var(--accent)' : 'var(--sub)'; m.style.fontSize = '36px'; root.appendChild(m); return m;
    });
    // 現在形＝いつも：過去にも未来にも並ぶ点
    const dots = [260, 360, 460, 560, 660, 760, 860, 960, 1060, 1160, 1260, 1360, 1460, 1560, 1660].map((x) => {
      const d = h('div'); d.style.cssText = `position:absolute;left:${x - 11}px;top:413px;width:22px;height:22px;border-radius:50%;background:${V};`; root.appendChild(d); return d;
    });
    const big = (x, color) => { const d = h('div'); d.style.cssText = `position:absolute;left:${x - 22}px;top:402px;width:44px;height:44px;border-radius:50%;background:${color};border:6px solid #fff;box-shadow:0 0 0 4px ${color};`; root.appendChild(d); return d; };
    const pastDot = big(460, V), futDot = big(1460, V);
    const sentence = (x, html, jp) => {
      const e = h('div'); e.style.cssText = `position:absolute;left:${x - 240}px;width:480px;top:500px;text-align:center;font-size:40px;font-weight:900;line-height:1.3;`;
      e.innerHTML = `${html}<div style="font-size:28px;color:var(--sub);font-weight:700;margin-top:10px">${jp}</div>`; root.appendChild(e); return e;
    };
    const em = (s) => `<span style="color:${V}">${s}</span>`;
    const sPres = sentence(960, `I ${em('play')} tennis<br>every day.`, '「いつも」すること');
    const sPast = sentence(460, `I ${em('played')} tennis<br>yesterday.`, '終わったこと');
    const sFut = sentence(1460, `I ${em('will play')} tennis<br>tomorrow.`, 'これからのこと');
    return { head, line, tip, marks, dots, pastDot, futDot, sPres, sPast, sFut };
  },
  render(st, t) {
    fadeIn(st.head, t, 0);
    const p = ease(seg(t, 0.3, 1.5));
    st.line.style.width = 1520 * p + 'px';
    st.tip.style.left = 180 + 1520 * p + 'px';
    st.tip.style.opacity = p;
    st.marks.forEach((m, i) => { m.style.opacity = seg(t, 1 + i * 0.2, 1.4 + i * 0.2); });
    st.dots.forEach((d, i) => { d.style.opacity = 0.75 * seg(t, 2.6 + i * 0.08, 2.9 + i * 0.08); });
    fadeIn(st.sPres, t, 3);
    const pp = easeOutBack(seg(t, 7.5, 8.1)); st.pastDot.style.transform = `scale(${pp})`; st.pastDot.style.opacity = seg(t, 7.5, 7.7);
    fadeIn(st.sPast, t, 8);
    const pf = easeOutBack(seg(t, 12.5, 13.1)); st.futDot.style.transform = `scale(${pf})`; st.futDot.style.opacity = seg(t, 12.5, 12.7);
    fadeIn(st.sFut, t, 13);
  },
};

const toPast = transformScene({
  id: 'to-past', toc: '1',
  heading: '過去形にするには？<small>現在形 → 過去形</small>',
  rows: ['現在形', '過去形'], jp: ['私は毎日テニスをします。', '私は昨日テニスをしました。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'play', en2: 'played', role: 'v' },
    { en: 'tennis', role: 'o' }, { en: 'every day.', en2: 'yesterday.', role: 'm' },
  ],
  baseOrder: [0, 1, 2, 3], newOrder: [0, 1, 2, 3], changeAlt: [1, 3], noteAt: 1, note: '-ed で過去',
  T: { show: 0, copy: 1.5, insert: 4, alt: 4.5, note: 5.5, end: 15 },
  narration: [
    { t: 0, text: '現在形を過去形にします。' },
    { t: 4, text: '動詞に <em>-ed</em> をつけると過去形。<em>play → played</em>。' },
    { t: 8, text: '「毎日」は「昨日」に。語順はそのまま！' },
    { t: 11, text: '<em>go → went</em> のように、形が大きく変わる動詞（不規則動詞）もあります。' },
  ],
});

const pastQuestion = transformScene({
  id: 'past-question', toc: '1',
  heading: '過去形の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['あなたは昨日テニスをしました。', 'あなたは昨日テニスをしましたか？'],
  chunks: [
    { en: 'did', en2: 'Did', role: 'x' }, { en: 'You', en2: 'you', role: 's' },
    { en: 'played', en2: 'play', role: 'v' }, { en: 'tennis', role: 'o' },
    { en: 'yesterday.', en2: 'yesterday?', role: 'm' },
  ],
  baseOrder: [1, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], insert: 0, behind: 2, changeAlt: [0, 1, 2, 4],
  peekNote: 'かくれている did', note: '質問の合図',
  T: { show: 0, copy: 1.5, peek: 2.5, insert: 8, alt: 10, note: 11, end: 20 },
  narration: [
    { t: 0, text: '過去形の疑問文。「あなたは昨日テニスをしました。」' },
    { t: 3.5, text: '過去形の played の後ろには、<em>did</em> がかくれています。Lv2 の do の過去形です。' },
    { t: 8, text: '疑問文では、<em>did</em> だけが先頭へ移動します。主語は動きません。' },
    { t: 11, text: 'did が「過去」を持っていくので、動詞は元の形 <em>play</em> にもどります。' },
    { t: 15.5, text: '<em>Did you play tennis yesterday?</em>' },
  ],
});

const pastNegative = transformScene({
  id: 'past-negative', toc: '1', versions: FULL,
  heading: '過去形の否定文<small>肯定文 → 否定文</small>',
  rows: ['肯定文', '否定文'], jp: ['私は昨日テニスをしました。', '私は昨日テニスをしませんでした。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'did', en2: "didn't", role: 'x' },
    { en: 'played', en2: 'play', role: 'v' }, { en: 'tennis', role: 'o' }, { en: 'yesterday.', role: 'm' },
  ],
  baseOrder: [0, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], insert: 1, behind: 2, changeAlt: [1, 2],
  peekNote: 'かくれている did', note: "did + not = didn't",
  T: { show: 0, copy: 1.5, peek: 2.5, insert: 7, alt: 9.5, note: 9.5, end: 17 },
  narration: [
    { t: 0, text: '過去形の否定文。' },
    { t: 3, text: 'ここでも played の後ろに <em>did</em> がかくれています。' },
    { t: 7, text: 'did が動詞の前に出て、not とくっついて <em>didn\'t</em>。' },
    { t: 11.5, text: '動詞は元の形。<em>I didn\'t play tennis yesterday.</em>' },
  ],
});

const future = transformScene({
  id: 'future', toc: '1',
  heading: '未来のことを言うには？<small>現在形 → 未来</small>',
  rows: ['現在形', '未来'], jp: ['私は毎日テニスをします。', '私は明日テニスをするつもりです。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'will', role: 'x' }, { en: 'play', role: 'v' },
    { en: 'tennis', role: 'o' }, { en: 'every day.', en2: 'tomorrow.', role: 'm' },
  ],
  baseOrder: [0, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], insert: 1, changeAlt: [4], note: 'will ＋ 元の形',
  T: { show: 0, copy: 1.5, insert: 4, alt: 6, note: 6.5, end: 15 },
  narration: [
    { t: 0, text: '未来のことを言うときは……' },
    { t: 4, text: '動詞の前に <em>will</em> を置きます。動詞は元の形のまま。' },
    { t: 8.5, text: '<em>I will play tennis tomorrow.</em>' },
    { t: 11.5, text: '<em>be going to</em> ＋ 元の形でも、未来を表せます。' },
  ],
});

const f1 = fillBlankScene({
  id: 'fill1', toc: '1', no: 1, jp: '私は昨日サッカーをしました。',
  chunks: [{ en: 'I', role: 's' }, { en: 'played', role: 'v' }, { en: 'soccer', role: 'o' }, { en: 'yesterday.', role: 'm' }],
  blank: 1, options: ['play', 'played', 'will play'],
  why: '「昨日」のことなので、過去形の <em>played</em>。',
});
const f2 = fillBlankScene({
  id: 'fill2', toc: '1', no: 2, jp: '明日は雨がふるでしょう。',
  chunks: [{ en: 'It', role: 's' }, { en: 'will', role: 'x', label: '助動詞' }, { en: 'rain', role: 'v' }, { en: 'tomorrow.', role: 'm' }],
  blank: 1, options: ['will', 'did', 'is'],
  why: '未来のことなので <em>will</em>。後ろの動詞は元の形 rain。',
});
const f3 = fillBlankScene({
  id: 'fill3', toc: '1', no: 3, jp: 'あなたは昨日テレビを見ましたか？',
  chunks: [{ en: 'Did', role: 'x' }, { en: 'you', role: 's' }, { en: 'watch', role: 'v' }, { en: 'TV', role: 'o' }, { en: 'yesterday?', role: 'm' }],
  blank: 0, options: ['Do', 'Did', 'Will'],
  why: '「昨日」の質問なので <em>Did</em>。動詞 watch は元の形のまま。',
});

// ---------------------------------------------------------------------------
// 2 助動詞
const sec2 = sectionScene({ id: 'sec2', toc: '2', no: 2, title: '助動詞', sub: '動詞に「気持ち」をプラスする',
  narration: [{ t: 0.5, text: '2つ目は助動詞。動詞に気持ちや判断をプラスします。' }] });

const modalTable = {
  id: 'modal-table', toc: '2', versions: BOTH, duration: 17,
  narration: [
    { t: 0, text: '助動詞は、動詞の前に置いて、気持ちや判断をプラスします。' },
    { t: 4, text: '<em>can</em> できる、<em>will</em> だろう、<em>must</em> しなければならない、<em>may</em> してもよい、<em>should</em> すべきだ。' },
    { t: 12, text: '助動詞の後ろの動詞は、いつも<em>元の形</em>です。' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = '助動詞 ＋ 動詞の元の形'; root.appendChild(head);
    const rows = [['can', '〜できる'], ['will', '〜だろう・〜するつもり'], ['must', '〜しなければならない'], ['may', '〜してもよい'], ['should', '〜すべきだ']].map(([w, m], i) => {
      const b = h('div', 'box'); b.style.left = '380px'; b.style.width = '1100px'; b.style.top = 250 + i * 118 + 'px'; b.style.height = '100px';
      b.innerHTML = `<div style="position:absolute;left:46px;top:0;bottom:0;display:flex;align-items:center;font-size:54px;font-weight:900;color:var(--x)">${w}</div>
        <div style="position:absolute;left:300px;top:0;bottom:0;display:flex;align-items:center;font-size:46px;font-weight:700">${m}</div>`;
      root.appendChild(b); return b;
    });
    return { head, rows };
  },
  render({ head, rows }, t) {
    fadeIn(head, t, 0);
    rows.forEach((b, i) => fadeIn(b, t, 4 + i * 1.5));
  },
};

const modalAdd = transformScene({
  id: 'modal-add', toc: '2',
  heading: '助動詞を足すと？',
  rows: ['ふつうの文', '助動詞'], jp: ['私はピアノをひきます。', '私はピアノをひくことができます。'],
  chunks: [{ en: 'I', role: 's' }, { en: 'can', role: 'x', label: '助動詞' }, { en: 'play', role: 'v' }, { en: 'the piano.', role: 'o' }],
  baseOrder: [0, 2, 3], newOrder: [0, 1, 2, 3], insert: 1, note: 'can ＋ 元の形',
  T: { show: 0, copy: 1.5, insert: 4, alt: 5, note: 5, end: 12 },
  narration: [
    { t: 0, text: '「私はピアノをひきます。」に can を足すと……' },
    { t: 4, text: '動詞の前に <em>can</em>。「ひくことができる」になります。' },
    { t: 8.5, text: '<em>I can play the piano.</em>' },
  ],
});

const modalQuestion = transformScene({
  id: 'modal-question', toc: '2',
  heading: '助動詞の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['あなたは泳ぐことができます。', 'あなたは泳ぐことができますか？'],
  chunks: [{ en: 'You', en2: 'you', role: 's' }, { en: 'can', en2: 'Can', role: 'x', label: '助動詞' }, { en: 'swim.', en2: 'swim?', role: 'v' }],
  baseOrder: [0, 1, 2], newOrder: [1, 0, 2], insert: 1, changeAlt: [0, 1, 2], note: '助動詞だけが先頭へ',
  T: { show: 0, copy: 1.5, insert: 5, alt: 7, note: 7.5, end: 16 },
  narration: [
    { t: 0, text: '助動詞の疑問文。' },
    { t: 2.5, text: '助動詞の文には、do はかくれていません。' },
    { t: 5, text: 'be動詞と同じように、<em>助動詞だけ</em>が先頭へ移動します。主語は動きません。' },
    { t: 11, text: '<em>Can you swim?</em>　答えは Yes, I can. / No, I can\'t.' },
  ],
});

const modalNegative = transformScene({
  id: 'modal-negative', toc: '2', versions: FULL,
  heading: '助動詞の否定文<small>肯定文 → 否定文</small>',
  rows: ['肯定文', '否定文'], jp: ['私は泳ぐことができます。', '私は泳ぐことができません。'],
  chunks: [{ en: 'I', role: 's' }, { en: 'can', en2: "can't", role: 'x', label: '助動詞' }, { en: 'swim.', role: 'v' }],
  baseOrder: [0, 1, 2], newOrder: [0, 1, 2], changeAlt: [1], noteAt: 1, note: "can + not = can't",
  T: { show: 0, copy: 1.5, insert: 4, alt: 4.5, note: 5, end: 11 },
  narration: [
    { t: 0, text: '否定文は……' },
    { t: 4, text: '助動詞のすぐ後ろに not。can not は短く <em>can\'t</em>。' },
    { t: 8, text: '<em>I can\'t swim.</em>' },
  ],
});

const m1 = fillBlankScene({
  id: 'fill4', toc: '2', no: 4, jp: '私はとても速く泳ぐことができます。',
  chunks: [{ en: 'I', role: 's' }, { en: 'can', role: 'x', label: '助動詞' }, { en: 'swim', role: 'v' }, { en: 'very fast.', role: 'm' }],
  blank: 1, options: ['can', 'must', 'did'], why: '「〜できる」は <em>can</em>。',
});
const m2 = fillBlankScene({
  id: 'fill5', toc: '2', no: 5, jp: 'あなたは宿題をしなければなりません。',
  chunks: [{ en: 'You', role: 's' }, { en: 'must', role: 'x', label: '助動詞' }, { en: 'do', role: 'v' }, { en: 'your homework.', role: 'o' }],
  blank: 1, options: ['can', 'must', 'may'], why: '「〜しなければならない」は <em>must</em>。',
});
const m3 = fillBlankScene({
  id: 'fill6', toc: '2', no: 6, jp: '窓を開けてもいいですか？',
  chunks: [{ en: 'May', role: 'x', label: '助動詞' }, { en: 'I', role: 's' }, { en: 'open', role: 'v' }, { en: 'the window?', role: 'o' }],
  blank: 0, options: ['May', 'Must', 'Did'], why: '「〜してもいいですか？」は <em>May I 〜?</em>。',
});

// ---------------------------------------------------------------------------
// 3 進行形
const sec3 = sectionScene({ id: 'sec3', toc: '3', no: 3, title: '進行形', sub: '「今まさに〜している」',
  narration: [{ t: 0.5, text: '3つ目は進行形。「今まさに〜している」の言い方です。' }] });

const progressive = transformScene({
  id: 'progressive', toc: '3',
  heading: '進行形にするには？<small>現在形 → 進行形</small>',
  rows: ['現在形', '進行形'], jp: ['私は毎日テニスをします。', '私は今テニスをしています。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'am', role: 'v', label: 'be動詞' }, { en: 'play', en2: 'playing', role: 'v' },
    { en: 'tennis', role: 'o' }, { en: 'every day.', en2: 'now.', role: 'm' },
  ],
  baseOrder: [0, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], insert: 1, changeAlt: [2, 4], note: 'be動詞 ＋ -ing',
  T: { show: 0, copy: 1.5, insert: 4.5, alt: 6, note: 6.5, end: 15 },
  narration: [
    { t: 0, text: '現在形は「いつもすること」。' },
    { t: 2.5, text: '「今まさにしている」と言いたいときは……' },
    { t: 4.5, text: 'be動詞を入れて、動詞に <em>-ing</em> をつけます。' },
    { t: 9, text: '<em>I am playing tennis now.</em>　進行形は「〜している」。' },
  ],
});

const pastProgressive = transformScene({
  id: 'past-progressive', toc: '3', versions: FULL,
  heading: '過去進行形<small>「そのとき〜していた」</small>',
  rows: ['現在進行形', '過去進行形'], jp: ['私は今テニスをしています。', '私はそのときテニスをしていました。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'am', en2: 'was', role: 'v', label: 'be動詞' }, { en: 'playing', role: 'v' },
    { en: 'tennis', role: 'o' }, { en: 'now.', en2: 'then.', role: 'm' },
  ],
  baseOrder: [0, 1, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], changeAlt: [1, 4], noteAt: 1, note: 'was で過去',
  T: { show: 0, copy: 1.5, insert: 4, alt: 4.5, note: 5, end: 12 },
  narration: [
    { t: 0, text: '過去のある時に「していた」は……' },
    { t: 4, text: 'be動詞を過去形の <em>was</em> にします（you・複数なら were）。' },
    { t: 8.5, text: '<em>I was playing tennis then.</em>' },
  ],
});

const progQuestion = transformScene({
  id: 'prog-question', toc: '3',
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
    { t: 10, text: '<em>Are you playing tennis?</em>' },
  ],
});

const g1 = fillBlankScene({
  id: 'fill7', toc: '3', no: 7, jp: '彼は今テレビを見ています。',
  chunks: [{ en: 'He', role: 's' }, { en: 'is', role: 'v', label: 'be動詞' }, { en: 'watching', role: 'v' }, { en: 'TV', role: 'o' }, { en: 'now.', role: 'm' }],
  blank: 2, options: ['watch', 'watching', 'watched'], why: 'be動詞 ＋ <em>-ing</em> で「〜している」。',
});
const g2 = fillBlankScene({
  id: 'fill8', toc: '3', no: 8, jp: '私はそのとき本を読んでいました。',
  chunks: [{ en: 'I', role: 's' }, { en: 'was', role: 'v', label: 'be動詞' }, { en: 'reading', role: 'v' }, { en: 'a book', role: 'o' }, { en: 'then.', role: 'm' }],
  blank: 1, options: ['am', 'was', 'did'], why: '「そのとき〜していた」は過去なので <em>was</em>。',
});

// ---------------------------------------------------------------------------
// 4 受動態
const sec4 = sectionScene({ id: 'sec4', toc: '4', no: 4, title: '受動態', sub: '「〜される」',
  narration: [{ t: 0.5, text: '4つ目は受動態。「〜される」の言い方です。' }] });

// 能動態 → 受動態：目的語だった Ken が主語の位置へ、Everyone は by をつけて後ろへ
const passive = {
  id: 'passive', toc: '4', versions: BOTH, duration: 22,
  narration: [
    { t: 0, text: '受動態は「〜される」という言い方。' },
    { t: 2.5, text: '「みんなはケンが好きです。」<em>Everyone likes Ken.</em>' },
    { t: 5, text: '「ケン」を主役にして、文の最初に出します。' },
    { t: 9, text: 'もとの主語 Everyone は、<em>by</em> をつけて後ろへ。' },
    { t: 12.5, text: '動詞は <em>be動詞 ＋ 過去分詞</em>。likes → is liked。' },
    { t: 16.5, text: '<em>Ken is liked by everyone.</em>「ケンはみんなに好かれています。」' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.style.top = '110px'; head.innerHTML = '受動態にするには？<small>能動態 → 受動態</small>'; root.appendChild(head);
    const Y1 = 330, Y2 = 640, GAP = 28;
    const chunks = [
      { en: 'Everyone', en2: 'by everyone.', role: 's' },
      { en: 'likes', en2: 'liked', role: 'v' },
      { en: 'Ken.', en2: 'Ken', role: 'o' },
      { en: 'is', role: 'v', label: 'be動詞' },
    ];
    const r1 = new ChunkRow(root, chunks.map((c) => ({ ...c, en2: c.en })), { y: Y1, gap: GAP });
    const r2 = new ChunkRow(root, chunks, { y: Y2, gap: GAP });
    const at = (ws, order) => layoutPositions(ws, order, GAP, 1920).map((x) => (x == null ? null : x + 120));
    const w = r2.w;
    // 段階ごとの並びと幅
    const W0 = [w.en[0], w.en[1], w.en[2], 0];
    const W1 = [w.en[0], w.en[1], w.en2[2], 0];
    const W2 = [w.en2[0], w.en[1], w.en2[2], 0];
    const W3 = [w.en2[0], w.en2[1], w.en2[2], w.en[3]];
    const P0 = at(W0, [0, 1, 2]), P1 = at(W1, [2, 0, 1]), P2 = at(W2, [2, 1, 0]), P3 = at(W3, [2, 3, 1, 0]);
    const lab = (y, text, bg) => { const e = h('div', 'badge', text); e.style.left = '48px'; e.style.top = y + 38 + 'px'; e.style.background = bg; e.style.fontSize = '36px'; root.appendChild(e); return e; };
    const l1 = lab(Y1, '能動態', 'var(--sub)'), l2 = lab(Y2, '受動態', 'var(--x)');
    const jpLine = (y, text) => { const e = h('div', 'sentence'); e.style.top = y + 198 + 'px'; e.style.left = '240px'; e.style.fontSize = '32px'; e.style.color = 'var(--sub)'; e.style.fontWeight = '700'; e.textContent = `「${text}」`; root.appendChild(e); return e; };
    const j1 = jpLine(Y1, 'みんなはケンが好きです。'), j2 = jpLine(Y2, 'ケンはみんなに好かれています。');
    const note = (text) => { const e = h('div', 'badge', text); e.style.background = 'var(--x)'; e.style.fontSize = '32px'; e.style.zIndex = 4; root.appendChild(e); return e; };
    const n1 = note('主役が先頭に'), n2 = note('by ＋ もとの主語'), n3 = note('be動詞 ＋ 過去分詞');
    return { head, r1, r2, P0, P1, P2, P3, W0, W1, W2, W3, Y1, Y2, l1, l2, j1, j2, n1, n2, n3 };
  },
  render(st, t) {
    const { r1, r2, P0, P1, P2, P3, W0, W1, W2, W3, Y1, Y2 } = st;
    fadeIn(st.head, t, 0, 0.5);
    fadeIn(st.l1, t, 0.3); fadeIn(st.j1, t, 2.5);
    [0, 1, 2].forEach((i) => r1.set(i, { x: P0[i], w: r1.w.en[i], lang: 1, colored: 1, label: 1, opacity: seg(t, 0.3 + i * 0.15, 0.7 + i * 0.15) }));
    r1.set(3, { x: 0, w: 0, opacity: 0 });
    const pc = ease(seg(t, 2.5, 3.5));
    const a = ease(seg(t, 5, 6.6)), b = ease(seg(t, 9, 10.6)), c = ease(seg(t, 12.5, 14));
    // Ken：目的語 → 主語（色と役割名も変わる）
    const roleSwap = (k, from, to, p) => {
      const card = r2.cards[k];
      const r = p < 0.5 ? from : to;
      card.card.style.setProperty('--role', ROLE[r].color);
      card.label.textContent = ROLE[r].name;
    };
    roleSwap(2, 'o', 's', seg(t, 5.8, 5.9));
    roleSwap(0, 's', 'm', seg(t, 9.8, 9.9));
    const lerp = (A, B, p) => A.map((x, i) => (x == null ? B[i] : B[i] == null ? x : mix(x, B[i], p)));
    let X = P0, Wd = W0;
    if (t >= 5) { X = lerp(P0, P1, a); Wd = lerp(W0, W1, a); }
    if (t >= 9) { X = lerp(P1, P2, b); Wd = lerp(W1, W2, b); }
    if (t >= 12.5) { X = lerp(P2, P3, c); Wd = lerp(W2, W3, c); }
    const hop = (p, hgt) => hgt * Math.sin(Math.PI * p);
    r2.set(2, { x: X[2], w: Wd[2], y: mix(Y1, Y2, pc), lang: 1, colored: 1, label: 1, opacity: pc, alt: a, lift: hop(a, 150) });
    r2.set(0, { x: X[0], w: Wd[0], y: mix(Y1, Y2, pc), lang: 1, colored: 1, label: 1, opacity: pc, alt: b, lift: -hop(b, 150) });
    r2.set(1, { x: X[1], w: Wd[1], y: mix(Y1, Y2, pc), lang: 1, colored: 1, label: 1, opacity: pc, alt: c });
    const drop = easeOutBack(seg(t, 12.9, 13.7));
    r2.set(3, { x: P3[3], w: W3[3], y: Y2, lang: 1, colored: 1, label: 1, opacity: seg(t, 12.8, 13.1), lift: 230 * (1 - drop) });
    fadeIn(st.l2, t, 5); fadeIn(st.j2, t, 16.5);
    const place = (el, i, P, W, a0) => {
      const p = Math.min(ease(seg(t, a0, a0 + 0.5)), 1);
      el.style.left = P[i] + W[i] / 2 + 'px'; el.style.top = Y2 - 72 + 'px';
      el.style.opacity = p; el.style.transform = `translate(-50%, ${(1 - p) * 16}px)`;
    };
    place(st.n1, 2, P3, W3, 6.5); place(st.n2, 0, P3, W3, 13.8); place(st.n3, 3, P3, W3, 14.2);
    // 2つ目のメモが出たら、1つ目を少し上へ逃がさずに消す（重なり防止）
    if (t > 13.8) st.n1.style.opacity = Math.max(0, 1 - seg(t, 13.6, 13.9));
    if (t > 9 && t < 13.8) { st.n1.style.left = X[2] + Wd[2] / 2 + 'px'; }
  },
};

const passiveQuestion = transformScene({
  id: 'passive-question', toc: '4',
  heading: '受動態の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['カナダでは英語が話されています。', 'カナダでは英語が話されていますか？'],
  chunks: [
    { en: 'English', role: 's' }, { en: 'is', en2: 'Is', role: 'v', label: 'be動詞' },
    { en: 'spoken', role: 'v' }, { en: 'in Canada.', en2: 'in Canada?', role: 'm' },
  ],
  baseOrder: [0, 1, 2, 3], newOrder: [1, 0, 2, 3], insert: 1, changeAlt: [1, 3], note: 'be動詞だけが先頭へ',
  T: { show: 0, copy: 1.5, insert: 5.5, alt: 7.5, note: 8, end: 16 },
  narration: [
    { t: 0, text: '受動態も be動詞の文。<em>English is spoken in Canada.</em>' },
    { t: 3, text: 'だれが話すかを言う必要がないときは、by はつけません。' },
    { t: 5.5, text: '疑問文は、<em>be動詞だけ</em>が先頭へ。主語は動きません。' },
    { t: 11, text: '<em>Is English spoken in Canada?</em>' },
  ],
});

const pv1 = fillBlankScene({
  id: 'fill9', toc: '4', no: 9, jp: 'この部屋は毎日そうじされます。',
  chunks: [{ en: 'This room', role: 's' }, { en: 'is', role: 'v', label: 'be動詞' }, { en: 'cleaned', role: 'v' }, { en: 'every day.', role: 'm' }],
  blank: 2, options: ['clean', 'cleaned', 'cleaning'], why: '「〜される」は be動詞 ＋ <em>過去分詞</em>。',
});
const pv2 = fillBlankScene({
  id: 'fill10', toc: '4', no: 10, jp: 'この本は漱石によって書かれました。',
  chunks: [{ en: 'This book', role: 's' }, { en: 'was', role: 'v', label: 'be動詞' }, { en: 'written', role: 'v' }, { en: 'by Soseki.', role: 'm' }],
  blank: 1, options: ['is', 'was', 'did'], why: '「書かれた」は過去なので <em>was</em>。written は write の過去分詞。',
});

// ---------------------------------------------------------------------------
// 5 完了形
const sec5 = sectionScene({ id: 'sec5', toc: '5', no: 5, title: '完了形', sub: '過去から「今」へつながる',
  narration: [{ t: 0.5, text: '5つ目は現在完了形。過去から今へ、つながっている言い方です。' }] });

const perfect = transformScene({
  id: 'perfect', toc: '5',
  heading: '現在完了形にするには？<small>現在形 → 現在完了形</small>',
  rows: ['現在形', '現在完了'], jp: ['私は今、東京に住んでいます。', '私は10年間ずっと東京に住んでいます。'],
  chunks: [
    { en: 'I', role: 's' }, { en: 'have', role: 'x', label: 'have' }, { en: 'live', en2: 'lived', role: 'v' },
    { en: 'in Tokyo', role: 'm' }, { en: 'now.', en2: 'for ten years.', role: 'm' },
  ],
  baseOrder: [0, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], insert: 1, changeAlt: [2, 4], note: 'have ＋ 過去分詞',
  T: { show: 0, copy: 1.5, insert: 5, alt: 6.5, note: 7, end: 16 },
  narration: [
    { t: 0, text: '「今、東京に住んでいる」だけでなく……' },
    { t: 2.5, text: '「10年前から今まで、ずっと住んでいる」と言いたいときは……' },
    { t: 5, text: '<em>have</em> と、動詞の<em>過去分詞</em>を使います。現在完了形です。' },
    { t: 10.5, text: '<em>I have lived in Tokyo for ten years.</em>' },
  ],
});

const perfectUses = {
  id: 'perfect-uses', toc: '5', versions: BOTH, duration: 22,
  narration: [
    { t: 0, text: '現在完了形には、3つの使い方があります。' },
    { t: 3, text: '<em>継続</em>：過去から今まで、ずっと続いている。for や since と一緒に。' },
    { t: 9, text: '<em>経験</em>：今までに〜したことがある。ever、never、「〜回」と一緒に。' },
    { t: 15, text: '<em>完了</em>：ちょうど〜したところ。just、already、yet と一緒に。' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = '現在完了形の3つの使い方'; root.appendChild(head);
    const em = (s) => `<span style="color:${V}">${s}</span>`;
    const rows = [
      ['継続', 'ずっと〜している', `I ${em('have lived')} in Tokyo for ten years.`, 'for / since', 'bar'],
      ['経験', '〜したことがある', `I ${em('have visited')} Kyoto twice.`, 'ever / never / 〜回', 'dots'],
      ['完了', '〜したところ', `I ${em('have just finished')} my homework.`, 'just / already / yet', 'end'],
    ].map(([name, mean, sent, keys, kind], i) => {
      const y = 260 + i * 215;
      const g = h('div'); g.style.cssText = `position:absolute;left:0;top:${y}px;width:1920px;height:190px;`;
      g.innerHTML = `
        <div class="badge" style="left:60px;top:20px;background:var(--x);font-size:38px">${name}</div>
        <div style="position:absolute;left:60px;top:90px;font-size:28px;font-weight:700;color:var(--sub)">${mean}</div>
        <div style="position:absolute;left:400px;top:62px;width:420px;height:6px;background:var(--ink);border-radius:3px"></div>
        <div style="position:absolute;left:816px;top:52px;border-left:26px solid var(--ink);border-top:13px solid transparent;border-bottom:13px solid transparent"></div>
        <div style="position:absolute;left:410px;top:80px;font-size:24px;color:var(--sub);font-weight:700">過去</div>
        <div style="position:absolute;left:770px;top:80px;font-size:24px;color:var(--accent);font-weight:900">今</div>
        ${kind === 'bar' ? `<div class="mk" style="position:absolute;left:430px;top:52px;width:360px;height:26px;border-radius:13px;background:${V};opacity:.85"></div>` : ''}
        ${kind === 'dots' ? [470, 590].map((x) => `<div class="mk" style="position:absolute;left:${x}px;top:50px;width:30px;height:30px;border-radius:50%;background:${V}"></div>`).join('') : ''}
        ${kind === 'end' ? `<div class="mk" style="position:absolute;left:740px;top:50px;width:30px;height:30px;border-radius:50%;background:${V}"></div>` : ''}
        <div style="position:absolute;left:900px;top:28px;font-size:42px;font-weight:900;white-space:nowrap">${sent}</div>
        <div style="position:absolute;left:900px;top:96px;font-size:30px;font-weight:700;color:var(--sub)">よく一緒に使う語：${keys}</div>`;
      root.appendChild(g);
      return g;
    });
    return { head, rows };
  },
  render({ head, rows }, t) {
    fadeIn(head, t, 0);
    [3, 9, 15].forEach((a, i) => {
      fadeIn(rows[i], t, a);
      rows[i].querySelectorAll('.mk').forEach((m, j) => {
        const p = ease(seg(t, a + 0.6 + j * 0.4, a + 1.4 + j * 0.4));
        m.style.transformOrigin = 'left center';
        m.style.transform = rows[i].querySelector('.mk').style.width === '360px' ? `scaleX(${p})` : `scale(${p})`;
      });
    });
  },
};

const perfectQuestion = transformScene({
  id: 'perfect-question', toc: '5',
  heading: '現在完了形の疑問文<small>肯定文 → 疑問文</small>',
  rows: ['肯定文', '疑問文'], jp: ['あなたは宿題を終えました。', 'あなたはもう宿題を終えましたか？'],
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

const pf1 = fillBlankScene({
  id: 'fill11', toc: '5', no: 11, jp: '私は3年間ずっと英語を勉強しています。',
  chunks: [{ en: 'I', role: 's' }, { en: 'have', role: 'x', label: 'have' }, { en: 'studied', role: 'v' }, { en: 'English', role: 'o' }, { en: 'for three years.', role: 'm' }],
  blank: 2, options: ['study', 'studied', 'studying'], why: 'have ＋ <em>過去分詞</em>で「ずっと〜している」。',
});
const pf2 = fillBlankScene({
  id: 'fill12', toc: '5', no: 12, jp: 'あなたは今までに京都に行ったことがありますか？',
  chunks: [{ en: 'Have', role: 'x', label: 'have' }, { en: 'you', role: 's' }, { en: 'ever', role: 'm' }, { en: 'been', role: 'v' }, { en: 'to Kyoto?', role: 'm' }],
  blank: 0, options: ['Do', 'Have', 'Are'], why: '「〜したことがありますか？」は <em>Have you ever 〜?</em>。',
});

// ---------------------------------------------------------------------------
const summary = {
  id: 'summary', versions: BOTH, duration: { full: 18, digest: 13 },
  narration: [
    { t: 0, text: 'まとめ。語順はそのまま、述部の形を変えるだけ。' },
    { t: 4.5, text: '先頭へ移動するのは do・did、be動詞、助動詞、have。主語は動かない！' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = 'まとめ'; root.appendChild(head);
    const em = (s) => `<b style="color:${V}">${s}</b>`;
    const items = [
      `時：過去は ${em('-ed')}（did がかくれる）、未来は ${em('will ＋ 元の形')}`,
      `助動詞：${em('can / must / may / should')} ＋ 元の形`,
      `進行形：${em('be動詞 ＋ -ing')}「〜している」`,
      `受動態：${em('be動詞 ＋ 過去分詞')}「〜される」`,
      `完了形：${em('have ＋ 過去分詞')}「ずっと・したことがある・したところ」`,
    ].map((html, i) => {
      const el = h('div', 'box');
      el.style.left = '160px'; el.style.width = '1600px'; el.style.top = 230 + i * 128 + 'px';
      el.style.padding = '20px 40px'; el.style.fontSize = '40px'; el.style.fontWeight = '700';
      el.innerHTML = `<span style="color:var(--accent);font-weight:900;margin-right:24px">${i + 1}</span>${html}`;
      root.appendChild(el);
      return el;
    });
    return { head, items };
  },
  render({ head, items }, t, ctx) {
    fadeIn(head, t, 0);
    const step = ctx.version === 'digest' ? 0.6 : 1.1;
    items.forEach((el, i) => fadeIn(el, t, 0.6 + i * step));
  },
};

export const scenes = [
  titleScene({
    kicker: '文法 Lv3', main: '細かいニュアンスを<br>伝えるための工夫と決まり', sub: '時・気持ち・様子を述部で表す',
    narration: [{ t: 1, text: '文法レベル3。細かいニュアンスを伝えるための、工夫と決まりです。' }],
  }),
  hook,
  sec1, timeline, toPast, pastQuestion, pastNegative, future, f1, f2, f3,
  sec2, modalTable, modalAdd, modalQuestion, modalNegative, m1, m2, m3,
  sec3, progressive, pastProgressive, progQuestion, g1, g2,
  sec4, passive, passiveQuestion, pv1, pv2,
  sec5, perfect, perfectUses, perfectQuestion, pf1, pf2,
  summary,
];
