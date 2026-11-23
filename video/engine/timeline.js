// シーンの並びと時刻を管理する。ブラウザとNodeの両方で使う。
export function sceneDuration(scene, version) {
  const d = scene.duration;
  return typeof d === 'object' ? d[version] : d;
}

export function buildTimeline(scenes, version) {
  const items = [];
  let t = 0;
  for (const scene of scenes) {
    if (!scene.versions.includes(version)) continue;
    const len = sceneDuration(scene, version);
    items.push({ scene, start: t, end: t + len });
    t += len;
  }
  return { items, duration: t, version };
}

export function sceneAt(tl, t) {
  const items = tl.items;
  for (const it of items) {
    if (t < it.end) return { scene: it.scene, local: Math.max(0, t - it.start), item: it };
  }
  const last = items[items.length - 1];
  return { scene: last.scene, local: last.end - last.start, item: last };
}
