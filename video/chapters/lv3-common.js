// Lv3（3-1〜3-5）で共通に使う場面
import { h, ChunkRow, layoutPositions, seg, ease, easeOutBack, mix, fadeIn, ROLE } from '../engine/parts.js';

export const BOTH = ['full', 'digest'];
export const FULL = ['full'];
export const V = ROLE.v.color;
/** 変わった部分（compareStackScene 用） */
export const chg = (s) => `<span class="chg">${s}</span>`;

// つかみ：I ＿＿ tennis ＿＿. の述部だけを入れかえていく
export const hook = {
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


export const timeline = {
  id: 'timeline', toc: '1', versions: BOTH, duration: 21,
  narration: [
    { t: 0, text: '時の表し方を、時間の矢印で見てみましょう。' },
    { t: 2.5, text: '現在形 <em>I play tennis every day.</em>　現在形は「いつもすること」です。' },
    { t: 7.5, text: '過去形 <em>I played tennis yesterday.</em>　もう終わったこと。動詞に -ed をつけます。' },
    { t: 12.5, text: '未来 <em>I will play tennis tomorrow.</em>　will ＋ 動詞の原形です。' },
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


// 能動態 → 受動態：目的語だった Ken が主語の位置へ、Everyone は by をつけて後ろへ
export const passive = {
  id: 'passive', toc: '4', versions: BOTH, duration: 22,
  narration: [
    { t: 0, text: '受動態は「〜される」という言い方。' },
    { t: 2.5, text: 'シンプルな現在形「多くの人がテニスをします。」<em>Many people play tennis.</em>' },
    { t: 5, text: '「テニス」を主役にして、文の最初に出します。' },
    { t: 9, text: 'もとの主語 many people は、<em>by</em> をつけて後ろへ。' },
    { t: 12.5, text: '動詞は <em>be動詞 ＋ 過去分詞</em>。play → is played。' },
    { t: 16.5, text: '<em>Tennis is played by many people.</em>「テニスは多くの人にされています。」' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.style.top = '110px'; head.innerHTML = '受動態にするには？<small>シンプルな現在形 → 受動態</small>'; root.appendChild(head);
    const Y1 = 330, Y2 = 640, GAP = 28;
    const chunks = [
      { en: 'Many people', en2: 'by many people.', role: 's' },
      { en: 'play', en2: 'played', role: 'v' },
      { en: 'tennis.', en2: 'Tennis', role: 'o' },
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
    const l1 = lab(Y1, '現在形', 'var(--sub)'), l2 = lab(Y2, '受動態', 'var(--x)');
    const jpLine = (y, text) => { const e = h('div', 'sentence'); e.style.top = y + 198 + 'px'; e.style.left = '240px'; e.style.fontSize = '32px'; e.style.color = 'var(--sub)'; e.style.fontWeight = '700'; e.textContent = `「${text}」`; root.appendChild(e); return e; };
    const j1 = jpLine(Y1, '多くの人がテニスをします。'), j2 = jpLine(Y2, 'テニスは多くの人にされています。');
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


export const perfectUses = {
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
      ['継続', 'ずっと〜している', `I ${em('have played')} tennis for five years.`, 'for / since', 'bar'],
      ['経験', '〜したことがある', `I ${em('have played')} tennis twice.`, 'ever / never / 〜回', 'dots'],
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

