export function gid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function sld(k, fb) {
  try {
    const r = localStorage.getItem(k);
    return Promise.resolve(r ? JSON.parse(r) : fb);
  } catch {
    return Promise.resolve(fb);
  }
}

export function ssv(k, d) {
  try {
    localStorage.setItem(k, JSON.stringify(d));
  } catch (e) {
    console.error(e);
  }
  return Promise.resolve();
}
