// Данные для блоков «Акции», «Хиты», «Новинки», «Почему мы», «Отзывы»

// Большая рекламная карусель. img — фото справа (лучше горизонтальное), cat — какую категорию открыть по кнопке
export const promoSlides = [
  {
    img: '/photos/promo-perfume.webp', cat: 'perfume', big: '−20%',
    tag: { ru: 'Скидка недели', kg: 'Жуманын арзандатуусу', en: 'Deal of the week' },
    title: { ru: 'на всю парфюмерию', kg: 'бардык атырларга', en: 'on all fragrances' },
    text: { ru: 'Найдите свой аромат: роза, пион, амбра и ваниль. Только до воскресенья.', kg: 'Өз жытыңызды табыңыз: роза, пион, амбра жана ванил. Жекшембиге чейин гана.', en: 'Find your scent: rose, peony, amber and vanilla. Until Sunday only.' },
    btn: { ru: 'Выбрать аромат', kg: 'Жыт тандоо', en: 'Choose a scent' }
  },
  {
    img: '/photos/promo-makeup.jpg', pos: 'center 30%', cat: 'makeup', big: 'NEW',
    tag: { ru: 'Новая коллекция', kg: 'Жаңы коллекция', en: 'New collection' },
    title: { ru: 'Макияж в тёплых оттенках', kg: 'Жылуу түстөрдөгү макияж', en: 'Makeup in warm shades' },
    text: { ru: 'Румяна, помады и тушь нового сезона уже в каталоге.', kg: 'Жаңы сезондун румяналары, помадалары жана туштары каталогдо.', en: 'This season’s blush, lipsticks and mascara are in the catalogue.' },
    btn: { ru: 'Смотреть новинки', kg: 'Жаңыларды көрүү', en: 'See what’s new' }
  },
  {
    img: '/photos/promo-gift.jpg', cat: 'all', big: 'GIFT',
    tag: { ru: 'Подарок', kg: 'Белек', en: 'Gift' },
    title: { ru: 'Подарочная упаковка бесплатно', kg: 'Белек таңгагы акысыз', en: 'Free gift wrapping' },
    text: { ru: 'Красиво упакуем любой заказ от 5 000 сом и добавим открытку.', kg: '5 000 сомдон ашкан ар бир буйрутманы кооз таңгактап, открытка кошобуз.', en: 'We wrap any order over 5,000 KGS and add a greeting card.' },
    btn: { ru: 'Выбрать подарок', kg: 'Белек тандоо', en: 'Choose a gift' }
  },
  {
    img: '/photos/promo-box.jpg', cat: 'skincare', big: '0 сом',
    bigI18n: { kg: '0 сом', en: '0 KGS' },
    tag: { ru: 'Доставка', kg: 'Жеткирүү', en: 'Delivery' },
    title: { ru: 'Бесплатная доставка', kg: 'Акысыз жеткирүү', en: 'Free delivery' },
    text: { ru: 'По всему Кыргызстану при заказе от 8 000 сом. По Бишкеку — за 1 день.', kg: '8 000 сомдон ашкан буйрутмага бүт Кыргызстан боюнча. Бишкек боюнча — 1 күндө.', en: 'Across Kyrgyzstan on orders over 8,000 KGS. Bishkek in 1 day.' },
    btn: { ru: 'За покупками', kg: 'Сатып алууга', en: 'Start shopping' }
  }
]

export const bestIds = [1, 8, 4, 2]      // хиты продаж
export const newIds = [9, 7, 10, 5]      // новинки

// Почему выбирают нас (иконки задаются в Sections.jsx)
export const why = [
  {
    icon: 'leaf',
    title: { ru: 'Чистый состав', kg: 'Таза курам', en: 'Clean formulas' },
    text: {
      ru: 'Без парабенов и сульфатов. Только бережные ингредиенты, которые любит кожа.',
      kg: 'Парабен жана сульфат жок. Тери жакшы көргөн аяр ингредиенттер гана.',
      en: 'No parabens or sulfates. Only gentle ingredients your skin loves.'
    }
  },
  {
    icon: 'shield',
    title: { ru: 'Проверено дерматологами', kg: 'Дерматологдор текшерген', en: 'Dermatologist tested' },
    text: {
      ru: 'Каждый продукт проходит тесты на безопасность и подходит для чувствительной кожи.',
      kg: 'Ар бир продукт коопсуздук тестинен өтөт жана сезгич териге ылайыктуу.',
      en: 'Every product is safety tested and suitable for sensitive skin.'
    }
  },
  {
    icon: 'truck',
    title: { ru: 'Быстрая доставка', kg: 'Тез жеткирүү', en: 'Fast delivery' },
    text: {
      ru: 'По Бишкеку за 1 день, по Кыргызстану за 2–4 дня. Бесплатно от 8 000 сом.',
      kg: 'Бишкек боюнча 1 күндө, Кыргызстан боюнча 2–4 күндө. 8 000 сомдон акысыз.',
      en: 'Bishkek in 1 day, across Kyrgyzstan in 2–4 days. Free from 8,000 KGS.'
    }
  },
  {
    icon: 'gift',
    title: { ru: 'Подарочная упаковка', kg: 'Белек таңгагы', en: 'Gift wrapping' },
    text: {
      ru: 'Красиво упакуем любой заказ и добавим открытку с вашими пожеланиями.',
      kg: 'Каалаган буйрутманы кооз таңгактап, каалоолоруңуз жазылган открытка кошобуз.',
      en: 'We beautifully wrap any order and add a card with your message.'
    }
  }
]

// Отзывы клиентов (учебные)
export const reviews = [
  {
    name: { ru: 'Айжан', kg: 'Айжан', en: 'Aijan' }, city: { ru: 'Бишкек', kg: 'Бишкек', en: 'Bishkek' }, rating: 5, pid: 1,
    text: {
      ru: 'Сыворотка просто волшебная! Через две недели кожа стала заметно ровнее и светится. Уже заказала вторую.',
      kg: 'Сыворотка жөн эле сыйкырдуу! Эки жумадан кийин терим бир топ тегиз болуп, жаркырап калды. Экинчисин да буйрутма кылдым.',
      en: 'The serum is pure magic! After two weeks my skin is visibly more even and glowing. Already ordered a second one.'
    }
  },
  {
    name: { ru: 'Мээрим', kg: 'Мээрим', en: 'Meerim' }, city: { ru: 'Ош', kg: 'Ош', en: 'Osh' }, rating: 5, pid: 8,
    text: {
      ru: 'Eau de Saku No.1 теперь мой любимый аромат. Нежный, но стойкий, весь день получаю комплименты.',
      kg: 'Eau de Saku No.1 азыр менин эң сүйүктүү жытым. Назик, бирок туруктуу, күн бою мактоо угам.',
      en: 'Eau de Saku No.1 is now my favourite scent. Delicate yet long-lasting, I get compliments all day.'
    }
  },
  {
    name: { ru: 'Алина', kg: 'Алина', en: 'Alina' }, city: { ru: 'Бишкек', kg: 'Бишкек', en: 'Bishkek' }, rating: 5, pid: 4,
    text: {
      ru: 'Помада не сушит губы и держится даже после кофе. Цвет очень благородный.',
      kg: 'Помада эринди кургатпайт, кофе ичкенден кийин да кетпейт. Түсү абдан асыл.',
      en: 'The lipstick doesn’t dry my lips and stays on even after coffee. Such an elegant shade.'
    }
  },
  {
    name: { ru: 'Нургуль', kg: 'Нургуль', en: 'Nurgul' }, city: { ru: 'Каракол', kg: 'Каракол', en: 'Karakol' }, rating: 4, pid: 11,
    text: {
      ru: 'Баттер очень питательный, зимой спасение для сухой кожи. Доставка пришла за 3 дня, упаковка красивая.',
      kg: 'Баттер абдан азыктуу, кышында кургак териге куткаруучу. Жеткирүү 3 күндө келди, таңгагы кооз.',
      en: 'The butter is so nourishing, a lifesaver for dry skin in winter. Delivery took 3 days and the packaging is lovely.'
    }
  },
  {
    name: { ru: 'Камила', kg: 'Камила', en: 'Kamila' }, city: { ru: 'Бишкек', kg: 'Бишкек', en: 'Bishkek' }, rating: 5, pid: 2,
    text: {
      ru: 'Ночной крем, после которого утром не нужен тональный. Кожа мягкая и отдохнувшая.',
      kg: 'Түнкү крем колдонгондон кийин эртең менен тоналдык кремдин кереги жок. Терим жумшак жана эс алгандай.',
      en: 'A night cream that means I don’t need foundation in the morning. Skin feels soft and rested.'
    }
  },
  {
    name: { ru: 'Бермет', kg: 'Бермет', en: 'Bermet' }, city: { ru: 'Талас', kg: 'Талас', en: 'Talas' }, rating: 5, pid: 12,
    text: {
      ru: 'Купила масло для ванны в подарок маме, она в восторге. Аромат розы наполняет всю комнату.',
      kg: 'Ванна майын апама белекке алдым, абдан сүйүндү. Роза жыты бүт бөлмөнү толтурат.',
      en: 'Bought the bath oil as a gift for my mum and she adores it. The rose scent fills the whole room.'
    }
  }
]
