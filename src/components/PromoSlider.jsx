import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { promoSlides as slides } from '../sections.js'

const DELAY = 6000 // смена баннера каждые 6 секунд

// Большая рекламная карусель: один баннер за раз, автосмена, стрелки, точки, свайп
export default function PromoSlider({ t, lang, onPick }) {
  const [[i, dir], setState] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const s = slides[i]

  const go = useCallback(d => setState(([cur]) => [(cur + d + slides.length) % slides.length, d]), [])
  const goTo = n => setState(([cur]) => [n, n > cur ? 1 : -1])

  // автосмена (пауза при наведении мыши)
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => go(1), DELAY)
    return () => clearTimeout(id)
  }, [i, paused, go])

  const variants = {
    enter: d => ({ opacity: 0, x: d * 60 }),
    show: { opacity: 1, x: 0 },
    exit: d => ({ opacity: 0, x: d * -60 })
  }

  return (
    <section className="ps wrap" aria-roledescription="carousel" aria-label={t('promoLabel')}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onKeyDown={e => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}>
      <div className="ps-frame">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div key={i} className="ps-slide" custom={dir} variants={variants}
            initial="enter" animate="show" exit="exit" transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
            onDragEnd={(e, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1) }}
            role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`}>
            <div className="ps-text">
              <motion.span className="ps-tag" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>{s.tag[lang]}</motion.span>
              <motion.strong className="ps-big" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>
                {s.bigI18n?.[lang] ?? s.big}
              </motion.strong>
              <motion.h3 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>{s.title[lang]}</motion.h3>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>{s.text[lang]}</motion.p>
              <motion.button className="btn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onPick(s.cat)}>
                {s.btn[lang]} <ArrowRight size={16} />
              </motion.button>
            </div>
            <div className="ps-photo"><img src={s.img} alt="" style={s.pos ? { objectPosition: s.pos } : undefined} /></div>
          </motion.div>
        </AnimatePresence>

        <button className="ps-arrow prev" onClick={() => go(-1)} aria-label="←"><ChevronLeft size={22} /></button>
        <button className="ps-arrow next" onClick={() => go(1)} aria-label="→"><ChevronRight size={22} /></button>
      </div>

      <div className="ps-dots">
        {slides.map((_, n) => (
          <button key={n} className={n === i ? 'on' : ''} onClick={() => goTo(n)} aria-label={`${n + 1}`} aria-current={n === i}>
            {n === i && <span key={i + String(paused)} className={'ps-bar' + (paused ? ' paused' : '')} style={{ animationDuration: DELAY + 'ms' }} />}
          </button>
        ))}
      </div>
    </section>
  )
}
