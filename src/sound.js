// Нежные звуки сайта. Они создаются прямо в браузере (Web Audio API),
// поэтому отдельные аудиофайлы не нужны.

let ctx = null
let enabled = true
try { enabled = localStorage.getItem('saku-sound') !== 'off' } catch { /* private mode */ }

export const isSoundOn = () => enabled
export function setSound(on) {
  enabled = on
  try { localStorage.setItem('saku-sound', on ? 'on' : 'off') } catch { /* ignore */ }
}

// Одна нота: частота f (Гц), начало через t сек., длительность d сек., громкость v
function note(f, t = 0, d = 0.5, v = 0.18, type = 'sine') {
  const now = ctx.currentTime + t
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(f, now)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(v, now + 0.02)   // мягкое начало
  gain.gain.exponentialRampToValueAtTime(0.0001, now + d) // плавное затухание
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + d + 0.05)
}

const sounds = {
  // товар добавлен в корзину — лёгкий «дзинь» из двух нот
  add: () => { note(880, 0, 0.35, 0.14); note(1318.5, 0.08, 0.5, 0.12) },
  // клик по кнопке — короткий тихий щелчок
  tap: () => note(660, 0, 0.12, 0.06, 'triangle'),
  // оплата прошла — радостный аккорд вверх
  success: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, i * 0.12, 0.9, 0.13))
    note(1567.98, 0.5, 1.2, 0.07)
  },
  // оплата отклонена — две ноты вниз
  fail: () => { note(392, 0, 0.35, 0.14, 'triangle'); note(311.13, 0.22, 0.6, 0.14, 'triangle') }
}

export function play(name) {
  if (!enabled || !sounds[name]) return
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    sounds[name]()
  } catch { /* звук не поддерживается — просто молчим */ }
}
