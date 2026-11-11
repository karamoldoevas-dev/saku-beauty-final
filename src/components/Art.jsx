import { useState } from 'react'

// Иллюстрации товаров (SVG). Чтобы использовать фото, добавьте товару поле img.
const S = {
  dropper: (a, b) => <><rect x="70" y="110" width="60" height="100" rx="10" fill={a} /><rect x="92" y="86" width="16" height="26" fill={b} /><ellipse cx="100" cy="66" rx="14" ry="22" fill={b} /></>,
  jar: (a, b) => <><rect x="45" y="130" width="110" height="72" rx="12" fill={a} /><rect x="40" y="106" width="120" height="30" rx="8" fill={b} /></>,
  pump: (a, b) => <><rect x="66" y="100" width="68" height="108" rx="14" fill={a} /><rect x="92" y="76" width="16" height="26" fill={b} /><rect x="80" y="62" width="44" height="16" rx="6" fill={b} /><rect x="120" y="64" width="20" height="8" rx="3" fill={b} /></>,
  lipstick: (a, b) => <><rect x="76" y="140" width="48" height="68" rx="6" fill={b} /><rect x="82" y="86" width="36" height="58" rx="10" fill={a} /><rect x="78" y="136" width="44" height="10" fill="#d8b98a" /></>,
  palette: (a, b) => <><rect x="30" y="96" width="140" height="96" rx="14" fill={b} /><circle cx="66" cy="144" r="22" fill={a} /><circle cx="100" cy="144" r="22" fill={a} opacity=".75" /><circle cx="134" cy="144" r="22" fill={a} opacity=".5" /></>,
  tube: (a, b) => <><rect x="84" y="86" width="32" height="122" rx="8" fill={a} /><rect x="78" y="48" width="44" height="44" rx="8" fill={b} /></>,
  compact: (a, b) => <><circle cx="100" cy="142" r="60" fill={b} /><circle cx="100" cy="142" r="44" fill={a} /><ellipse cx="86" cy="126" rx="12" ry="7" fill="#fff" opacity=".35" /></>,
  perfume: (a, b) => <><rect x="56" y="112" width="88" height="96" rx="14" fill={a} /><rect x="86" y="82" width="28" height="32" fill={b} /><rect x="80" y="66" width="40" height="18" rx="4" fill={b} /></>,
  flask: (a, b) => <><rect x="68" y="92" width="64" height="116" rx="30" fill={a} /><rect x="88" y="62" width="24" height="34" rx="4" fill={b} /></>,
  spray: (a, b) => <><rect x="76" y="102" width="48" height="106" rx="10" fill={a} /><rect x="80" y="76" width="40" height="28" rx="6" fill={b} /><rect x="118" y="80" width="18" height="7" rx="3" fill={b} /></>,
  tin: (a, b) => <><rect x="36" y="150" width="128" height="52" rx="10" fill={a} /><rect x="32" y="128" width="136" height="26" rx="8" fill={b} /></>,
  bottle: (a, b) => <><circle cx="100" cy="150" r="56" fill={a} /><rect x="86" y="82" width="28" height="38" rx="6" fill={a} /><rect x="82" y="64" width="36" height="22" rx="5" fill={b} /></>
}

export default function Art({ p }) {
  const [bad, setBad] = useState(false)
  // pos — какую часть фото показывать в квадратной карточке (например '75% center')
  if (p.img && !bad) return <img src={p.img} alt={p.name} style={p.pos ? { objectPosition: p.pos } : undefined} onError={() => setBad(true)} />
  return (
    <svg viewBox="0 0 200 240" role="img" aria-label={p.name}>
      <ellipse cx="100" cy="214" rx="56" ry="7" fill="#000" opacity=".12" />
      {S[p.kind](p.c1, p.c2)}
    </svg>
  )
}
