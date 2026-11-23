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

/** 文の上に出す日本語（練習問題など） */
function promptLine(root, text, top = 230, size = 64) {
  const el = h('div', 'sentence');
  el.style.top = top + 'px';
  el.style.fontSize = size + 'px';
  el.innerHTML = text;
  root.appendChild(el);
  return el;
}



/**
 * 日本語 → 英語の語順に並べ替える実演。
 * chunks: [{jp,p,en,role}], jpOrder / enOrder: 並び順（chunks の番号）
 * T: 各段階の開始時刻（秒）
 *   split 文節に分ける / glow 助詞を光らせる / color 役割の色 / reorder 並べ替え
 *   drop 助詞を消す / flip 英語に変える / done 完成した英文 / end 場面の長さ
 */
export function reorderStory({ id, versions = BOTH, chunks, jpOrder, enOrder, sentence, T, narration, heading }) {
  return {
    id, versions, duration: T.end, narration,
    setup(root) {
      const head = heading ? h('div', 'heading') : null;
      if (head) { head.innerHTML = heading; root.appendChild(head); }
      const row = new ChunkRow(root, chunks, { y: 380 });
      const ans = h('div', 'sentence');
      ans.style.top = '700px'; ans.style.fontSize = '76px';
      ans.innerHTML = sentence;
      const ok = h('div', 'mark ok', '✓');
      ok.style.left = '1640px'; ok.style.top = '640px';
      root.append(ans, ok);
      return { row, ans, ok, head };
    },
    render({ row, ans, ok, head }, t) {
      if (head) fadeIn(head, t, 0, 0.5);
      const pSplit = ease(seg(t, T.split, T.split + 1.2));
      const pReorder = ease(seg(t, T.reorder, T.reorder + 2.4));
      const pDrop = ease(seg(t, T.drop, T.drop + 1.2));
      // 分ける前はカードの余白なし・すき間なしで、ふつうの1文に見せる
      const wA = row.w.jp.map((w) => w - row.pad * (1 - pSplit));
      const A = { xs: layoutPositions(wA, jpOrder, mix(0, row.gap, pSplit), STAGE_W), ws: wA, mode: 'jp' };
      const B = { xs: row.positions(enOrder, 'jp'), mode: 'jp' };
      const C = { xs: row.positions(enOrder, 'jpNoP'), mode: 'jpNoP' };
      const D = { xs: row.positions(enOrder, 'en'), mode: 'en' };
      const ab = mixLayouts(row, A, B, pReorder);
      const bc = mixLayouts(row, { xs: ab.map((l) => l.x), ws: ab.map((l) => l.w) }, C, pDrop);
      chunks.forEach((c, i) => {
        // 英語へは少しずつずらして切り替える
        const rank = enOrder.indexOf(i);
        const pFlip = ease(seg(t, T.flip + rank * 0.35, T.flip + rank * 0.35 + 0.8));
        const l = mixLayouts(row, { xs: bc.map((v) => v.x), ws: bc.map((v) => v.w) }, D, pFlip)[i];
        // 並べ替えのとき、カードを持ち上げて動かす（動く距離が大きいほど高く）
        // 右へ動くカードは上を、左へ動くカードは下を通る（すれ違いで重ならない）
        const dx = (B.xs[i] ?? 0) - (A.xs[i] ?? 0);
        const lift = Math.sin(Math.PI * pReorder) * (Math.abs(dx) < 5 ? 0 : Math.min(170, 70 + Math.abs(dx) * 0.2)) * Math.sign(dx);
        const hasP = !!c.p;
        const glow = hasP ? Math.min(seg(t, T.glow + 0.3 * jpOrder.indexOf(i), T.glow + 0.3 * jpOrder.indexOf(i) + 0.4), 1 - seg(t, T.color + 2, T.color + 3)) : 0;
        row.set(i, {
          x: l.x, w: l.w,
          frame: pSplit,
          lift,
          glow,
          colored: ease(seg(t, T.color + 0.25 * jpOrder.indexOf(i), T.color + 0.25 * jpOrder.indexOf(i) + 0.6)),
          label: ease(seg(t, T.color + 0.25 * jpOrder.indexOf(i), T.color + 0.25 * jpOrder.indexOf(i) + 0.6)),
          particle: 1 - pDrop,
          lang: pFlip,
          scale: 1 + 0.08 * Math.sin(Math.PI * seg(t, T.flip + rank * 0.35, T.flip + rank * 0.35 + 0.8)),
        });
      });
      fadeIn(ans, t, T.done, 0.6);
      const pOk = easeOutBack(seg(t, T.done + 0.6, T.done + 1.1));
      ok.style.opacity = seg(t, T.done + 0.6, T.done + 0.8);
      ok.style.transform = `scale(${pOk})`;
    },
  };
}

/**
 * 練習問題：日本語を見て、英語のカードを並べる。
 * shuffled: 最初に見せる並び（chunks の番号）、enOrder: 正解
 */
export function practiceReorder({ id, versions = ['full'], no, jp, chunks, shuffled, enOrder, sentence, think = 8 }) {
  const T0 = 2.5, T1 = T0 + think, end = T1 + 6.5;
  return {
    id, versions, duration: end,
    narration: [
      { t: 0, text: `練習${no}　日本語に合うように、英語のカードを並べかえよう。` },
      { t: T0, text: '動画を止めて考えてもOK！　ノートに書いてみよう。' },
      { t: T1, text: '答え合わせ。主語 → 述部 → 目的語 → 修飾語 の順番だね。' },
      { t: T1 + 3.2, text: sentence.replace(/<[^>]+>/g, '') },
    ],
    setup(root, ctx) {
      const badge = h('div', 'badge', `練習 ${no}`);
      badge.style.left = '64px'; badge.style.top = '110px'; badge.style.background = 'var(--accent)';
      const q = promptLine(root, jp, 200, 66);
      const row = new ChunkRow(root, chunks, { y: 430 });
      const cd = new Countdown(root, think);
      const ans = h('div', 'sentence'); ans.style.top = '720px'; ans.style.fontSize = '72px'; ans.innerHTML = sentence;
      const ok = h('div', 'mark ok', '✓'); ok.style.left = '1640px'; ok.style.top = '660px';
      root.append(badge, ans, ok);
      return { badge, q, row, cd, ans, ok };
    },
    render({ badge, q, row, cd, ans, ok }, t) {
      fadeIn(badge, t, 0, 0.4);
      fadeIn(q, t, 0.2, 0.6);
      const A = { xs: row.positions(shuffled, 'en'), mode: 'en' };
      const B = { xs: row.positions(enOrder, 'en'), mode: 'en' };
      const p = ease(seg(t, T1, T1 + 2));
      const L = mixLayouts(row, A, B, p);
      chunks.forEach((c, i) => {
        const appear = easeOutBack(seg(t, 0.8 + i * 0.15, 1.3 + i * 0.15));
        const dx = B.xs[i] - A.xs[i];
        row.set(i, {
          x: L[i].x, w: L[i].w, lang: 1, opacity: seg(t, 0.8 + i * 0.15, 1.1 + i * 0.15), scale: appear,
          lift: Math.sin(Math.PI * p) * (Math.abs(dx) < 5 ? 0 : Math.min(150, 60 + Math.abs(dx) * 0.2)) * Math.sign(dx),
          colored: ease(seg(t, T1 + 1.6, T1 + 2.4)), label: ease(seg(t, T1 + 1.6, T1 + 2.4)),
        });
      });
      cd.set(t - T0, Math.min(seg(t, T0 - 0.4, T0), 1 - seg(t, T1, T1 + 0.5)));
      fadeIn(ans, t, T1 + 3, 0.6);
      ok.style.opacity = seg(t, T1 + 3.4, T1 + 3.6);
      ok.style.transform = `scale(${easeOutBack(seg(t, T1 + 3.4, T1 + 3.9))})`;
    },
  };
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
