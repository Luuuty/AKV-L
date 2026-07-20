import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import blueHoodie from './assets/blue-hoodie-ai.png'
import grayBasicHoodie from './assets/gray-basic-hoodie-ai.png'
import navyHoodie from './assets/navy-hoodie-ai.png'
import silverLogoHoodie from './assets/silver-logo-hoodie-ai.png'
import whiteZipHoodie from './assets/white-zip-hoodie-ai.png'

const IMAGES = [
  {
    src: navyHoodie,
    bg: '#F4C95D',
    panel: '#F7D77A',
    heroScale: 1,
  },
  {
    src: whiteZipHoodie,
    bg: '#B7C3CC',
    panel: '#CDD6DD',
    heroScale: 1.08,
  },
  {
    src: silverLogoHoodie,
    bg: '#93A4AE',
    panel: '#A9B7BF',
    heroScale: 1.28,
  },
  {
    src: grayBasicHoodie,
    bg: '#6F7F86',
    panel: '#87969C',
    heroScale: 1.1,
  },
  {
    src: blueHoodie,
    bg: '#7EA7E8',
    panel: '#99BBEE',
    heroScale: 1.06,
  },
] as const

const PRODUCTS = [
  { name: 'Темная худи с мехом', price: '$89', fit: 'Свободная посадка' },
  { name: 'Белая худи на молнии', price: '$79', fit: 'Оверсайз' },
  { name: 'Серая худи с логотипом', price: '$84', fit: 'Плотный флис' },
  { name: 'Базовая серая худи', price: '$74', fit: 'На каждый день' },
  { name: 'Голубая худи', price: '$82', fit: 'Мягкий хлопок' },
] as const

const TRANSITION = '650ms cubic-bezier(0.4,0,0.2,1)'
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")"

type Direction = 'next' | 'prev'
type Role = 'center' | 'left' | 'right' | 'backLeft' | 'backRight'

function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)

  useEffect(() => {
    IMAGES.forEach(({ src }) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const roles = useMemo(
    () => ({
      center: activeIndex,
      left: (activeIndex + IMAGES.length - 1) % IMAGES.length,
      right: (activeIndex + 1) % IMAGES.length,
      backLeft: (activeIndex + IMAGES.length - 2) % IMAGES.length,
      backRight: (activeIndex + 2) % IMAGES.length,
    }),
    [activeIndex],
  )

  const navigate = (direction: Direction) => {
    if (isAnimating) {
      return
    }

    setIsAnimating(true)
    setActiveIndex((current) =>
      direction === 'next'
        ? (current + 1) % IMAGES.length
        : (current + IMAGES.length - 1) % IMAGES.length,
    )

    window.setTimeout(() => {
      setIsAnimating(false)
    }, 650)
  }

  const getRole = (index: number): Role => {
    if (index === roles.center) {
      return 'center'
    }

    if (index === roles.left) {
      return 'left'
    }

    if (index === roles.right) {
      return 'right'
    }

    if (index === roles.backLeft) {
      return 'backLeft'
    }

    return 'backRight'
  }

  const getItemStyle = (role: Role): CSSProperties => {
    const shared: CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      transform: 'translateX(-50%) scale(1)',
      transition: [
        `transform ${TRANSITION}`,
        `filter ${TRANSITION}`,
        `opacity ${TRANSITION}`,
        `left ${TRANSITION}`,
      ].join(', '),
      willChange: 'transform, filter, opacity',
    }

    if (role === 'center') {
      return {
        ...shared,
        left: '50%',
        bottom: isMobile ? '24%' : '10%',
        height: isMobile ? '58%' : '102%',
        transform: `translateX(-50%) scale(${isMobile ? 1 : 1.06})`,
        filter: 'blur(0)',
        opacity: 1,
        zIndex: 20,
      }
    }

    if (role === 'left' || role === 'right') {
      return {
        ...shared,
        left: role === 'left' ? (isMobile ? '20%' : '30%') : isMobile ? '80%' : '70%',
        bottom: isMobile ? '38%' : '25%',
        height: isMobile ? '16%' : '39%',
        filter: 'blur(2px)',
        opacity: 0.85,
        zIndex: 10,
      }
    }

    return {
      ...shared,
      left: role === 'backLeft' ? (isMobile ? '38%' : '43%') : isMobile ? '62%' : '57%',
      bottom: isMobile ? '38%' : '27%',
      height: isMobile ? '13%' : '31%',
      filter: 'blur(4px)',
      opacity: 1,
      zIndex: 5,
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: `background-color ${TRANSITION}`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <section className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
        <div
          className="pointer-events-none absolute inset-0 bg-repeat"
          style={{
            zIndex: 50,
            backgroundImage: GRAIN,
            backgroundSize: '200px 200px',
            opacity: 0.4,
          }}
        />

        <div
          className="pointer-events-none absolute inset-x-0 flex select-none items-center justify-center"
          style={{ zIndex: 2, top: '18%' }}
        >
          <span
            className="whitespace-nowrap uppercase text-white"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            AKVÉL ДРОП
          </span>
        </div>

        <div className="absolute top-6 left-4 text-xs font-semibold tracking-[0.18em] text-white/90 uppercase sm:left-8" style={{ zIndex: 60 }}>
          AKVÉL
        </div>

        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((image, index) => (
            <div key={image.src} style={getItemStyle(getRole(index))}>
              <img
                className="h-full w-full object-contain object-bottom"
                style={{
                  transform: `scale(${isMobile ? 1 : image.heroScale})`,
                  transformOrigin: 'bottom center',
                  transition: `transform ${TRANSITION}`,
                }}
                src={image.src}
                alt={`AKVÉL худи ${index + 1}`}
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-6 left-4 max-w-[320px] sm:bottom-20 sm:left-24" style={{ zIndex: 60 }}>
          <p className="mb-2 text-base font-bold tracking-[0.02em] text-white/95 uppercase sm:mb-3 sm:text-[22px]">
            AKVÉL ХУДИ
          </p>
          <p className="mb-4 hidden text-xs leading-[1.6] text-white/85 sm:mb-5 sm:block sm:text-sm">
            Чистый силуэт, мягкая ткань и готовый образ для города. Выбирай свой цвет и оформляй
            заказ.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-[transform,background-color] duration-150 hover:scale-[1.08] hover:bg-white/10 sm:h-16 sm:w-16"
              type="button"
              aria-label="Предыдущая худи"
              onClick={() => navigate('prev')}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-transparent text-white transition-[transform,background-color] duration-150 hover:scale-[1.08] hover:bg-white/10 sm:h-16 sm:w-16"
              type="button"
              aria-label="Следующая худи"
              onClick={() => navigate('next')}
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <a
          className="absolute right-4 bottom-6 flex items-center gap-2 text-white/95 no-underline transition-opacity duration-200 hover:text-white sm:right-10 sm:bottom-20 sm:gap-3"
          href="#discover"
          style={{
            zIndex: 60,
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(20px, 4vw, 56px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          <span>СМОТРЕТЬ</span>
          <ArrowRight className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={2.25} />
        </a>
      </section>

      <section id="discover" className="bg-[#f7f4ee] px-4 py-16 text-[#151515] sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-black/50 uppercase">
                Новая коллекция
              </p>
              <h2
                className="max-w-3xl text-5xl leading-[0.95] uppercase sm:text-7xl"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                Худи на каждый день
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-black/60">
              Чистые силуэты, мягкий флис и цвета, подобранные под спокойный стритвир.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {IMAGES.map((image, index) => (
              <article key={image.src} className="overflow-hidden rounded-lg bg-white">
                <div
                  className="relative flex aspect-[4/5] items-center justify-center overflow-hidden"
                  style={{ backgroundColor: image.panel }}
                >
                  <span className="absolute top-3 left-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-black/70 uppercase">
                    Дроп 0{index + 1}
                  </span>
                  <img
                    className="h-[82%] w-[82%] object-contain drop-shadow-[0_24px_35px_rgba(0,0,0,0.18)]"
                    src={image.src}
                    alt={PRODUCTS[index].name}
                    draggable={false}
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold tracking-[0.04em] uppercase">{PRODUCTS[index].name}</h3>
                    <span className="text-sm font-bold">{PRODUCTS[index].price}</span>
                  </div>
                  <p className="text-xs font-medium text-black/50">{PRODUCTS[index].fit}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#151515] px-4 py-14 text-white sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: 'Премиальный флис',
              text: 'Плотная мягкая ткань с чистой фактурой и комфортом на каждый день.',
            },
            {
              icon: Truck,
              title: 'Быстрая доставка',
              text: 'Быстро готовим заказ и аккуратно упаковываем для доставки.',
            },
            {
              icon: ShieldCheck,
              title: 'Легкий обмен',
              text: 'Можно спокойно обменять размер, если посадка не подошла.',
            },
          ].map((feature) => (
            <div key={feature.title} className="border-t border-white/20 pt-6">
              <feature.icon className="mb-5 h-7 w-7" strokeWidth={2.1} />
              <h3 className="mb-3 text-lg font-bold tracking-[0.04em] uppercase">{feature.title}</h3>
              <p className="max-w-sm text-sm leading-6 text-white/65">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#eef1f3] px-4 py-16 text-[#151515] sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.18em] text-black/50 uppercase">
              Подборка AKVÉL
            </p>
            <h2
              className="mb-6 max-w-3xl text-6xl leading-[0.92] uppercase sm:text-8xl"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              Создано для спокойного стритвира
            </h2>
            <p className="mb-8 max-w-xl text-base leading-7 text-black/65">
              Дроп собран вокруг чистого цвета, свободной формы и фактуры, которая хорошо смотрится
              в кадре и в повседневной носке.
            </p>
            <a
              href="#discover"
              className="inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase no-underline transition-transform hover:scale-[1.03]"
            >
              Смотреть дроп
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </div>
          <div className="relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-lg bg-[#d7dde1]">
            <div className="absolute inset-8 rounded-full bg-white/35 blur-3xl" />
            <img
              className="relative z-10 max-h-[520px] w-full object-contain drop-shadow-[0_32px_45px_rgba(0,0,0,0.25)]"
              src={IMAGES[activeIndex].src}
              alt="Главная худи AKVÉL"
              draggable={false}
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#f7f4ee] px-4 py-8 text-[#151515] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-black/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs font-bold tracking-[0.18em] uppercase">AKVÉL</p>
          <p className="text-xs text-black/50">Новый дроп худи. Чистая посадка. Мягкая ткань.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
