import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Heart, ShoppingBag, Sun, Moon, LayoutGrid, Flower2, Palette, Droplets, Leaf, Volume2, VolumeX } from 'lucide-react'
import { play, isSoundOn, setSound } from './sound.js'
import { dict, products } from './data.js'
import { bestIds, newIds } from './sections.js'
import ProductCard from './components/ProductCard.jsx'
import { ProductRow, Why, Reviews } from './components/Sections.jsx'
import Hero from './components/Hero.jsx'
import Cart from './components/Cart.jsx'
import PromoSlider from './components/PromoSlider.jsx'
import Product from './components/Product.jsx'

const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* private mode */ } }
const cats = ['skincare', 'makeup', 'perfume', 'body']
const sideCats = ['all', 'perfume', 'makeup', 'skincare', 'body']
const icons = { all: LayoutGrid, perfume: Flower2, makeup: Palette, skincare: Droplets, body: Leaf }
const darkQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null
const systemPrefers = () => (darkQuery?.matches ? 'dark' : 'light')
const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function App() {
  const [lang, setLang] = useState(() => read('saku-lang', 'ru'))
  // Тема всегда берётся из настроек телефона или ПК (день/ночь).
  // Кнопка ☀/🌙 меняет тему только до перезагрузки или до смены режима на устройстве.
  const [themeChoice, setThemeChoice] = useState(null)
  const [systemTheme, setSystemTheme] = useState(systemPrefers)
  const theme = themeChoice || systemTheme
  const [cart, setCart] = useState(() => read('saku-cart', {}))
  const [wish, setWish] = useState(() => read('saku-wish', []))
  const [onlyWish, setOnlyWish] = useState(false)
  const [open, setOpen] = useState(false)
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [sent, setSent] = useState('')
  const [view, setView] = useState(null) // товар, открытый в окне
  const [soundOn, setSoundOn] = useState(isSoundOn)
  const closeView = useCallback(() => setView(null), [])

  const t = k => dict[lang][k] ?? dict.en[k] ?? k
  const money = n => n.toLocaleString('ru-RU') + ' ' + t('cur')

  useEffect(() => { save('saku-lang', lang); document.documentElement.lang = lang === 'kg' ? 'ky' : lang }, [lang])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#150b10' : '#fbf6ef')
  }, [theme])
  // Следим, если человек переключит день/ночь на телефоне, пока сайт открыт
  useEffect(() => {
    if (!darkQuery) return
    // устройство сменило режим — сайт сразу следует за ним (ручной выбор сбрасывается)
    const follow = next => setSystemTheme(prev => { if (prev !== next) setThemeChoice(null); return next })
    const onChange = e => follow(e.matches ? 'dark' : 'light')
    // запасной вариант: проверяем ещё раз, когда человек вернулся на вкладку (например, из настроек)
    const recheck = () => { if (!document.hidden) follow(systemPrefers()) }
    darkQuery.addEventListener('change', onChange)
    document.addEventListener('visibilitychange', recheck)
    window.addEventListener('focus', recheck)
    return () => {
      darkQuery.removeEventListener('change', onChange)
      document.removeEventListener('visibilitychange', recheck)
      window.removeEventListener('focus', recheck)
    }
  }, [])
  // Ручное переключение кнопкой ☀/🌙 (временно, не запоминается)
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setThemeChoice(next === systemTheme ? null : next)
  }
  useEffect(() => { try { localStorage.removeItem('saku-theme-choice'); localStorage.removeItem('saku-theme') } catch { /* ignore */ } }, [])
  useEffect(() => save('saku-cart', cart), [cart])
  useEffect(() => save('saku-wish', wish), [wish])
  useEffect(() => { const id = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(id) }, [])

  const flash = m => { setToast(m); setTimeout(() => setToast(''), 1600) }
  const add = (id, n = 1) => { setCart(c => ({ ...c, [id]: (c[id] || 0) + n })); flash(t('added')); play('add') }
  const toggleSound = () => { const on = !soundOn; setSound(on); setSoundOn(on); if (on) play('tap') }
  const changeQty = (id, d) => setCart(c => {
    const n = (c[id] || 0) + d
    const rest = { ...c }
    delete rest[id]
    return n > 0 ? { ...rest, [id]: n } : rest
  })
  const remove = id => setCart(c => { const rest = { ...c }; delete rest[id]; return rest })
  const toggleWish = id => setWish(w => (w.includes(id) ? w.filter(x => x !== id) : [...w, id]))

  // общие свойства для всех карточек товаров
  const card = { lang, t, money, wish, onWish: toggleWish, onAdd: id => add(id), onOpen: setView }
  const showCat = c => { setCat(c); setOnlyWish(false); go('shop') }

  const items = products.filter(p => cart[p.id]).map(p => ({ p, qty: cart[p.id] }))
  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.qty * i.p.price, 0)
  const needle = q.trim().toLowerCase()
  const list = products.filter(p =>
    (cat === 'all' || p.cat === cat) &&
    (!onlyWish || wish.includes(p.id)) &&
    (p.name + ' ' + p.d[lang]).toLowerCase().includes(needle))

  const subscribe = e => {
    e.preventDefault()
    const v = e.target.elements.email.value.trim()
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setSent('thanks'); e.target.reset() } else setSent('badEmail')
  }

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div className="splash" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <motion.span initial={{ opacity: 0, letterSpacing: '0.1em' }} animate={{ opacity: 1, letterSpacing: '0.38em' }} transition={{ duration: 1 }}>SAKU BEAUTY</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <header>
        <div className="wrap bar">
          <a className="logo" href="#top">SAKU BEAUTY</a>
          <nav className="links" aria-label="main">
            <a href="#top">{t('home')}</a>
            <a href="#shop">{t('shop')}</a>
            <a href="#collections">{t('collections')}</a>
            <a href="#story">{t('about')}</a>
            <a href="#contact">{t('contact')}</a>
          </nav>
          <div className="tools">
            <div className="langs" role="group" aria-label="Language">
              {['ru', 'kg', 'en'].map(l => (
                <button key={l} className={l === lang ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
            <AnimatePresence>
              {searching && (
                <motion.input className="sinput" autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={t('search')} aria-label={t('search')}
                  initial={{ width: 0, opacity: 0 }} animate={{ width: 150, opacity: 1 }} exit={{ width: 0, opacity: 0 }} />
              )}
            </AnimatePresence>
            <button className="icon" aria-label={t('search')} onClick={() => { setSearching(s => !s); if (searching) setQ(''); go('shop') }}><Search size={20} /></button>
            <button className="icon" aria-label={t('wish')} onClick={() => { setOnlyWish(w => !w); go('shop') }}>
              <Heart size={20} fill={onlyWish ? 'currentColor' : 'none'} />
              {wish.length > 0 && <span className="badge">{wish.length}</span>}
            </button>
            <button className="icon" aria-label={t(soundOn ? 'soundOff' : 'soundOn')} title={t(soundOn ? 'soundOff' : 'soundOn')} onClick={toggleSound}>
              {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button className="icon" aria-label={t('theme')} onClick={toggleTheme}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                  {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <motion.button className="icon" aria-label={t('cart')} onClick={() => setOpen(true)} key={count} initial={{ scale: 1.25 }} animate={{ scale: 1 }}>
              <ShoppingBag size={20} />
              {count > 0 && <span className="badge">{count}</span>}
            </motion.button>
          </div>
        </div>
      </header>

      <main>
        <Hero t={t} onExplore={() => go('shop')} onStory={() => go('story')} />
        <PromoSlider t={t} lang={lang} onPick={showCat} />

        <ProductRow id="best" ids={bestIds} badge="hit" kick="bestKick" title="bestTitle" onAll={() => showCat('all')} card={card} />

        <section id="shop" className="sec wrap">
          <h2>{t('shopTitle')}</h2>
          <div className="shop-layout">
          <aside className="side" aria-label={t('shopTitle')}>
            {sideCats.map(c => {
              const Icon = icons[c]
              return (
                <button key={c} className={c === cat ? 'on' : ''} onClick={() => setCat(c)}>
                  <Icon size={18} />
                  <span>{t(c)}</span>
                  <em>{products.filter(p => c === 'all' || p.cat === c).length}</em>
                </button>
              )
            })}
          </aside>
          <div className="shop-main">
          {list.length === 0 ? <p className="none">{t('none')}</p> : (
            <div className="grid">
              {list.map(p => (
                <ProductCard key={p.id} p={p} {...card} wished={wish.includes(p.id)}
                  badge={bestIds.includes(p.id) ? 'hit' : newIds.includes(p.id) ? 'new' : null} />
              ))}
            </div>
          )}
          </div>
          </div>
        </section>

        <ProductRow id="new" ids={newIds} badge="new" kick="newKick" title="newTitle" onAll={() => showCat('all')} card={card} />

        <section id="collections" className="sec wrap">
          <h2>{t('collTitle')}</h2>
          <div className="tiles">
            {cats.map(c => (
              <motion.button key={c} className="tile" whileHover={{ y: -6 }} onClick={() => showCat(c)}>
                <img className="tile-img" src={`/photos/coll-${c}.jpg`} alt="" loading="lazy" />
                <h3>{t(c)}</h3>
                <span>{products.filter(p => p.cat === c).length} {t('items')}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <section id="story" className="sec wrap story">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2>{t('storyTitle')}</h2>
            <p>{t('storyText')}</p>
          </motion.div>
        </section>

        <Why t={t} lang={lang} />
        <Reviews t={t} lang={lang} onOpen={setView} />
      </main>

      <footer id="contact">
        <div className="wrap foot">
          <div><h3>{t('contactTitle')}</h3><p>hello@saku-beauty.demo</p></div>
          <form onSubmit={subscribe} noValidate>
            <h3>{t('newsTitle')}</h3>
            <p>{t('newsText')}</p>
            <div className="nl">
              <input name="email" type="email" placeholder={t('email')} aria-label={t('email')} />
              <button className="btn sm">{t('subscribe')}</button>
            </div>
            {sent && <p role="status" className={sent === 'badEmail' ? 'err' : ''}>{t(sent)}</p>}
          </form>
        </div>
        <p className="rights">{t('rights')}</p>
      </footer>

      <Cart open={open} onClose={() => setOpen(false)} items={items} subtotal={subtotal} t={t} onQty={changeQty} onRemove={remove} onClear={() => setCart({})} />

      <AnimatePresence>
        {view && (
          <Product key="pd" p={view} lang={lang} t={t} money={money} wished={wish.includes(view.id)}
            onWish={() => toggleWish(view.id)} onAdd={(id, n) => add(id, n)} onClose={closeView} onPick={setView} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{toast}</motion.div>}
      </AnimatePresence>
    </>
  )
}
