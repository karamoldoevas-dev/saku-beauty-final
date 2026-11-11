import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Роза собирается из слоёв лепестков: n лепестков, масштаб s, поворот o
const layers = [
  { n: 7, s: 1.25, o: 0 }, { n: 6, s: 1.0, o: 20 }, { n: 5, s: 0.78, o: 12 },
  { n: 5, s: 0.55, o: 36 }, { n: 3, s: 0.32, o: 0 }
]
const PETAL = 'M0 0 C-34 -26 -42 -86 0 -112 C42 -86 34 -26 0 0Z'

// Фото для главного экрана на телефоне (на ПК и планшете — анимированная роза).
// Чтобы поменять фото, положите своё в public/photos и впишите путь сюда.
const HERO_PHONE_PHOTO = '/photos/hero-phone.jpg'

function Rose() {
  return (
    <svg viewBox="-160 -160 320 320" className="rose" role="img" aria-label="Rose">
      <defs>
        <linearGradient id="pa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbd3dd" /><stop offset="1" stopColor="#c4466c" /></linearGradient>
        <linearGradient id="pb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3a6ba" /><stop offset="1" stopColor="#8e1f3d" /></linearGradient>
        <filter id="ps" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#4a0b1f" floodOpacity=".35" /></filter>
      </defs>
      {layers.map((L, li) => (
        <motion.g key={li} filter="url(#ps)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + li * 0.3, duration: 1.2 }}>
          {Array.from({ length: L.n }, (_, i) => (
            <path key={i} d={PETAL} fill={li > 2 ? 'url(#pb)' : 'url(#pa)'} stroke="#8e1f3d" strokeOpacity=".25"
              transform={`rotate(${(360 / L.n) * i + L.o}) scale(${L.s})`} />
          ))}
        </motion.g>
      ))}
    </svg>
  )
}

export default function Hero({ t, onExplore, onStory }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 15 })
  const sy = useSpring(my, { stiffness: 60, damping: 15 })
  const x = useTransform(sx, v => v * 40)
  const y = useTransform(sy, v => v * 30)
  const rotateX = useTransform(sy, v => v * -14)
  const rotateY = useTransform(sx, v => v * 14)
  const [petals, setPetals] = useState([])

  // Мышь двигает розу (параллакс)
  const move = e => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  // Клик запускает падающие лепестки
  const burst = e => {
    if (e.target.closest('button, a')) return
    const r = ref.current.getBoundingClientRect()
    const id = Date.now()
    setPetals(p => [...p, ...Array.from({ length: 10 }, (_, i) => ({
      id: id + i, x: e.clientX - r.left, y: e.clientY - r.top,
      dx: (Math.random() - 0.5) * 220, rot: Math.random() * 540
    }))])
  }

  return (
    <section id="top" className="hero" ref={ref} onMouseMove={move} onClick={burst}>
      <div className="hero-photo" aria-hidden="true"><img src={HERO_PHONE_PHOTO} alt="" /></div>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="fp" style={{ left: `${(i * 11 + 5) % 100}%`, animationDuration: `${14 + (i % 4) * 4}s`, animationDelay: `${-i * 2.3}s` }} />
      ))}
      <div className="wrap hero-grid">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}>
          <p className="brand">SAKU BEAUTY</p>
          <h1>{t('h1')}</h1>
          <p className="sub">{t('sub')}</p>
          <div className="row">
            <motion.button className="btn" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onExplore}>{t('explore')}</motion.button>
            <motion.button className="btn ghost" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onStory}>{t('story')}</motion.button>
          </div>
        </motion.div>
        <motion.div className="rose-wrap" style={{ x, y, rotateX, rotateY, transformPerspective: 800 }}>
          <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: 'easeOut' }}>
              <Rose />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      {petals.map(p => (
        <motion.span key={p.id} className="cp" style={{ left: p.x, top: p.y }}
          initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 420, x: p.dx, opacity: 0, rotate: p.rot }}
          transition={{ duration: 2.4, ease: 'easeIn' }}
          onAnimationComplete={() => setPetals(a => a.filter(q => q.id !== p.id))} />
      ))}
    </section>
  )
}
