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
      const hideX = A[behind] + (row.w.en[behind] - row.w.en[insert]) / 2;
      const pPeek = ease(seg(t, TT.peek, TT.peek + 0.8));
      chunks.forEach((c, i) => {
        const pAlt = changeAlt.includes(i) ? ease(seg(t, TT.alt, TT.alt + 0.8)) : 0;
        const w = mix(row.w.en[i], row.w.en2[i], pAlt);
        if (i === insert) {
          // のぞいた高さから、スライドしながら列に下りる（ほかのカードの上を通る）
          const x = mix(hideX, B[i] + (row.w.en2[i] - w) / 2, pMake);
          // かくれている間は動詞の後ろ、出てくるときはほかのカードの手前を通る
          row.cards[i].card.style.zIndex = t >= TT.insert ? 3 : 1;
          row.set(i, {
            x, w, lang: 1, colored: 1, label: 0, alt: pAlt,
            opacity: seg(t, TT.show, TT.show + 0.6),
            lift: mix(PEEK * pPeek, 0, ease(seg(t, TT.insert + 0.6, TT.insert + 1.6))) + 40 * Math.sin(Math.PI * seg(t, TT.insert, TT.insert + 1.2)),
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

export { ROLE };
