// 描画の部品。すべて「時刻 → 見た目」の純粋な計算で、CSSトランジションは使わない。

export const STAGE_W = 1920;
export const STAGE_H = 1080;

export const clamp01 = (x) => Math.max(0, Math.min(1, x));
export const seg = (t, a, b) => clamp01((t - a) / (b - a));
export const ease = (x) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const easeOutBack = (x) => { x = clamp01(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
export const mix = (a, b, p) => a + (b - a) * p;
/** t が [a,b] の間で 0→1、[c,d] で 1→0 */
export const pulse = (t, a, b, c, d) => Math.min(seg(t, a, b), 1 - seg(t, c, d));

/** 並び順 order に従って左詰めし、全体を totalWidth の中央に寄せた各要素の左端 x を返す */
export function layoutPositions(widths, order, gap, totalWidth) {
  const total = order.reduce((s, i) => s + widths[i], 0) + gap * Math.max(0, order.length - 1);
  let x = (totalWidth - total) / 2;
  const xs = widths.map(() => null);
  for (const i of order) { xs[i] = x; x += widths[i] + gap; }
  return xs;
}

export const ROLE = {
  s: { name: '主語', color: '#2f6fdf' },
  v: { name: '述部', color: '#e0483e' },
  o: { name: '目的語', color: '#2e9e5b' },
  m: { name: '修飾語', color: '#7a8494' },
  x: { name: '', color: '#f29d12' }, // Do / don't などの「合図」
  c: { name: '補語', color: '#8e44ad' },
};

/** 'play[s]' の [ ] の中を印（.mk）にする。印は「同じ文字だ」と示すためのハイライト */
export function markup(str) {
  const esc = String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return esc.replace(/\[([^\]]+)\]/g, '<span class="mk">$1</span>');
}
export const plain = (str) => String(str ?? '').replace(/[\[\]]/g, '');

export function h(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/**
 * 文節カードの列。chunk = { jp:'私', p:'は', en:'I', role:'s' }
 * mode: 'jp'（助詞つき） | 'jpNoP'（助詞なし） | 'en'
 */
export class ChunkRow {
  constructor(parent, chunks, { y = 420, gap = 28, fontSize = 60 } = {}) {
    this.chunks = chunks;
    this.gap = gap;
    this.y = y;
    this.cards = chunks.map((c) => {
      const card = h('div', 'card');
      card.style.fontSize = fontSize + 'px';
      card.style.setProperty('--role', ROLE[c.role].color);
      const fill = h('div', 'card-fill');
      const jp = h('div', 'card-jp');
      const body = h('span', 'jp-body', c.jp);
      const part = h('span', 'jp-p', c.p || '');
      jp.append(body, part);
      const en = h('div', 'card-en'); const es = h('span'); es.innerHTML = markup(c.en); en.appendChild(es);
      const en2 = h('div', 'card-en'); const es2 = h('span'); es2.innerHTML = markup(c.en2 ?? c.en); en2.appendChild(es2);
      const label = h('div', 'card-label', c.label ?? ROLE[c.role].name);
      card.append(fill, jp, en, en2, label);
      parent.appendChild(card);
      return { card, fill, jp, body, part, en, en2, label, marks: [...card.querySelectorAll('.mk')] };
    });
    this.measure();
  }

  measure() {
    const pad = 64;
    this.pad = pad;
    this.w = { jp: [], jpNoP: [], en: [], en2: [] };
    this.cards.forEach((k) => {
      const bw = k.body.getBoundingClientRect().width;
      const pw = k.part.getBoundingClientRect().width;
      const ew = k.en.firstChild.getBoundingClientRect().width;
      this.w.jp.push(Math.ceil(bw + pw + pad));
      this.w.jpNoP.push(Math.ceil(bw + pad));
      k.pw = pw;
      this.w.en.push(Math.ceil(ew + pad));
      this.w.en2.push(Math.ceil(k.en2.firstChild.getBoundingClientRect().width + pad));
    });
  }

  positions(order, mode, gap = this.gap) {
    return layoutPositions(this.w[mode], order, gap, STAGE_W);
  }

  /**
   * 1枚のカードの見た目を決める。
   * x,y,w: 位置と幅 / opacity / colored: 役割色の濃さ 0..1 / lang: 0=日本語 1=英語
   * particle: 助詞の見え方 0..1 / glow: 助詞を光らせる 0..1 / label: 役割名 0..1 / scale
   * frame: カードの枠と白地 0..1（0 だと普通の文字に見える） / alt: en → en2 の切り替え 0..1
   */
  set(i, { x, y = this.y, w, opacity = 1, colored = 0, lang = 0, particle = 1, glow = 0, label = 0, scale = 1, lift = 0, frame = 1, alt = 0, mark = 0 }) {
    const k = this.cards[i];
    const s = k.card.style;
    s.transform = `translate(${x}px, ${y - lift}px) scale(${scale})`;
    s.width = w + 'px';
    s.opacity = opacity;
    k.fill.style.opacity = colored;
    k.card.style.color = colored > 0.5 ? '#fff' : '#1d2433';
    s.borderColor = `rgba(29,36,51,${frame})`;
    s.backgroundColor = `rgba(255,255,255,${frame})`;
    s.boxShadow = `0 10px 0 rgba(29,36,51,${0.15 * frame})`;
    k.jp.style.opacity = 1 - lang;
    k.en.style.opacity = lang * (1 - alt);
    k.en2.style.opacity = lang * alt;
    k.jp.style.transform = `translateY(${-lang * 30}px)`;
    k.en.style.transform = k.en2.style.transform = `translateY(${(1 - lang) * 30}px)`;
    k.part.style.opacity = particle;
    k.part.style.maxWidth = particle >= 1 ? '' : (k.pw * particle) + 'px';
    k.part.style.background = `rgba(255, 214, 10, ${0.95 * glow})`;
    k.part.style.boxShadow = glow > 0 ? `0 0 ${30 * glow}px rgba(255,214,10,${glow})` : 'none';
    k.part.style.color = glow > 0.5 ? '#1d2433' : '';
    k.label.style.opacity = label;
    // 印：白い地に黒い文字＋黄色の縁。どのカードの上でも同じ見た目になる
    for (const m of k.marks) {
      m.style.background = `rgba(255,255,255,${mark})`;
      m.style.color = mark > 0.5 ? '#1d2433' : '';
      m.style.boxShadow = mark > 0 ? `0 0 0 ${4 * mark}px rgba(255,214,10,${mark})` : 'none';
    }
  }
}

/** 位置の補間をまとめて行う：from/to は {xs, mode} */
export function mixLayouts(row, A, B, p) {
  return row.chunks.map((_, i) => {
    const ax = A.xs[i], bx = B.xs[i];
    const aw = (A.ws ?? row.w[A.mode])[i], bw = (B.ws ?? row.w[B.mode])[i];
    return { x: mix(ax ?? bx, bx ?? ax, p), w: mix(aw, bw, p) };
  });
}

/** 円形カウントダウン。total 秒から数える */
export class Countdown {
  constructor(parent, total, { x = 1660, y = 140, size = 190 } = {}) {
    this.total = total;
    const el = h('div', 'countdown');
    el.style.left = x - size / 2 + 'px';
    el.style.top = y - size / 2 + 'px';
    el.style.width = el.style.height = size + 'px';
    el.innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="cd-bg"/><circle cx="50" cy="50" r="44" class="cd-fg" pathLength="100"/></svg><div class="cd-num"></div><div class="cd-cap">考えよう</div>`;
    parent.appendChild(el);
    this.el = el;
    this.fg = el.querySelector('.cd-fg');
    this.num = el.querySelector('.cd-num');
  }
  set(elapsed, opacity = 1) {
    const left = Math.max(0, this.total - elapsed);
    this.num.textContent = Math.ceil(left - 1e-6) || '';
    this.fg.style.strokeDashoffset = 100 * (1 - left / this.total);
    this.el.style.opacity = opacity;
  }
}

export function fadeIn(el, t, a, d = 0.5, dy = 24) {
  const p = ease(seg(t, a, a + d));
  el.style.opacity = p;
  el.style.transform = `translateY(${(1 - p) * dy}px)`;
  return p;
}
