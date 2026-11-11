import { motion } from 'framer-motion'
import { ArrowRight, Leaf, ShieldCheck, Truck, Gift, Star, Quote } from 'lucide-react'
import { products } from '../data.js'
import { why, reviews } from '../sections.js'
import ProductCard from './ProductCard.jsx'

const reveal = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' } }

// Заголовок блока: маленькая надпись сверху + большой заголовок + ссылка справа
function Head({ kick, title, action, onAction }) {
  return (
    <motion.div className="sec-head" {...reveal} transition={{ duration: 0.6 }}>
      <div>
        <p className="kick">{kick}</p>
        <h2>{title}</h2>
      </div>
      {action && <button className="link-btn" onClick={onAction}>{action} <ArrowRight size={16} /></button>}
    </motion.div>
  )
}

// Ряд товаров: «Хиты продаж» и «Новинки»
export function ProductRow({ id, ids, badge, kick, title, onAll, card }) {
  const list = ids.map(i => products.find(p => p.id === i)).filter(Boolean)
  return (
    <section id={id} className="sec wrap">
      <Head kick={card.t(kick)} title={card.t(title)} action={card.t('seeAll')} onAction={onAll} />
      <div className="row4">
        {list.map((p, i) => (
          <ProductCard key={p.id} p={p} badge={badge} delay={i * 0.08} {...card} wished={card.wish.includes(p.id)} />
        ))}
      </div>
    </section>
  )
}

const icons = { leaf: Leaf, shield: ShieldCheck, truck: Truck, gift: Gift }

// «Почему выбирают нас»
export function Why({ t, lang }) {
  return (
    <section id="why" className="why">
      <div className="wrap sec">
        <Head kick={t('whyKick')} title={t('whyTitle')} />
        <div className="why-grid">
          {why.map((w, i) => {
            const Icon = icons[w.icon]
            return (
              <motion.div key={w.icon} className="why-item" {...reveal} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <span className="why-ic"><Icon size={26} strokeWidth={1.5} /></span>
                <h3>{w.title[lang]}</h3>
                <p>{w.text[lang]}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// «Отзывы клиентов»
export function Reviews({ t, lang, onOpen }) {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  return (
    <section id="reviews" className="sec wrap">
      <Head kick={t('revKick')} title={t('revTitle')} />
      <motion.div className="rev-sum" {...reveal} transition={{ duration: 0.6 }}>
        <strong>{avg}</strong>
        <div>
          <div className="stars">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}</div>
          <span>{t('revAvg')} · 2 400+ {t('revCount')}</span>
        </div>
      </motion.div>
      <div className="rev-grid">
        {reviews.map((r, i) => {
          const p = products.find(x => x.id === r.pid)
          return (
            <motion.figure key={r.name.en} className="rev" {...reveal} transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}>
              <Quote size={28} className="rev-q" />
              <div className="stars">{[1, 2, 3, 4, 5].map(k => <Star key={k} size={14} fill={k <= r.rating ? 'currentColor' : 'none'} />)}</div>
              <blockquote>{r.text[lang]}</blockquote>
              <figcaption>
                <span className="rev-av">{r.name[lang][0]}</span>
                <span><strong>{r.name[lang]}</strong><small>{r.city[lang]}</small></span>
              </figcaption>
              {p && <button className="rev-p" onClick={() => onOpen(p)}>{t('revBought')} {p.name}</button>}
            </motion.figure>
          )
        })}
      </div>
    </section>
  )
}
