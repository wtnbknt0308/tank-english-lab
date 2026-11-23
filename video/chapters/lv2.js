// 文法 Lv2　日本語と英語の違い：なぜあなたは英語がわからなくなるのか
import { h, seg, ease, fadeIn, ROLE } from '../engine/parts.js';
import { titleScene, transformScene } from '../engine/scenes.js';

export const meta = { code: 'Lv2', title: '日本語と英語の違い　なぜあなたは英語がわからなくなるのか' };

const col = (role, text) => `<span style="color:${ROLE[role].color}">${text}</span>`;
const BOTH = ['full', 'digest'];

// ---- つかみ：疑問・否定は、日本語は「最後」、英語は「最初」でわかる ----
const hook = {
  id: 'hook', versions: BOTH, duration: 16,
  narration: [
    { t: 0, text: '日本語では、疑問文か否定文かは、文の<em>最後</em>でわかります。' },
    { t: 3.5, text: '「〜か」「〜ません」。最後まで聞かないと、わかりません。' },
    { t: 7, text: '英語はちがいます。疑問・否定の合図は、文の<em>前の方</em>に出てきます。' },
    { t: 11, text: '日本語のつもりで最後を待っていると、英語がわからなくなるのです。' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.innerHTML = '「疑問」「否定」は、どこでわかる？'; root.appendChild(head);
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
    const t1 = tag(330, '最後でわかる', 'var(--sub)');
    const t2 = tag(620, '最初でわかる', 'var(--x)');
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

// ---- 疑問文：一般動詞の後ろにかくれていた do が、先頭へスライドしてくる ----
const question = transformScene({
  id: 'question',
  heading: '疑問文にするには？<small>肯定文 → 疑問文</small>',
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
  T: { show: 0, peek: 3.5, insert: 8, alt: 10, note: 11, end: 19 },
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
  id: 'negative',
  heading: '否定文にするには？<small>肯定文 → 否定文</small>',
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
  T: { show: 0, peek: 3.5, insert: 7, alt: 9.5, note: 9.5, end: 18 },
  narration: [
    { t: 0, text: '今度は否定文。「私は毎日学校で英語を勉強します。」' },
    { t: 3.5, text: 'ここでも、<em>study</em> の後ろに <em>do</em> がかくれています。' },
    { t: 7, text: '否定文では、<em>do</em> が study の前に出てきて……' },
    { t: 9.5, text: '<em>not</em> とくっついて <em>don\'t</em>（do not）になります。「〜しない」の合図です。' },
    { t: 14, text: '<em>I don\'t study English at school every day.</em>　これも語順はそのまま！' },
  ],
});

// ---- 書きかえ練習（詳しい版のみ） ----
const p4 = transformScene({
  id: 'practice4', versions: ['full'], practice: '練習 1',
  heading: '疑問文にしよう<small>「あなたは毎日ピアノをひきます。」</small>',
  chunks: [
    { en: 'do', en2: 'Do', role: 'x' }, { en: 'You', en2: 'you', role: 's' }, { en: 'play', role: 'v' },
    { en: 'the piano', role: 'o' }, { en: 'every day.', en2: 'every day?', role: 'm' },
  ],
  baseOrder: [1, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], insert: 0, behind: 2, changeAlt: [0, 1, 4],
  peekNote: 'かくれている do', note: '質問の合図',
  T: { show: 0, peek: 1, insert: 3, alt: 5, note: 6, end: 11 },
  narration: [
    { t: 0, text: '練習1　この文を疑問文にしよう。' },
    { t: 1, text: '<em>play</em> の後ろの <em>do</em> は、どこへ出てくるかな？　止めて考えてもOK！' },
    { t: 11, text: '答え：<em>do</em> が先頭に出て <em>Do</em>、最後は「?」。' },
    { t: 14, text: '<em>Do you play the piano every day?</em>' },
  ],
});
const p5 = transformScene({
  id: 'practice5', versions: ['full'], practice: '練習 2',
  heading: '否定文にしよう<small>「私たちは夕食の後にテレビを見ます。」</small>',
  chunks: [
    { en: 'We', role: 's' }, { en: 'do', en2: "don't", role: 'x' }, { en: 'watch', role: 'v' },
    { en: 'TV', role: 'o' }, { en: 'after dinner.', role: 'm' },
  ],
  baseOrder: [0, 2, 3, 4], newOrder: [0, 1, 2, 3, 4], insert: 1, behind: 2, changeAlt: [1],
  peekNote: 'かくれている do', note: 'do + not = don\'t',
  T: { show: 0, peek: 1, insert: 3, alt: 5, note: 5, end: 11 },
  narration: [
    { t: 0, text: '練習2　この文を否定文にしよう。' },
    { t: 1, text: '<em>watch</em> の後ろの <em>do</em> は、どこへ出てくるかな？　止めて考えてもOK！' },
    { t: 11, text: '答え：<em>do</em> が主語と述部のあいだに出て、<em>not</em> とくっつく。' },
    { t: 14, text: '<em>We don\'t watch TV after dinner.</em>' },
  ],
});

// ---- まとめ ----
const summary = {
  id: 'summary', versions: BOTH, duration: { full: 14, digest: 10 },
  narration: [
    { t: 0, text: 'まとめ。英語の疑問・否定は、<em>文の前の方</em>でわかります。' },
    { t: 4, text: 'かくれていた do が前に出るだけ。後ろの語順はそのまま、と覚えておこう！' },
  ],
  setup(root) {
    const head = h('div', 'heading'); head.textContent = 'まとめ'; root.appendChild(head);
    const items = [
      `日本語は<b>最後</b>で、英語は<b>最初</b>で、疑問・否定がわかる`,
      `一般動詞の後ろには <b style="color:var(--x)">do</b> がかくれている`,
      `疑問文は <b style="color:var(--x)">Do</b> が先頭に、否定文は <b style="color:var(--x)">don't</b> が述部の前に`,
    ].map((html, i) => {
      const el = h('div', 'box');
      el.style.left = '210px'; el.style.width = '1500px'; el.style.top = 290 + i * 170 + 'px';
      el.style.padding = '30px 50px'; el.style.fontSize = '48px'; el.style.fontWeight = '700';
      el.innerHTML = `<span style="color:var(--accent);font-weight:900;margin-right:24px">${i + 1}</span>${html}`;
      root.appendChild(el);
      return el;
    });
    return { head, items };
  },
  render({ head, items }, t, ctx) {
    fadeIn(head, t, 0);
    const step = ctx.version === 'digest' ? 0.8 : 1.6;
    items.forEach((el, i) => fadeIn(el, t, 0.6 + i * step));
  },
};

export const scenes = [
  titleScene({
    kicker: '文法 Lv2', main: '日本語と英語の違い', sub: 'なぜあなたは英語がわからなくなるのか',
    narration: [{ t: 1, text: '文法レベル2。なぜあなたは英語がわからなくなるのか。カギは「合図」の位置です。' }],
  }),
  hook, question, negative, p4, p5, summary,
];
