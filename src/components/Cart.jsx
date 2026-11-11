import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle2, XCircle, Loader2, Landmark, CreditCard } from 'lucide-react'
import Art from './Art.jsx'
import { banks } from '../data.js'
import { play } from '../sound.js'

const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } }
const FREE_FROM = 8000 // бесплатная доставка от 8000 сом
const SHIP = 300
const blank = { name: '', email: '', phone: '', address: '', method: 'courier', comment: '' }

export default function Cart({ open, onClose, items, subtotal, t, onQty, onRemove, onClear }) {
  const [step, setStep] = useState('cart') // cart | info | pay | wait | ok | fail | orders
  const [f, setF] = useState(blank)
  const [errs, setErrs] = useState({})
  const [pm, setPm] = useState('mbank')
  const [card, setCard] = useState('4242 4242 4242 4242')
  const [cardErr, setCardErr] = useState('')
  const [orders, setOrders] = useState(() => read('saku-orders-kgs', []))
  const [last, setLast] = useState(null)

  useEffect(() => { if (open) setStep('cart') }, [open])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])

  const ship = f.method === 'pickup' || subtotal === 0 || subtotal >= FREE_FROM ? 0 : SHIP
  const total = subtotal + ship
  const money = n => n.toLocaleString('ru-RU') + ' ' + t('cur')
  const pmName = id => (id === 'card' ? t('cardDemo') : banks.find(b => b.id === id)?.name)
  const titles = { cart: t('cart'), info: t('infoTitle'), pay: t('payTitle'), wait: t('payTitle'), ok: t('payTitle'), fail: t('payTitle'), orders: t('ordersTitle') }

  // Проверка данных покупателя
  const toPay = () => {
    const e = {}
    if (f.name.trim().length < 2) e.name = 'required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'badEmail'
    if (!/^\+?[\d\s()-]{9,16}$/.test(f.phone.trim())) e.phone = 'badPhone'
    if (f.method === 'courier' && f.address.trim().length < 5) e.address = 'required'
    setErrs(e)
    if (!Object.keys(e).length) setStep('pay')
  }

  // Демо-оплата: никаких настоящих платежей, всё имитируется
  const pay = () => {
    const digits = card.replace(/\s/g, '')
    if (pm === 'card' && !/^\d{16}$/.test(digits)) { setCardErr('badCard'); return }
    setCardErr('')
    setStep('wait')
    setTimeout(() => {
      const ok = !(pm === 'card' && digits === '4000000000000002')
      const order = {
        no: 'SAKU-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleString(), total, method: pm, ok,
        items: items.map(i => i.p.name + ' × ' + i.qty)
      }
      setLast(order)
      if (ok) {
        const list = [order, ...orders]
        setOrders(list)
        save('saku-orders-kgs', list)
        onClear()
      }
      setStep(ok ? 'ok' : 'fail')
      play(ok ? 'success' : 'fail')
    }, 2200)
  }

  const field = (k, label, type = 'text') => (
    <label className="fld">{label}
      <input type={type} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errs[k]} />
      {errs[k] && <small className="err">{t(errs[k])}</small>}
    </label>
  )

  const summary = btn => (
    <aside className="summary">
      <h3>{t('total')}</h3>
      {step !== 'cart' && items.map(i => <div className="sum" key={i.p.id}><span>{i.p.name} × {i.qty}</span><span>{money(i.p.price * i.qty)}</span></div>)}
      <div className="sum"><span>{t('subtotal')}</span><strong>{money(subtotal)}</strong></div>
      <div className="sum"><span>{t('delivery')}</span><strong>{ship ? money(ship) : t('free')}</strong></div>
      <div className="sum total"><span>{t('total')}</span><strong>{money(total)}</strong></div>
      {btn}
    </aside>
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="full" role="dialog" aria-modal="true" aria-label={t('cart')}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.35 }}>
          <div className="wrap full-in">
            <div className="drawer-head">
              <h2>{titles[step]}</h2>
              <div className="row-btns">
                <button className="btn ghost sm" onClick={() => setStep('orders')}>{t('ordersTitle')}</button>
                <button className="icon" onClick={onClose} aria-label={t('close')}><X size={22} /></button>
              </div>
            </div>
            {['pay', 'wait', 'ok', 'fail'].includes(step) && <p className="demo-banner">{t('demoLabel')} — {t('demoNote')}</p>}

            {step === 'cart' && (items.length === 0 ? (
              <div className="empty"><ShoppingBag size={52} strokeWidth={1.2} /><h3>{t('empty')}</h3><p>{t('emptyHint')}</p></div>
            ) : (
              <div className="full-grid">
                <ul className="lines">
                  <AnimatePresence initial={false}>
                    {items.map(({ p, qty }) => (
                      <motion.li key={p.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}>
                        <div className="thumb"><Art p={p} /></div>
                        <div className="meta">
                          <strong>{p.name}</strong><span>{money(p.price)}</span>
                          <div className="qty">
                            <button onClick={() => onQty(p.id, -1)} aria-label="-"><Minus size={14} /></button>
                            <span>{qty}</span>
                            <button onClick={() => onQty(p.id, 1)} aria-label="+"><Plus size={14} /></button>
                          </div>
                        </div>
                        <button className="icon" onClick={() => onRemove(p.id)} aria-label={t('remove')}><Trash2 size={18} /></button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                {summary(<button className="btn" onClick={() => setStep('info')}>{t('checkout')}</button>)}
              </div>
            ))}

            {step === 'info' && (
              <div className="full-grid">
                <div>
                  {field('name', t('name'))}
                  {field('email', t('email'), 'email')}
                  {field('phone', t('phone'), 'tel')}
                  <div className="fld">{t('method')}
                    <div className="chips">
                      {['courier', 'pickup'].map(m => <button type="button" key={m} className={f.method === m ? 'on' : ''} onClick={() => setF({ ...f, method: m })}>{t(m)}</button>)}
                    </div>
                  </div>
                  {f.method === 'courier' && field('address', t('address'))}
                  <label className="fld">{t('comment')}<textarea rows={3} value={f.comment} onChange={e => setF({ ...f, comment: e.target.value })} /></label>
                  <div className="row"><button className="btn ghost" onClick={() => setStep('cart')}>{t('back')}</button><button className="btn" onClick={toPay}>{t('toPay')}</button></div>
                </div>
                {summary(null)}
              </div>
            )}

            {step === 'pay' && (
              <div className="full-grid">
                <div>
                  <h3 className="sub-h">{t('payHow')}</h3>
                  <div className="pms">
                    {[...banks, { id: 'card' }].map(b => (
                      <button key={b.id} className={'pm' + (pm === b.id ? ' on' : '')} onClick={() => setPm(b.id)}>
                        {b.logo ? <img src={b.logo} alt="" /> : <span className="logo-ph">{b.id === 'card' ? <CreditCard size={22} /> : <Landmark size={22} />}</span>}
                        <strong>{pmName(b.id)}</strong>
                      </button>
                    ))}
                  </div>
                  {pm === 'card' ? (
                    <label className="fld">{t('cardNum')}
                      <input inputMode="numeric" maxLength={19} value={card} onChange={e => setCard(e.target.value)} />
                      {cardErr && <small className="err">{t(cardErr)}</small>}
                      <small>{t('cardHint')}</small>
                    </label>
                  ) : <p className="hint">{t('bankHint')}</p>}
                  <div className="row"><button className="btn ghost" onClick={() => setStep('info')}>{t('back')}</button><button className="btn" onClick={pay}>{t('pay')} {money(total)}</button></div>
                </div>
                {summary(null)}
              </div>
            )}

            {step === 'wait' && (
              <div className="center">
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={48} /></motion.span>
                <h3>{t('processing')}</h3>
              </div>
            )}

            {step === 'ok' && last && (
              <div className="center">
                <CheckCircle2 size={64} color="#3a9d6a" />
                <h3>{t('okTitle')}</h3>
                <p>{t('orderNo')}: <strong>{last.no}</strong> ({t('demoLabel')})</p>
                <p>{pmName(last.method)} — {money(last.total)}</p>
                <div className="row"><button className="btn" onClick={onClose}>{t('continue')}</button><button className="btn ghost" onClick={() => setStep('orders')}>{t('ordersTitle')}</button></div>
              </div>
            )}

            {step === 'fail' && (
              <div className="center">
                <XCircle size={64} color="#c0392b" />
                <h3>{t('failTitle')}</h3>
                <p>{t('failText')}</p>
                <button className="btn" onClick={() => setStep('pay')}>{t('again')}</button>
              </div>
            )}

            {step === 'orders' && (
              <div className="orders">
                {orders.length === 0 && <p className="hint">{t('noOrders')}</p>}
                {orders.map(o => (
                  <div className="order" key={o.no}>
                    <div className="sum"><strong>{o.no} ({t('demoLabel')})</strong><span>{o.date}</span></div>
                    <p>{o.items.join(', ')}</p>
                    <div className="sum"><span>{pmName(o.method)} — {t('paidDemo')}</span><strong>{money(o.total)}</strong></div>
                  </div>
                ))}
                <div><button className="btn ghost" onClick={() => setStep('cart')}>{t('back')}</button></div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
