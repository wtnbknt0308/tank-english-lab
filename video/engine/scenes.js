// よく使う場面の型。各関数は scene オブジェクト（setup / render を持つ）を返す。
import { h, ChunkRow, Countdown, mixLayouts, layoutPositions, STAGE_W, seg, ease, easeOutBack, mix, fadeIn, ROLE } from './parts.js';

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
 * 肯定文 → 疑問文・否定文への変形。
 * 合図のカード（do）は、最初から一般動詞のカードの「後ろ」にかくれている。
 * peek でカードが少しのぞき、insert で見える位置へスライドして出てくる。
 *   chunks: 英語カード。insert: かくれているカードの番号、behind: その前にある一般動詞のカードの番号
 *   baseOrder / newOrder、changeAlt: en → en2 に変えるカード番号（do→Do, You→you, . →? など）
 *   T: show 元の文 / peek のぞく / insert スライド / alt 文字の変化 / note 説明 / end
 *   peekNote / note: 吹き出しの文字
 */
export function transformScene({ id, versions = BOTH, heading, chunks, baseOrder, newOrder, insert, behind, changeAlt = [], T, narration, peekNote, note, practice, think = 7 }) {
  // enter: 'hidden' 動詞の後ろから出てくる / 'move' 文の中のカードが動く（be動詞） / 'drop' 上から入る（not）
  const enter = baseOrder.includes(insert) ? 'move' : behind != null ? 'hidden' : 'drop';
  if (T.peek == null) T = { ...T, peek: T.show };
  const shift = practice ? think + 1 : 0; // 練習のときは考える時間を入れる
  const TT = Object.fromEntries(Object.entries(T).map(([k, v]) => [k, k === 'show' || k === 'peek' ? v : v + shift]));
  const Y = 450, PEEK = 100;
  return {
    id, versions, duration: TT.end, narration,
    setup(root) {
      const head = h('div', 'heading'); head.innerHTML = heading; root.appendChild(head);
      const row = new ChunkRow(root, chunks, { y: Y });
      row.cards.forEach((k, i) => { k.card.style.zIndex = i === insert ? 1 : 2; });
      const mk = (text) => { const e = h('div', 'badge', text ?? ''); e.style.background = 'var(--x)'; e.style.fontSize = '34px'; e.style.zIndex = 3; root.appendChild(e); return e; };
      const peekEl = mk(peekNote), noteEl = mk(note);
      let cd = null, badge = null;
      if (practice) {
        cd = new Countdown(root, think);
        badge = h('div', 'badge', practice); badge.style.left = '64px'; badge.style.top = '110px'; badge.style.background = 'var(--accent)';
        root.appendChild(badge);
      }
      return { head, row, peekEl, noteEl, cd, badge };
    },
    render({ head, row, peekEl, noteEl, cd, badge }, t) {
      fadeIn(head, t, 0, 0.5);
      if (badge) fadeIn(badge, t, 0, 0.4);
      const A = row.positions(baseOrder, 'en');
      const B = row.positions(newOrder, 'en2');
      const pMake = ease(seg(t, TT.insert, TT.insert + 1.6));
      // かくれている位置：一般動詞のカードの真後ろ（中央そろえ）
      const hideX = enter === 'hidden' ? A[behind] + (row.w.en[behind] - row.w.en[insert]) / 2
        : enter === 'move' ? A[insert] : B[insert];
      const pPeek = enter === 'hidden' ? ease(seg(t, TT.peek, TT.peek + 0.8)) : 0;
      chunks.forEach((c, i) => {
        const pAlt = changeAlt.includes(i) ? ease(seg(t, TT.alt, TT.alt + 0.8)) : 0;
        const w = mix(row.w.en[i], row.w.en2[i], pAlt);
        if (i === insert) {
          // のぞいた高さから、スライドしながら列に下りる（ほかのカードの上を通る）
          const x = mix(hideX, B[i] + (row.w.en2[i] - w) / 2, pMake);
          // かくれている間は動詞の後ろ、出てくるときはほかのカードの手前を通る
          row.cards[i].card.style.zIndex = t >= TT.insert ? 3 : 1;
          const dropIn = enter === 'drop' ? 1 - easeOutBack(seg(t, TT.insert + 0.4, TT.insert + 1.2)) : 0;
          row.set(i, {
            x, w, lang: 1, colored: 1, label: enter === 'move' ? 1 : 0, alt: pAlt,
            opacity: enter === 'drop' ? seg(t, TT.insert + 0.3, TT.insert + 0.6) : seg(t, TT.show, TT.show + 0.6),
            lift: mix(PEEK * pPeek, 0, ease(seg(t, TT.insert + 0.6, TT.insert + 1.6))) + (enter === 'drop' ? 230 * dropIn : (enter === 'move' ? 150 : 40) * Math.sin(Math.PI * seg(t, TT.insert, TT.insert + 1.2))),
            scale: 1 + 0.1 * Math.sin(Math.PI * seg(t, TT.alt, TT.alt + 0.8)) * (changeAlt.includes(i) ? 1 : 0),
          });
          return;
        }
        row.set(i, {
          x: mix(A[i], B[i], pMake), w, lang: 1, y: Y, colored: 1, label: 1, alt: pAlt,
          opacity: seg(t, TT.show + 0.2 + i * 0.1, TT.show + 0.6 + i * 0.1),
          scale: 1 + 0.12 * Math.sin(Math.PI * pAlt) * (changeAlt.includes(i) ? 1 : 0),
        });
      });
      // 吹き出し：のぞいたとき（かくれている do）と、出てきたあと
      const place = (el, cx, top, p) => {
        el.style.left = cx + 'px'; el.style.top = top + 'px';
        el.style.opacity = p; el.style.transform = `translate(-50%, ${(1 - p) * 20}px)`;
      };
      if (peekNote) place(peekEl, A[behind] + row.w.en[behind] / 2, Y - PEEK - 70, Math.min(ease(seg(t, TT.peek + 0.5, TT.peek + 1)), 1 - seg(t, TT.insert - 0.2, TT.insert + 0.2)));
      else peekEl.style.opacity = 0;
      if (note) place(noteEl, B[insert] + row.w.en2[insert] / 2, Y - 95, ease(seg(t, TT.note, TT.note + 0.5)));
      else noteEl.style.opacity = 0;
      if (cd) cd.set(t - TT.peek - 1.5, Math.min(seg(t, TT.peek + 1.1, TT.peek + 1.5), 1 - seg(t, TT.peek + 1.5 + think, TT.peek + 2 + think)));
    },
  };
}

/** 章の中の区切り（1 一般動詞とbe動詞 など） */
export function sectionScene({ id, versions = BOTH, no, title, sub = '', duration = 4, narration = [] }) {
  return {
    id, versions, duration, narration,
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
export function fillBlankScene({ id, versions = ['full'], no, jp, chunks, blank, options, why, think = 8 }) {
  const think0 = 2, T1 = think0 + think, end = T1 + 6;
  return {
    id, versions, duration: end,
    narration: [
      { t: 0, text: `練習${no}　「${jp}」` },
      { t: think0, text: '（　）に入る語はどれ？　止めて考えてもOK！' },
      { t: T1, text: `答え：<em>${chunks[blank].en}</em>` },
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
        const right = e.textContent === chunks[blank].en;
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
export function answerScene({ id, versions = BOTH, heading, lines, hlAt, duration, narration, practice }) {
  return {
    id, versions, duration, narration,
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

export { ROLE };
