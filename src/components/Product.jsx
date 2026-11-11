import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Star, Heart, Minus, Plus, Check, Truck } from 'lucide-react'
import { products } from '../data.js'
import { details } from '../details.js'
import Art from './Art.jsx'

const tabs = [['desc', 'pdDesc'], ['ing', 'pdIng'], ['ben', 'pdBen'], ['use', 'pdUse']]

// Окно с подробной информацией о товаре
export default function Product({ p, lang, t, money, wished, onWish, onAdd, onClose, onPick }) {
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('desc')
  const info = details[p.id]
  const reviews = 38 + p.id * 17
  const more = products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3)

  // новый товар — сбрасываем количество и вкладку
  useEffect(() => { setQty(1); setTab('desc') }, [p.id])

  // закрытие по Esc и запрет прокрутки фона
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <>
      <motion.div className="scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div className="pd" role="dialog" aria-modal="true" aria-label={p.name}
        initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
        <button className="icon pd-x" onClick={onClose} aria-label={t('close')}><X size={22} /></button>

        <div className="pd-grid">
          <motion.div className="pd-art art" key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Art p={p} />
          </motion.div>

          <div className="pd-body">
            <div className="top"><small>{t(p.cat)}</small><small>SAKU BEAUTY</small></div>
            <h2>{p.name}</h2>
            <div className="stars" aria-label={String(p.rating)}>
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill={i <= Math.round(p.rating) ? 'currentColor' : 'none'} />)}
              <span>{p.rating} · {reviews} {t('pdReviews')}</span>
            </div>
            <p className="pd-price">{money(p.price)} <small>· {info.vol}</small></p>
            <p className="pd-lead">{p.d[lang]}</p>

            <div className="pd-tabs" role="tablist">
              {tabs.map(([k, label]) => (
                <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{t(label)}</button>
              ))}
            </div>
            <motion.div className="pd-panel" key={tab + lang} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {tab === 'desc' && <p>{info.long[lang]}</p>}
              {tab === 'ing' && <p>{info.ing[lang]}</p>}
              {tab === 'ben' && <ul className="pd-ben">{info.ben[lang].map(b => <li key={b}><Check size={16} />{b}</li>)}</ul>}
              {tab === 'use' && <p>{info.use[lang]}</p>}
            </motion.div>

            <div className="pd-buy">
              <div className="pd-qty" aria-label={t('pdQty')}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="−" disabled={qty === 1}><Minus size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(10, q + 1))} aria-label="+"><Plus size={16} /></button>
              </div>
              <motion.button className="btn pd-add" whileTap={{ scale: 0.96 }} onClick={() => onAdd(p.id, qty)}>
                {t('pdAddN')}<span className="pd-sum"> · {money(p.price * qty)}</span>
              </motion.button>
              <button className={'btn ghost pd-wish' + (wished ? ' on' : '')} onClick={onWish} aria-label={wished ? t('pdWishOn') : t('pdWishAdd')}>
                <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
              </button>
            </div>
            <p className="pd-note"><Check size={15} /> {t('pdStock')} <Truck size={15} /> {t('pdShip')}</p>
          </div>
        </div>

        {more.length > 0 && (
          <div className="pd-more">
            <h3>{t('pdMore')}</h3>
            <div className="pd-more-row">
              {more.map(x => (
                <button key={x.id} className="pd-mini" onClick={() => onPick(x)}>
                  <div className="art"><Art p={x} /></div>
                  <strong>{x.name}</strong>
                  <span>{money(x.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
