import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import Art from './Art.jsx'

// Карточка товара — используется в магазине, хитах и новинках
export default function ProductCard({ p, lang, t, money, wished, onWish, onAdd, onOpen, badge, delay = 0 }) {
  return (
    <motion.article className="card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }} whileHover={{ y: -6 }} transition={{ duration: 0.5, delay }}>
      <div className="art">
        <button className="open-pd" onClick={() => onOpen(p)} aria-label={t('pdOpen') + ': ' + p.name}><Art p={p} /></button>
        {badge && <span className={'card-badge ' + badge}>{t(badge === 'hit' ? 'tagHit' : 'new')}</span>}
        <button className={'heart' + (wished ? ' on' : '')} onClick={() => onWish(p.id)} aria-label={t('wish')}>
          <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="info">
        <div className="top"><small>{t(p.cat)}</small><small>SAKU BEAUTY</small></div>
        <h3><button className="name-btn" onClick={() => onOpen(p)}>{p.name}</button></h3>
        <p>{p.d[lang]}</p>
        <div className="stars" aria-label={String(p.rating)}>
          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= Math.round(p.rating) ? 'currentColor' : 'none'} />)}
          <span>{p.rating}</span>
        </div>
        <div className="buy">
          <strong>{money(p.price)}</strong>
          <motion.button className="btn sm" whileTap={{ scale: 0.94 }} onClick={() => onAdd(p.id)}>{t('add')}</motion.button>
        </div>
      </div>
    </motion.article>
  )
}
