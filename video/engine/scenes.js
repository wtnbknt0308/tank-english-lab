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
 *      move 1枚目が動き出す / step 次のカードまでの間隔 / drop 助詞を消す / flip 英語に / done 完成文 / end
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
      const pDrop = ease(seg(t, T.drop, T.drop + 1.0));
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
        const wB = mix(mix(top.w.jp[i], top.w.jpNoP[i], pDrop), top.w.en[i], pFlip);
        const xB = slotX[i] + (slotW[i] - wB) / 2;
        // まず下へ抜けてから横へ動く（上の行のカードの上を横切らない）
        const raw = seg(t, ms, ms + 1.0);
        const pDown = 1 - Math.pow(1 - raw, 3);
        bot.set(i, {
          x: mix(xA[i], xB, pMove), y: mix(Y_TOP, Y_BOT, pDown), w: mix(wA[i], wB, pMove),
          scale: 1 + 0.1 * Math.sin(Math.PI * pMove) + 0.08 * Math.sin(Math.PI * seg(t, T.flip + er * 0.35, T.flip + er * 0.35 + 0.8)),
          opacity: t >= ms ? 1 : 0, colored: 1, particle: 1 - pDrop, lang: pFlip,
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
  const drop = move + n * step + 0.4, flip = drop + 1.2, done = flip + n * 0.35 + 1;
  return { split: -2, glow: 999, anchors: 0.8, think0, color: think0 + 3, answer: T1, move, step, drop, flip, done, end: done + 4.5 };
}

/**
 * 肯定文 → 疑問文・否定文への変形。
 * chunks: 英語カード。insert: 新しく入るカードの番号（最初は見えない）
 * baseOrder / newOrder、changeAlt: en → en2 に変えるカード番号（You→you, . →? など）
 * T: show 元の文 / insert 合図カードが入る / alt 文字の変化 / note 説明 / end
 */
export function transformScene({ id, versions = BOTH, heading, chunks, baseOrder, newOrder, insert, changeAlt = [], T, narration, note, practice, think = 7 }) {
  const shift = practice ? think + 1 : 0; // 練習のときは考える時間を入れる
  const TT = Object.fromEntries(Object.entries(T).map(([k, v]) => [k, k === 'show' ? v : v + shift]));
  return {
    id, versions, duration: TT.end, narration,
    setup(root) {
      const head = h('div', 'heading'); head.innerHTML = heading; root.appendChild(head);
      const row = new ChunkRow(root, chunks, { y: 430 });
      const noteEl = h('div', 'badge', note?.text ?? '');
      noteEl.style.background = 'var(--x)'; noteEl.style.fontSize = '36px';
      root.appendChild(noteEl);
      let cd = null, badge = null;
      if (practice) {
        cd = new Countdown(root, think);
        badge = h('div', 'badge', practice); badge.style.left = '64px'; badge.style.top = '110px'; badge.style.background = 'var(--accent)';
        root.appendChild(badge);
      }
      return { head, row, noteEl, cd, badge };
    },
    render({ head, row, noteEl, cd, badge }, t) {
      fadeIn(head, t, 0, 0.5);
      if (badge) fadeIn(badge, t, 0, 0.4);
      const A = { xs: row.positions(baseOrder, 'en'), mode: 'en' };
      const B = { xs: row.positions(newOrder, 'en2'), mode: 'en2' };
      const pMake = ease(seg(t, TT.insert, TT.insert + 1.4));
      const L = mixLayouts(row, A, B, pMake);
      chunks.forEach((c, i) => {
        const isNew = i === insert;
        const drop = easeOutBack(seg(t, TT.insert + 0.5, TT.insert + 1.3));
        row.set(i, {
          x: L[i].x, w: L[i].w, lang: 1,
          y: isNew ? mix(180, 430, drop) : 430,
          opacity: isNew ? seg(t, TT.insert + 0.4, TT.insert + 0.7) : seg(t, TT.show + 0.2 + i * 0.1, TT.show + 0.6 + i * 0.1),
          colored: 1, label: isNew ? 0 : 1,
          alt: changeAlt.includes(i) ? ease(seg(t, TT.alt, TT.alt + 0.8)) : 0,
          scale: changeAlt.includes(i) ? 1 + 0.12 * Math.sin(Math.PI * seg(t, TT.alt, TT.alt + 0.8)) : 1,
        });
      });
      if (note && insert != null) {
        const xs = row.positions(newOrder, 'en2');
        const cx = xs[insert] + row.w.en2[insert] / 2;
        noteEl.style.left = cx + 'px';
        noteEl.style.top = '300px';
        const p = ease(seg(t, TT.note, TT.note + 0.5));
        noteEl.style.opacity = p;
        noteEl.style.transform = `translate(-50%, ${(1 - p) * 20}px)`;
      } else noteEl.style.opacity = 0;
      if (cd) cd.set(t - 2.5, Math.min(seg(t, 2.1, 2.5), 1 - seg(t, 2.5 + think, 3 + think)));
    },
  };
}

export { ROLE };
