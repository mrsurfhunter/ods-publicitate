export function calcAd(w, d) {
  let p = 50;
  if (w > 250) p = 75;
  if (w > 500) p = 100;
  if (w > 750) p = 125;
  if (w > 1000) p = 150;
  let disc = 0;
  if (d >= 4) disc = 0.10;
  if (d >= 8) disc = 0.15;
  if (d >= 15) disc = 0.20;
  if (d >= 30) disc = 0.25;
  const a = Math.round(p * (1 - disc));
  return { p, disc, a, total: a * d };
}
