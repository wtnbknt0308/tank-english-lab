// よく使う場面の型。各関数は scene オブジェクト（setup / render を持つ）を返す。
import { h, ChunkRow, Countdown, mixLayouts, layoutPositions, STAGE_W, seg, ease, easeOutBack, mix, fadeIn, ROLE, plain } from './parts.js';

const BOTH = ['full', 'digest'];

/** タイトル画面 */
export function titleScene({ id = 'title', versions = BOTH, duration = 6, kicker, main, sub, narration = [] }) {
  return {
    id, versions, duration, narration, hideTag: true,
    setup(root) {
      const wrap = h('div', 'title-wrap');
      const k = h('div', 'title-kicker', kicker);
      const m = h('div', 'title-main'); m.innerHTML = main;
      const s = h('div', 'title-sub', sub);
      wrap.append(k, m, s);
      root.appendChild(wrap);
      return { k, m, s };
    },
    render(st, t) {
      fadeIn(st.k, t, 0.2);
      fadeIn(st.m, t, 0.6);
      fadeIn(st.s, t, 1.2);
    },
  };
}

/** 役割ごとの「問い」。修飾語は chunk.q で指定（どこで・いつ・だれと） */
const ROLE_Q = { s: 'だれが', v: 'どうする', o: '何を', m: '', c: '' };

/**
 * 日本語の文節カード（上の行）を、英語の順番の枠（下の行）に1枚ずつ当てはめる。
 * 上の行のカードは元の場所に残す。
 *   chunks: [{jp,p,en,role,q}]、jpOrder / enOrder: 並び順（chunks の番号）
 *   T: split 文節に分ける / glow 助詞を光らせる / color 色付け / anchors 枠を出す
 *      move 1枚目が動き出す / step 次のカードまでの間隔 / flip 英語に / done 完成文 / end
 *   practice: { no, think } を渡すと練習問題（カウントダウンつき）になる
 */
export function anchorStory({ id, versions = BOTH, chunks, jpOrder, enOrder, sentence, T, narration, heading, practice }) {
  const Y_TOP = 250, Y_BOT = 530;
  return {
    id, versions, duration: T.end, narration,
    setup(root) {
      let head = null, badge = null, cd = null;
      if (heading) { head = h('div', 'heading'); head.style.top = '120px'; head.style.fontSize = '50px'; head.innerHTML = heading; root.appendChild(head); }
      if (practice) {
        badge = h('div', 'badge', `練習 ${practice.no}`);
        badge.style.left = '64px'; badge.style.top = '110px'; badge.style.background = 'var(--accent)';
        root.appendChild(badge);
        cd = new Countdown(root, practice.think, { x: 110, y: 845, size: 150 });
      }
      // 下の行：英語の順番の枠（アンカー）
      const anchorLayer = h('div'); root.appendChild(anchorLayer);
      // 枠の列が画面からはみ出す場合は、文字を小さくして作り直す
      const GAP = 30, MAX_W = 1800;
      let fontSize = 60, top, bot, slotW;
      for (;;) {
        top = new ChunkRow(root, chunks, { y: Y_TOP, fontSize });
        slotW = chunks.map((_, i) => Math.max(top.w.jp[i], top.w.en[i]));
        const total = slotW.reduce((a, b) => a + b, 0) + GAP * (chunks.length - 1);
        if (total <= MAX_W || fontSize <= 40) break;
        top.cards.forEach((k) => k.card.remove());
        fontSize = Math.max(40, Math.floor(fontSize * (MAX_W - GAP * (chunks.length - 1)) / (total - GAP * (chunks.length - 1))));
      }
      bot = new ChunkRow(root, chunks, { y: Y_BOT, fontSize });
      const slotX = layoutPositions(slotW, enOrder, GAP, STAGE_W);
      const anchors = chunks.map((c, i) => {
        const a = h('div', 'anchor');
        a.style.left = slotX[i] + 'px'; a.style.top = Y_BOT + 'px'; a.style.width = slotW[i] + 'px';
        a.style.setProperty('--role', ROLE[c.role].color);
        const lab = h('div', 'anchor-label');
        lab.innerHTML = `${ROLE[c.role].name}<small>${c.q ?? ROLE_Q[c.role]}</small>`;
        a.appendChild(lab);
        anchorLayer.appendChild(a);
        return a;
      });
      const ans = h('div', 'sentence'); ans.style.top = '790px'; ans.style.fontSize = '66px'; ans.innerHTML = sentence;
      const ok = h('div', 'mark ok', '✓'); ok.style.left = '1700px'; ok.style.top = '730px'; ok.style.fontSize = '120px';
      root.append(ans, ok);
      return { head, badge, cd, top, bot, slotW, slotX, anchors, ans, ok };
    },
    render({ head, badge, cd, top, bot, slotW, slotX, anchors, ans, ok }, t) {
      if (head) fadeIn(head, t, 0, 0.5);
      if (badge) fadeIn(badge, t, 0, 0.4);
      const pSplit = ease(seg(t, T.split, T.split + 1.2));
      // 分ける前はカードの余白なし・すき間なしで、ふつうの1文に見せる
      const wA = top.w.jp.map((w) => w - top.pad * (1 - pSplit));
      const xA = layoutPositions(wA, jpOrder, mix(0, top.gap, pSplit), STAGE_W);
      chunks.forEach((c, i) => {
        const jr = jpOrder.indexOf(i), er = enOrder.indexOf(i);
        const pColor = ease(seg(t, T.color + 0.25 * jr, T.color + 0.25 * jr + 0.6));
        const glow = c.p ? Math.min(seg(t, T.glow + 0.3 * jr, T.glow + 0.3 * jr + 0.4), 1 - seg(t, T.color + 2, T.color + 3)) : 0;
        const ms = T.move + er * T.step;          // このカードが動き出す時刻
        const pMove = ease(seg(t, ms, ms + 1.0));
        // 上の行（元の場所）：動いたあとも少し薄くして残す
        top.set(i, {
          x: xA[i], w: wA[i], frame: pSplit, glow, colored: pColor, label: pColor,
          opacity: (practice ? seg(t, 0.4 + jr * 0.12, 0.8 + jr * 0.12) : 1) * (1 - 0.5 * seg(t, ms, ms + 0.4)),
        });
        // 下の行：上のカードの写しが枠へ飛んでいく
        const pFlip = ease(seg(t, T.flip + er * 0.35, T.flip + er * 0.35 + 0.8));
        const wB = mix(top.w.jp[i], top.w.en[i], pFlip);
        const xB = slotX[i] + (slotW[i] - wB) / 2;
        // まず下へ抜けてから横へ動く（上の行のカードの上を横切らない）
        const raw = seg(t, ms, ms + 1.0);
        const pDown = 1 - Math.pow(1 - raw, 3);
        bot.set(i, {
          x: mix(xA[i], xB, pMove), y: mix(Y_TOP, Y_BOT, pDown), w: mix(wA[i], wB, pMove),
          scale: 1 + 0.1 * Math.sin(Math.PI * pMove) + 0.08 * Math.sin(Math.PI * seg(t, T.flip + er * 0.35, T.flip + er * 0.35 + 0.8)),
          opacity: t >= ms ? 1 : 0, colored: 1, lang: pFlip,
        });
        const pa = ease(seg(t, T.anchors + er * 0.15, T.anchors + er * 0.15 + 0.5));
        anchors[i].style.opacity = pa;
        anchors[i].style.transform = `translateY(${(1 - pa) * 20}px)`;
      });
      if (cd) cd.set(t - T.think0, Math.min(seg(t, T.think0 - 0.4, T.think0), 1 - seg(t, T.think0 + practice.think, T.think0 + practice.think + 0.5)));
      fadeIn(ans, t, T.done, 0.6);
      ok.style.opacity = seg(t, T.done + 0.6, T.done + 0.8);
      ok.style.transform = `scale(${easeOutBack(seg(t, T.done + 0.6, T.done + 1.1))})`;
    },
  };
}

/** 練習問題の時刻表を作る（考える時間 think 秒、3秒後に色のヒント） */
export function practiceTimes(n, think = 10) {
  const think0 = 2.5, T1 = think0 + think;
  const move = T1 + 0.6, step = 1.0;
  const flip = move + n * step + 0.6, done = flip + n * 0.35 + 1;
  return { split: -2, glow: 999, anchors: 0.8, think0, color: think0 + 3, answer: T1, move, step, flip, done, end: done + 4.5 };
}

/**
 * 肯定文 → 疑問文・否定文への変形（2行表示）。
 * 1行目に肯定文、2行目にその写しを出し、2行目だけを変化させる。主語は動かさない。
 *   enter（自動判定）
 *     'hidden' do が一般動詞のカードの後ろにかくれていて、のぞいてから見える位置へ移動する
 *     'move'   be動詞そのものが先頭へ移動する。もとの場所には空欄が残る
 *     'drop'   not が上から入る
 *   chunks: 英語カード。insert: 動くカードの番号、behind: do がかくれる一般動詞の番号
 *   baseOrder / newOrder、changeAlt: en → en2 に変えるカード（do→Do, You→you, . →? など）
 *   rows: ['肯定文', '疑問文']、jp: ['日本語訳1', '日本語訳2']
 *   T: show 1行目 / copy 2行目が出る / peek のぞく / insert 移動 / alt 文字の変化 / note 説明 / end
 */
export function transformScene({ id, versions = BOTH, heading, chunks, baseOrder, newOrder, insert = null, behind, changeAlt = [], extra = [], T, narration, peekNote, note, noteAt, practice, think = 7, rows = ['肯定文', '疑問文'], jp = ['', ''], toc }) {
  // extra: 2行目の最後に上から入るカード（for five years など）。T.mark: [ ] の印を光らせる時刻
  // insert が null のときは、カードは動かず形だけが変わる（play → played など）。noteAt: 吹き出しを出すカード
  if (noteAt == null) noteAt = insert;
  const enter = baseOrder.includes(insert) ? 'move' : behind != null ? 'hidden' : 'drop';
  T = { copy: T.show + 1.2, peek: T.show + 1.2, ...T };
  if (T.mark == null) T = { ...T, mark: T.peek + 1.5 };
  const shift = practice ? think + 1 : 0; // 練習のときは考える時間を入れる
  const fixed = ['show', 'copy', 'peek', 'mark'];
  const TT = Object.fromEntries(Object.entries(T).map(([k, v]) => [k, fixed.includes(k) ? v : v + shift]));
  const Y1 = 330, Y2 = 640, PEEK = 72, GAP = 28, CX = 120; // CX: 左の「肯定文」ラベルの分だけ右へ寄せる
  return {
    id, versions, duration: TT.end, narration, toc,
    setup(root) {
      const head = h('div', 'heading'); head.style.top = '110px'; head.innerHTML = heading; root.appendChild(head);
      const slot = h('div', 'anchor'); slot.style.setProperty('--role', '#9aa1b0'); slot.style.top = Y2 + 'px'; root.appendChild(slot);
      const base = chunks.map((c) => ({ ...c, en2: c.en }));
      // 2行目の最終位置を計算する：主語（先頭）は動かさない。
      // 左のラベル（250px）から右端（1890px）に入らなければ、文字を小さくして作り直す
      let r1, r2, A, B, w2, L, Rr, fontSize = 60;
      for (let tries = 0; tries < 3; tries++) {
        r1 = new ChunkRow(root, base, { y: Y1, gap: GAP, fontSize });
        r2 = new ChunkRow(root, chunks, { y: Y2, gap: GAP, fontSize });
        A = r1.positions(baseOrder, 'en').map((x) => (x == null ? null : x + CX));
        w2 = r2.w.en2;
        B = A.slice();
        if (insert != null && newOrder.indexOf(insert) === 0) {
          B[insert] = A[newOrder[1]] - GAP - w2[insert];
          // do / did が出てくる型は、主語から後ろを詰めて並べ直す（played → play で幅が変わるため）。
          // be動詞・助動詞が動く型は、もとの場所を空欄として残すので並べ直さない。
          if (!baseOrder.includes(insert)) {
            let x = A[newOrder[1]];
            newOrder.slice(1).forEach((i) => { B[i] = x; x += w2[i] + GAP; });
          }
        } else {
          let x = A[newOrder[0]];
          newOrder.forEach((i) => { B[i] = x; x += w2[i] + GAP; });
        }
        const xs = [...A, ...B].map((x, j) => [x, j < A.length ? r1.w.en[j] : w2[j - A.length]]).filter(([x]) => x != null);
        L = Math.min(...xs.map(([x]) => x)); Rr = Math.max(...xs.map(([x, w]) => x + w));
        if (Rr - L <= 1640) break;
        [...r1.cards, ...r2.cards].forEach((k) => k.card.remove());
        fontSize = Math.floor(fontSize * 1600 / (Rr - L));
      }
      r2.cards.forEach((k, i) => { k.card.style.zIndex = i === insert ? 1 : 2; });
      // 2行とも同じだけずらして、画面に収める（上下のそろいは保つ）
      let dx = 0;
      if (Rr > 1890) dx = 1890 - Rr;
      if (L + dx < 250) dx = 250 - L;
      for (let i = 0; i < A.length; i++) { if (A[i] != null) A[i] += dx; if (B[i] != null) B[i] += dx; }
      if (insert != null) { slot.style.left = A[insert] + 'px'; slot.style.width = r1.w.en[insert] + 'px'; }
      const lab = (y, text, bg) => { const e = h('div', 'badge', text); e.style.left = '48px'; e.style.top = y + 38 + 'px'; e.style.background = bg; e.style.fontSize = '36px'; root.appendChild(e); return e; };
      const l1 = lab(Y1, rows[0], 'var(--sub)'), l2 = lab(Y2, rows[1], 'var(--x)');
      const jpLine = (y, text) => { const e = h('div', 'sentence'); e.style.top = y + 198 + 'px'; e.style.left = CX * 2 + 'px'; e.style.fontSize = '32px'; e.style.color = 'var(--sub)'; e.style.fontWeight = '700'; e.textContent = text ? `「${text}」` : ''; root.appendChild(e); return e; };
      const j1 = jpLine(Y1, jp[0]), j2 = jpLine(Y2, jp[1]);
      const mk = (text) => { const e = h('div', 'badge', text ?? ''); e.style.background = 'var(--x)'; e.style.fontSize = '32px'; e.style.zIndex = 4; root.appendChild(e); return e; };
      const peekEl = mk(peekNote), noteEl = mk(note);
      let cd = null, badge = null;
      if (practice) {
        cd = new Countdown(root, think, { x: 110, y: 905, size: 130 });
        badge = h('div', 'badge', practice); badge.style.left = '64px'; badge.style.top = '110px'; badge.style.background = 'var(--accent)';
        root.appendChild(badge);
      }
      return { head, slot, r1, r2, A, B, l1, l2, j1, j2, peekEl, noteEl, cd, badge };
    },
    render({ head, slot, r1, r2, A, B, l1, l2, j1, j2, peekEl, noteEl, cd, badge }, t) {
      fadeIn(head, t, 0, 0.5);
      if (badge) fadeIn(badge, t, 0, 0.4);
      fadeIn(l1, t, TT.show); fadeIn(j1, t, TT.show + 0.4);
      fadeIn(l2, t, TT.insert); fadeIn(j2, t, TT.alt + 0.6);
      const pCopy = ease(seg(t, TT.copy, TT.copy + 1.0));
      const pMake = ease(seg(t, TT.insert, TT.insert + 1.6));
      const pPeek = enter === 'hidden' ? ease(seg(t, TT.peek + 1.0, TT.peek + 1.8)) : 0;
      const hideX = enter === 'hidden' ? A[behind] + (r2.w.en[behind] - r2.w.en[insert]) / 2 : enter === 'move' ? A[insert] : B[insert];
      chunks.forEach((c, i) => {
        const inBase = baseOrder.includes(i);
        const pMark = ease(seg(t, TT.mark, TT.mark + 0.6));
        // 1行目：肯定文（変化しない）
        if (inBase) r1.set(i, { x: A[i], w: r1.w.en[i], lang: 1, colored: 1, label: 1, opacity: seg(t, TT.show + 0.2 + i * 0.1, TT.show + 0.6 + i * 0.1), mark: pMark });
        else r1.set(i, { x: 0, w: 0, opacity: 0 });
        // 2行目：写しが下りてきて、動くカードだけが変化する
        const pAlt = changeAlt.includes(i) ? ease(seg(t, TT.alt, TT.alt + 0.8)) : 0;
        const w = mix(r2.w.en[i], r2.w.en2[i], pAlt);
        const yCopy = mix(Y1, Y2, pCopy);
        if (i === insert) {
          r2.cards[i].card.style.zIndex = t >= TT.insert ? 3 : 1;
          const x = mix(hideX, B[i] + (r2.w.en2[i] - w) / 2, pMake);
          const dropIn = enter === 'drop' ? 1 - easeOutBack(seg(t, TT.insert + 0.4, TT.insert + 1.2)) : 0;
          const hop = enter === 'move' ? 150 : 40;
          r2.set(i, {
            x, w, y: enter === 'drop' ? Y2 : yCopy, lang: 1, colored: 1, label: enter === 'move' ? 1 : 0, alt: pAlt,
            opacity: enter === 'drop' ? seg(t, TT.insert + 0.3, TT.insert + 0.6) : pCopy,
            lift: mix(PEEK * pPeek, 0, ease(seg(t, TT.insert + 0.6, TT.insert + 1.6))) + (enter === 'drop' ? 230 * dropIn : hop * Math.sin(Math.PI * seg(t, TT.insert, TT.insert + 1.2))),
            scale: 1 + 0.1 * Math.sin(Math.PI * pAlt), mark: pMark,
          });
          return;
        }
        if (extra.includes(i)) {
          const d = easeOutBack(seg(t, TT.alt + 0.2, TT.alt + 1.0));
          r2.set(i, { x: B[i], w: r2.w.en2[i], y: Y2, lang: 1, colored: 1, label: 1, alt: 1, opacity: seg(t, TT.alt + 0.1, TT.alt + 0.4), lift: 230 * (1 - d), mark: pMark });
          return;
        }
        r2.set(i, {
          x: mix(A[i], B[i], pMake), w, y: yCopy, lang: 1, colored: 1, label: 1, alt: pAlt,
          opacity: pCopy, scale: 1 + 0.12 * Math.sin(Math.PI * pAlt), mark: pMark,
        });
      });
      // be動詞が抜けたあとの空欄
      slot.style.opacity = enter === 'move' ? ease(seg(t, TT.insert + 0.3, TT.insert + 1.0)) : 0;
      const place = (el, left, top, p, center = true) => {
        el.style.left = left + 'px'; el.style.top = top + 'px';
        el.style.opacity = p; el.style.transform = `translate(${center ? '-50%' : '0'}, ${(1 - p) * 16}px)`;
      };
      if (peekNote && enter === 'hidden') place(peekEl, hideX + r2.w.en[insert] + 14, Y2 - PEEK + 8, Math.min(ease(seg(t, TT.peek + 1.5, TT.peek + 2)), 1 - seg(t, TT.insert - 0.2, TT.insert + 0.2)), false);
      else peekEl.style.opacity = 0;
      if (note && noteAt != null) place(noteEl, B[noteAt] + r2.w.en2[noteAt] / 2, Y2 - 70, ease(seg(t, TT.note, TT.note + 0.5)));
      else noteEl.style.opacity = 0;
      if (cd) {
        const c0 = TT.peek + 2;
        cd.set(t - c0, Math.min(seg(t, c0 - 0.4, c0), 1 - seg(t, c0 + think, c0 + think + 0.5)));
      }
    },
  };
}

/** 章の中の区切り（1 一般動詞とbe動詞 など） */
export function sectionScene({ id, versions = BOTH, no, title, sub = '', duration = 4, narration = [], toc }) {
  return {
    id, versions, duration, narration, toc,
    setup(root) {
      const wrap = h('div', 'title-wrap');
      const n = h('div', 'section-no', String(no));
      const m = h('div', 'title-main'); m.style.fontSize = '80px'; m.innerHTML = title;
      const s2 = h('div', 'title-sub', sub);
      wrap.append(n, m, s2); root.appendChild(wrap);
      return { n, m, s2 };
    },
    render({ n, m, s2 }, t) {
      n.style.transform = `scale(${easeOutBack(seg(t, 0.1, 0.6))})`;
      fadeIn(m, t, 0.4); fadeIn(s2, t, 0.9);
    },
  };
}

/**
 * 空所補充の練習。chunks のうち blank 番目が（　）になり、考える時間のあとで答えのカードが入る。
 * options: 選択肢（文字列）、why: 答えの理由（字幕）
 */
export function fillBlankScene({ id, versions = ['full'], no, jp, chunks, blank, options, why, think = 8, toc }) {
  const think0 = 2, T1 = think0 + think, end = T1 + 6;
  return {
    id, versions, duration: end, toc,
    narration: [
      { t: 0, text: `練習${no}　「${jp}」` },
      { t: think0, text: '（　）に入る語はどれ？　止めて考えてもOK！' },
      { t: T1, text: `答え：<em>${plain(chunks[blank].en)}</em>` },
      { t: T1 + 1.8, text: why },
    ],
    setup(root) {
      const badge = h('div', 'badge', `練習 ${no}`); badge.style.left = '64px'; badge.style.top = '110px'; badge.style.background = 'var(--accent)';
      const head = h('div', 'heading'); head.innerHTML = `（　）に入る語はどれ？<small>「${jp}」</small>`;
      root.append(badge, head);
      const row = new ChunkRow(root, chunks, { y: 440 });
      const xs = row.positions(chunks.map((_, i) => i), 'en');
      const slot = h('div', 'anchor');
      slot.style.left = xs[blank] + 'px'; slot.style.top = '440px'; slot.style.width = row.w.en[blank] + 'px';
      slot.style.setProperty('--role', '#5b6478');
      slot.innerHTML = '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:60px;font-weight:900;color:#5b6478">？</div>';
      root.insertBefore(slot, row.cards[0].card);
      const opts = options.map((o, i) => {
        const e = h('div', 'badge', o); e.style.fontSize = '46px'; e.style.padding = '10px 40px';
        e.style.top = '700px'; e.style.left = (960 + (i - (options.length - 1) / 2) * 260) + 'px';
        e.style.background = '#fff'; e.style.color = 'var(--ink)'; e.style.border = '4px solid var(--ink)';
        root.appendChild(e); return e;
      });
      const cd = new Countdown(root, think, { x: 110, y: 845, size: 150 });
      return { badge, head, row, xs, slot, opts, cd };
    },
    render({ badge, head, row, xs, slot, opts, cd }, t) {
      fadeIn(badge, t, 0, 0.4); fadeIn(head, t, 0.2);
      const drop = easeOutBack(seg(t, T1 + 0.2, T1 + 0.9));
      chunks.forEach((c, i) => row.set(i, {
        x: xs[i], w: row.w.en[i], lang: 1, colored: 1, label: 1,
        opacity: i === blank ? seg(t, T1 + 0.2, T1 + 0.4) : seg(t, 0.5 + i * 0.1, 0.9 + i * 0.1),
        lift: i === blank ? 200 * (1 - drop) : 0,
      }));
      slot.style.opacity = seg(t, 0.5, 0.9);
      opts.forEach((e, i) => {
        const p = ease(seg(t, think0 - 0.6 + i * 0.15, think0 - 0.2 + i * 0.15));
        const right = e.textContent === plain(chunks[blank].en);
        const hit = right ? ease(seg(t, T1, T1 + 0.4)) : 0;
        e.style.opacity = right ? p : p * (1 - 0.6 * seg(t, T1, T1 + 0.4));
        e.style.transform = `translate(-50%, ${(1 - p) * 20}px) scale(${1 + 0.15 * hit})`;
        e.style.background = hit > 0.5 ? 'var(--x)' : '#fff';
        e.style.color = hit > 0.5 ? '#fff' : 'var(--ink)';
        e.style.borderColor = hit > 0.5 ? 'var(--x)' : 'var(--ink)';
      });
      cd.set(t - think0, Math.min(seg(t, think0 - 0.4, think0), 1 - seg(t, T1, T1 + 0.5)));
    },
  };
}

/**
 * 答え方：質問の文と、Yes / No の答えを順に出す。
 * lines: [{ html, tag, color, t }]（html の中の <span class="hl"> が光る）、hlAt: 光らせる時刻
 * practice: { label, think0, think } を渡すと、答えの前に考える時間が入る
 */
export function answerScene({ id, versions = BOTH, heading, lines, hlAt, duration, narration, practice, toc }) {
  return {
    id, versions, duration, narration, toc,
    setup(root) {
      const head = h('div', 'heading'); head.innerHTML = heading; root.appendChild(head);
      const els = lines.map((l, i) => {
        const e = h('div', 'sentence'); e.style.top = 290 + i * 160 + 'px'; e.style.fontSize = (i === 0 ? 76 : 70) + 'px';
        e.innerHTML = (l.tag ? `<span class="badge" style="position:static;display:inline-block;vertical-align:middle;margin-right:28px;font-size:34px;background:${l.color}">${l.tag}</span>` : '') + l.html;
        root.appendChild(e); return e;
      });
      let cd = null, badge = null;
      if (practice) {
        badge = h('div', 'badge', practice.label); badge.style.left = '64px'; badge.style.top = '110px'; badge.style.background = 'var(--accent)';
        root.appendChild(badge);
        cd = new Countdown(root, practice.think, { x: 110, y: 845, size: 150 });
      }
      return { head, els, hls: els.map((e) => [...e.querySelectorAll('.hl')]), cd, badge };
    },
    render({ head, els, hls, cd, badge }, t) {
      fadeIn(head, t, 0);
      if (badge) fadeIn(badge, t, 0, 0.4);
      els.forEach((e, i) => fadeIn(e, t, lines[i].t));
      const p = ease(seg(t, hlAt, hlAt + 0.6));
      hls.flat().forEach((e) => { e.style.background = `rgba(242,157,18,${p})`; e.style.color = p > 0.5 ? '#fff' : ''; e.style.borderRadius = '10px'; e.style.padding = '0 8px'; });
      if (cd) cd.set(t - practice.think0, Math.min(seg(t, practice.think0 - 0.4, practice.think0), 1 - seg(t, practice.think0 + practice.think, practice.think0 + practice.think + 0.5)));
    },
  };
}

/**
 * 「いちばんシンプルな現在形」を上に、新しい表現を下に並べて、何がどう変わったかを見せる。
 * base: { html, jp }、items: [{ label, html, jp, t }]（html の中の <span class="chg"> が変わった部分）
 */
export function compareStackScene({ id, versions = BOTH, toc, heading = 'シンプルな現在形からの変化', base, items, duration, narration }) {
  return {
    id, versions, duration, narration, toc,
    setup(root) {
      const head = h('div', 'heading'); head.style.top = '110px'; head.textContent = heading; root.appendChild(head);
      const top = h('div', 'box'); top.style.left = '160px'; top.style.width = '1600px'; top.style.top = '220px'; top.style.height = '130px';
      top.style.borderColor = 'var(--sub)';
      top.innerHTML = `<div class="badge" style="left:28px;top:38px;background:var(--sub);font-size:30px">いちばんシンプルな現在形</div>
        <div style="position:absolute;left:470px;top:0;bottom:0;display:flex;align-items:center;font-size:58px;font-weight:900;white-space:pre"><span>${base.html}</span></div>
        <div style="position:absolute;right:40px;top:0;bottom:0;display:flex;align-items:center;font-size:32px;font-weight:700;color:var(--sub)">「${base.jp}」</div>`;
      root.appendChild(top);
      const arrow = h('div', 'mark', '↓'); arrow.style.cssText += 'left:930px;top:340px;font-size:64px;color:var(--sub);';
      root.appendChild(arrow);
      const gap = Math.min(120, 470 / Math.max(1, items.length));
      const rows = items.map((it, i) => {
        const r = h('div'); r.style.cssText = `position:absolute;left:160px;width:1600px;top:${440 + i * gap}px;height:${gap - 14}px;`;
        r.innerHTML = `<div class="badge" style="position:absolute;left:28px;top:50%;transform:translateY(-50%);background:var(--x);font-size:30px">${it.label}</div>
          <div style="position:absolute;left:300px;top:0;bottom:0;display:flex;align-items:center;font-size:52px;font-weight:900;white-space:pre"><span>${it.html}</span></div>
          <div style="position:absolute;right:40px;top:0;bottom:0;display:flex;align-items:center;font-size:30px;font-weight:700;color:var(--sub)">「${it.jp}」</div>`;
        root.appendChild(r); return r;
      });
      // 英文が右の日本語訳にかかるときは、英文の文字を小さくする
      const fit = (box) => {
        const [sent, jp] = [...box.children].slice(1);
        const span = sent.firstChild;
        let fs = parseFloat(sent.style.fontSize);
        while (fs > 32 && span.getBoundingClientRect().right > jp.firstChild.getBoundingClientRect?.().left - 30) { fs -= 2; sent.style.fontSize = fs + 'px'; }
      };
      [top, ...rows].forEach((b) => { b.children[2].innerHTML = `<span>${b.children[2].innerHTML}</span>`; fit(b); });
      return { head, top, arrow, rows };
    },
    render({ head, top, arrow, rows }, t) {
      fadeIn(head, t, 0); fadeIn(top, t, 0.4); fadeIn(arrow, t, 1.2, 0.4, 0);
      rows.forEach((r, i) => fadeIn(r, t, items[i].t));
    },
  };
}

export { ROLE };
