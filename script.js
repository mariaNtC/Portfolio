// ==============================
// SELECTORES BASE
// ==============================
const sections      = [...document.querySelectorAll('section')]
const titleEl       = document.querySelector('.nav-title')
const animator      = document.querySelector('.nav-animator')
const menuItemsLeft = document.querySelectorAll('.menu-item')
const menuItemsRight= document.querySelectorAll('.menu-item-right')
const allMenuLinks  = document.querySelectorAll('a[href^="#"]')


// ==============================
// ESTADO GLOBAL
// ==============================
let currentTitle = ''
let currentIndex = 0
let isScrolling  = false
let scrollTimeout = null

// ==============================
// INIT NAV
// ==============================
if (animator && titleEl && sections.length > 0) {
  animator.classList.add('is-visible')
  currentTitle       = sections[0].dataset.title || ''
  titleEl.textContent = currentTitle
}

// ==============================
// TEXTO DINÁMICO
// ==============================
const words = [
  'cocinero',
  'gamer',
  'amante de los animales',
  'creativo',
  'aprendiz constante'
]

const dynamicText = document.getElementById('dynamic-text')

if (dynamicText) {
  let index = 0
  dynamicText.textContent = words[0]

  const animateText = () => {
    dynamicText.style.opacity   = 0
    dynamicText.style.transform = 'translateY(-4px)'

    setTimeout(() => {
      index = (index + 1) % words.length
      dynamicText.textContent  = words[index]
      dynamicText.style.opacity   = 1
      dynamicText.style.transform = 'translateY(0)'

      setTimeout(animateText, 1200)
    }, 300)
  }

  setTimeout(animateText, 1200)
}

// ==============================
// IMAGEN RANDOM EN HOVER
// ==============================
const profileImage = document.getElementById('profile-image')

if (profileImage) {
  const images = [
    'images/profile/1.jpg',
    'images/profile/2.jpg',
    'images/profile/3.jpg',
    'images/profile/4.jpg',
    'images/profile/5.jpg',
    'images/profile/6.jpg',
    'images/profile/7.jpg'
  ]

  // Precarga
  images.forEach(src => {
    const img = new Image()
    img.src = src
  })

  let lastIndex = 0

  const getRandomImage = () => {
    let next
    do {
      next = Math.floor(Math.random() * images.length)
    } while (next === lastIndex)
    lastIndex = next
    return images[next]
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches 
              || window.matchMedia('(hover: none)').matches

let intervalId = null

// 👉 DESKTOP → hover
if (!isMobile) {
  profileImage.addEventListener('mouseenter', () => {
    profileImage.src = getRandomImage()
  })
}

// 👉 MOBILE → autoplay
if (isMobile) {
  intervalId = setInterval(() => {
    profileImage.style.opacity = 0.7

    setTimeout(() => {
      profileImage.src = getRandomImage()
      profileImage.style.opacity = 1
    }, 200)

  }, 3000)
}


}



// ==============================
// THEME TOGGLE
// ==============================
const root     = document.documentElement
const themeBtn = document.getElementById('theme-toggle')

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const savedTheme = localStorage.getItem('theme') || 'dark'
applyTheme(savedTheme)

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme')
    applyTheme(current === 'dark' ? 'light' : 'dark')
  })
}

// ==============================
// CV INTERACCIÓN
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  const cvItem    = document.querySelector('.cv-item')
  const labelText = document.querySelector('.label-text')
  const confirmBtn= document.querySelector('.cv-confirm')
  const cancelBtn = document.querySelector('.cv-cancel')

  if (!cvItem || !labelText || !confirmBtn || !cancelBtn) return

  cvItem.addEventListener('click', (e) => {
    if (!cvItem.classList.contains('confirming')) {
      e.preventDefault()
      cvItem.classList.add('confirming')
      labelText.innerHTML = '¿Descargar<br>currículum?'
    }
  })

  cancelBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    cvItem.classList.remove('confirming')
    labelText.textContent = 'Currículum'
  })

  confirmBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    window.location.href = './files/cv.pdf'
  })
})

// ==============================
// HELPERS — estados activos
// ==============================
const clearActiveStates = () => {
  menuItemsLeft.forEach(i  => i.classList.remove('active'))
  menuItemsRight.forEach(i => i.classList.remove('active'))
}

const setActiveById = (id) => {
  const selector = `[href="#${id}"]`
  menuItemsLeft.forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === `#${id}`)
  })
  menuItemsRight.forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === `#${id}`)
  })
}

const setActiveDot = (id) => {
  dots.forEach(dot => dot.classList.toggle('active', dot.dataset.target === id))
}

// ==============================
// ANIMACIÓN DE TÍTULO
// ==============================
const animateTitleChange = (newTitle, newIndex) => {
  if (!titleEl || newTitle === currentTitle) return
  if (titleEl.classList.contains('is-animating')) return

  const direction = newIndex > currentIndex ? 1 : -1

  titleEl.classList.add('is-animating')
  titleEl.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  titleEl.style.transform  = `translateY(${direction * -12}px) scale(0.98)`
  titleEl.style.opacity    = '0'
  titleEl.style.filter     = 'blur(6px)'

  setTimeout(() => {
    titleEl.textContent      = newTitle
    titleEl.style.transition = 'none'
    titleEl.style.transform  = `translateY(${direction * 20}px) scale(0.98)`
    titleEl.style.opacity    = '0'
    titleEl.style.filter     = 'blur(8px)'

    requestAnimationFrame(() => {
      titleEl.style.transition = 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
      titleEl.style.transform  = 'translateY(0) scale(1)'
      titleEl.style.opacity    = '1'
      titleEl.style.filter     = 'blur(0)'
    })

    setTimeout(() => titleEl.classList.remove('is-animating'), 0)
  }, 0)

  currentTitle = newTitle
  currentIndex = newIndex
}

// ==============================
// SCROLL CONTROLADO
// ==============================
const scrollToSection = (id) => {
  const target = document.getElementById(id)
  if (!target) return

  isScrolling = true

  clearActiveStates()
  setActiveById(id)
  setActiveDot(id)

  const newIndex = sections.findIndex(sec => sec.id === id)
  animateTitleChange(target.dataset.title, newIndex)

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })

  clearTimeout(scrollTimeout)

  scrollTimeout = setTimeout(() => {
    isScrolling = false
  }, 700)
}

// ==============================
// CLICK MENÚ → SCROLL
// ==============================
allMenuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    scrollToSection(link.getAttribute('href').replace('#', ''))
  })
})

// ==============================
// FLECHA SCROLL → FOOTER
// ==============================
const scrollArrow = document.querySelector('.scroll-arrow-container')
if (scrollArrow) {
  scrollArrow.addEventListener('click', () => scrollToSection('footer'))
}

// ==============================
// DOTS
// ==============================
const dots = document.querySelectorAll('[data-target]')

dots.forEach(dot => {
  // Click
  dot.addEventListener('click', () => scrollToSection(dot.dataset.target))
  // Teclado — accesibilidad (role="button" necesita Enter/Space)
  dot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      scrollToSection(dot.dataset.target)
    }
  })
})

// ==============================
// INTERSECTION OBSERVER
// ==============================
const observer = new IntersectionObserver((entries) => {
  if (isScrolling) return

  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

  if (!visible) return

  const id       = visible.target.id
  const newIndex = sections.findIndex(sec => sec.id === id)

  clearActiveStates()
  setActiveById(id)
  setActiveDot(id)
  animateTitleChange(visible.target.dataset.title, newIndex)

}, { threshold: [0.3, 0.3, 0.3] })

sections.forEach(section => observer.observe(section))



// ==============================
// CONTACT FORM
// Requiere EmailJS cargado en el HTML:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
//
// Reemplazá estas 3 constantes con tus datos de EmailJS:
const EMAILJS_SERVICE_ID  = 'service_uf2r8pm'
const EMAILJS_TEMPLATE_ID = 'template_uvtqknv'
const EMAILJS_PUBLIC_KEY  = 'L99uG3OEvEM77pPqh'
// ==============================

document.addEventListener('DOMContentLoaded', () => {

  const form       = document.getElementById('contact-form')
  const submitBtn  = document.getElementById('cf-submit-btn')
  const statusEl   = form?.querySelector('.cf-status')
  const contactInput = document.getElementById('cf-contact')
  const textarea   = document.getElementById('cf-message')
  const charCount  = form?.querySelector('.cf-char-count')
  const toggleBtns = form?.querySelectorAll('.cf-toggle-btn')

  if (!form) return

  // ==============================
  // INICIALIZAR EMAILJS
  // ==============================
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  }

  // ==============================
  // TOGGLE MAIL / TELÉFONO
  // ==============================
  let contactType = 'email'

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type

      toggleBtns.forEach(b => {
        b.classList.remove('active')
        b.setAttribute('aria-pressed', 'false')
      })
      btn.classList.add('active')
      btn.setAttribute('aria-pressed', 'true')

      contactType = type
      contactInput.value = ''
      clearError(contactInput)

      if (type === 'email') {
        contactInput.type        = 'email'
        contactInput.placeholder = 'tu@email.com'
        contactInput.autocomplete = 'email'
      } else {
        contactInput.type        = 'tel'
        contactInput.placeholder = '+54 11 1234-5678'
        contactInput.autocomplete = 'tel'
      }

      contactInput.focus()
    })
  })

  // ==============================
  // CONTADOR DE CARACTERES
  // ==============================
  if (textarea && charCount) {
    const max = parseInt(textarea.maxLength)

    textarea.addEventListener('input', () => {
      const len = textarea.value.length
      charCount.textContent = `${len} / ${max}`

      charCount.classList.remove('cf-char-warn', 'cf-char-limit')
      if (len >= max) {
        charCount.classList.add('cf-char-limit')
      } else if (len >= max * 0.85) {
        charCount.classList.add('cf-char-warn')
      }
    })
  }

  // ==============================
  // VALIDACIÓN
  // ==============================
  const showError = (input) => input.classList.add('cf-error')
  const clearError = (input) => input.classList.remove('cf-error')

  const validateForm = () => {
    let valid = true
    const subject = document.getElementById('cf-subject')
    const message = document.getElementById('cf-message')

    ;[subject, contactInput, message].forEach(clearError)

    if (!subject.value.trim()) {
      showError(subject)
      valid = false
    }

    if (contactType === 'email') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRe.test(contactInput.value.trim())) {
        showError(contactInput)
        valid = false
      }
    } else {
      // Teléfono: mínimo 7 dígitos
      const phoneRe = /[\d]{7,}/
      if (!phoneRe.test(contactInput.value.replace(/\s|-/g, ''))) {
        showError(contactInput)
        valid = false
      }
    }

    if (!message.value.trim()) {
      showError(message)
      valid = false
    }

    return valid
  }

  // Limpiar error al escribir
  form.querySelectorAll('.cf-input, .cf-textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el))
  })

  // ==============================
  // ESTADO DE ENVÍO
  // ==============================
  const setStatus = (type, msg) => {
    statusEl.textContent = msg
    statusEl.className   = `cf-status cf-status--${type}`
  }

  const setSending = (sending) => {
    submitBtn.disabled = sending
    submitBtn.classList.toggle('cf-submit--sending', sending)

    const icon = submitBtn.querySelector('.cf-submit__icon i')
    const text = submitBtn.querySelector('.cf-submit__text')

    if (sending) {
      icon.className  = 'fa-solid fa-circle-notch'
      text.textContent = 'Enviando...'
    } else {
      icon.className  = 'fa-solid fa-paper-plane'
      text.textContent = 'Enviar mensaje'
    }
  }

  // ==============================
  // SUBMIT
  // ==============================
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setStatus('error', '✖ Revisá los campos marcados.')
      return
    }

    setSending(true)
    setStatus('', '')

    const templateParams = {
      subject:      document.getElementById('cf-subject').value.trim(),
      contact_type: contactType === 'email' ? 'Email' : 'Teléfono',
      contact:      contactInput.value.trim(),
      message:      document.getElementById('cf-message').value.trim(),
    }

    try {
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS no está cargado.')
      }

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)

      setStatus('ok', '✓ Mensaje enviado. Te respondo pronto.')
      form.reset()
      if (charCount) charCount.textContent = '0 / 800'

    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error', 'No se pudo enviar. Intentá por mail directamente.')
    } finally {
      setSending(false)
    }
  })

})

// ==============================
// ABOUT — CAROUSEL
// ==============================
;(function () {

  // Breakpoints deben coincidir exactamente con los del SCSS
  const BP_MOBILE  = 650    // ≤ 650 → 1 card
  const BP_TABLET_SM = 850  // 651–850 → 2 cards, gap 14px
  const BP_TABLET  = 1024   // 851–1024 → 2 cards, gap 20px
                            // > 1024 → 3 cards, gap 20px

  const track    = document.querySelector('.about-track')
  const prevBtn  = document.querySelector('.about-arrow--prev')
  const nextBtn  = document.querySelector('.about-arrow--next')
  const dotsWrap = document.querySelector('.about-dots')

  if (!track || !prevBtn || !nextBtn) return

  const cards = [...track.querySelectorAll('.about-card')]
  const total = cards.length

  let current = 0

  // ── Cuántas cards mostrar según viewport ──
  const getVisible = () => {
    const w = window.innerWidth
    if (w <= BP_MOBILE)  return 1
    if (w <= BP_TABLET_SM)  return 1 
    if (w <= BP_TABLET)  return 2
     // cubre 651–1024px (incluye tablet chica)
    return 3
  }

  // ── Gap real según breakpoint (debe coincidir con SCSS) ──
  const getGap = () => {
    const w = window.innerWidth
    if (w <= BP_MOBILE)    return 10
    if (w <= BP_TABLET_SM) return 5  // @media (max-width: 850px)
    return 20
  }

  // ── Máximo índice de desplazamiento ──
  const maxIndex = () => Math.max(0, total - getVisible())

  // ── Generar dots ──
  const buildDots = () => {
    dotsWrap.innerHTML = ''
    const count = maxIndex() + 1
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button')
      dot.type = 'button'
      dot.className = 'about-dot' + (i === current ? ' active' : '')
      dot.setAttribute('aria-label', `Ir a posición ${i + 1}`)
      dot.setAttribute('role', 'tab')
      dot.addEventListener('click', () => goTo(i))
      dotsWrap.appendChild(dot)
    }
  }

  // ── Actualizar dots activos ──
  const updateDots = () => {
    const dotEls = dotsWrap.querySelectorAll('.about-dot')
    dotEls.forEach((d, i) => d.classList.toggle('active', i === current))
  }

  // ── Calcular y aplicar transform ──
  const goTo = (index) => {
    current = Math.max(0, Math.min(index, maxIndex()))

    // Medimos el ancho real de la card en el DOM + el gap del CSS
    const cardEl = cards[0]
    const cardW  = cardEl.getBoundingClientRect().width + getGap()

    track.style.transform = `translateX(-${current * cardW}px)`

    prevBtn.disabled = current === 0
    nextBtn.disabled = current >= maxIndex()

    updateDots()
  }

  // ── Navegación ──
  prevBtn.addEventListener('click', () => goTo(current - 1))
  nextBtn.addEventListener('click', () => goTo(current + 1))

  // ── Teclado ──
  document.addEventListener('keydown', (e) => {
    const section = document.getElementById('about')
    if (!section) return
    const rect = section.getBoundingClientRect()
    const inView = rect.top < window.innerHeight && rect.bottom > 0
    if (!inView) return

    if (e.key === 'ArrowLeft')  goTo(current - 1)
    if (e.key === 'ArrowRight') goTo(current + 1)
  })

  // ── Swipe táctil ──
  let touchStartX = 0
  let touchDeltaX = 0

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX
    touchDeltaX = 0
  }, { passive: true })

  track.addEventListener('touchmove', (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX
  }, { passive: true })

  track.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) > 50) {
      touchDeltaX < 0 ? goTo(current + 1) : goTo(current - 1)
    }
    touchDeltaX = 0
  })

  // ── Resize — debounced ──
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      buildDots()
      goTo(Math.min(current, maxIndex()))
    }, 150)
  })

  // ── Init ──
  buildDots()
  goTo(0)

})()

// ==============================
// STACK — Canvas (banda + malla hex + halo) + Tilt 3D
// ==============================
;(function () {

  const canvas  = document.querySelector('.stack-bg-canvas')
  const section = document.getElementById('stack')
  if (!canvas || !section) return

  const ctx  = canvas.getContext('2d')
  const NEON = '127, 255, 233'

  let mouseX = -9999
  let mouseY = -9999

  // ══════════════════════════════════════════
  // BANDA — altura fija, centrada verticalmente
  // ══════════════════════════════════════════
  const BAND_H     = 460    // px — alto de la banda (supera un poco las cards)
  const HEX_SIZE   = 22     // px — tamaño del hexágono
  const HALO_R     = 200    // px — radio del halo del mouse

  const getBand = (w, h) => ({
    x: 0,
    y: h / 2 - BAND_H / 2,  // siempre centrada verticalmente
    w: w,
    h: BAND_H,
  })

  // ══════════════════════════════════════════
  // DRAW
  // ══════════════════════════════════════════
  const draw = () => {
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Fondo negro
    ctx.fillStyle = '#03060d'
    ctx.fillRect(0, 0, w, h)

    const band = getBand(w, h)

    // ── Clip a la banda ──
    ctx.save()
    ctx.beginPath()
    ctx.rect(band.x, band.y, band.w, band.h)
    ctx.clip()

    // ── Malla hexagonal ──
    const colW = HEX_SIZE * Math.sqrt(3)
    const rowH = HEX_SIZE * 1.5

    for (let row = -1; row * rowH < h + HEX_SIZE * 2; row++) {
      for (let col = -1; col * colW < w + colW; col++) {
        const ox = row % 2 === 0 ? 0 : colW / 2
        const cx = col * colW + ox
        const cy = row * rowH

        ctx.beginPath()
        for (let v = 0; v < 6; v++) {
          const angle = (Math.PI / 3) * v - Math.PI / 6
          const vx = cx + HEX_SIZE * 0.78 * Math.cos(angle)
          const vy = cy + HEX_SIZE * 0.78 * Math.sin(angle)
          v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy)
        }
        ctx.closePath()
        ctx.strokeStyle = `rgba(${NEON}, 0.07)`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    // ── Halo del mouse (solo si está sobre la sección) ──
    if (mouseX > 0 && mouseY > 0) {
      // Gradiente radial desde el mouse
      const grad = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, HALO_R
      )
      grad.addColorStop(0,    `rgba(${NEON}, 0.18)`)
      grad.addColorStop(0.45, `rgba(${NEON}, 0.06)`)
      grad.addColorStop(1,    `rgba(${NEON}, 0)`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Nodos de la malla iluminados por el halo
      for (let row = -1; row * rowH < h + HEX_SIZE * 2; row++) {
        for (let col = -1; col * colW < w + colW; col++) {
          const ox = row % 2 === 0 ? 0 : colW / 2
          const nx = col * colW + ox
          const ny = row * rowH
          const dist = Math.hypot(nx - mouseX, ny - mouseY)
          if (dist < HALO_R * 0.65) {
            const alpha = (1 - dist / (HALO_R * 0.65)) * 0.65
            ctx.beginPath()
            ctx.arc(nx, ny, 1.8, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${NEON}, ${alpha})`
            ctx.fill()
          }
        }
      }
    }

    ctx.restore() // fin del clip de la banda

    // ── Bordes de la banda con glow ──
    const drawBandEdge = (y, blur, alpha, lw) => {
      ctx.save()
      ctx.shadowBlur  = blur
      ctx.shadowColor = `rgba(${NEON}, ${alpha})`
      ctx.strokeStyle = `rgba(${NEON}, ${alpha})`
      ctx.lineWidth   = lw
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
      ctx.restore()
    }

    // Borde superior
    drawBandEdge(band.y, 24, 0.12, 4)
    drawBandEdge(band.y,  8, 0.35, 1.5)
    drawBandEdge(band.y,  2, 0.70, 0.8)

    // Borde inferior
    drawBandEdge(band.y + band.h, 24, 0.12, 4)
    drawBandEdge(band.y + band.h,  8, 0.35, 1.5)
    drawBandEdge(band.y + band.h,  2, 0.70, 0.8)
  }

  // ══════════════════════════════════════════
  // RESIZE
  // ══════════════════════════════════════════
  const resize = () => {
    canvas.width  = section.offsetWidth
    canvas.height = section.offsetHeight
    draw()
  }

  // ══════════════════════════════════════════
  // LOOP — solo cuando la sección es visible
  // ══════════════════════════════════════════
  let rafId  = null
  let active = false

  const loop = () => {
    if (!active) return
    draw()
    rafId = requestAnimationFrame(loop)
  }

  new IntersectionObserver((entries) => {
    active = entries[0].isIntersecting
    if (active) loop()
    else { cancelAnimationFrame(rafId); rafId = null }
  }, { threshold: 0.05 }).observe(section)

  // Mouse tracking
  section.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  }, { passive: true })

  section.addEventListener('mouseleave', () => {
    mouseX = -9999
    mouseY = -9999
  })

  // Resize debounced
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(resize, 150)
  })

  resize()

  // ══════════════════════════════════════════
  // TILT 3D — cards
  // ══════════════════════════════════════════
  const MAX_TILT = 8

  document.querySelectorAll('#stack .stack-card[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
      const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)

      card.style.transform = `perspective(800px) rotateX(${-dy * MAX_TILT}deg) rotateY(${dx * MAX_TILT}deg) scale3d(1.02,1.02,1.02)`

      const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1)
      const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1)
      card.style.setProperty('--mx', `${mx}%`)
      card.style.setProperty('--my', `${my}%`)
    }, { passive: true })

    card.addEventListener('mouseleave', () => {
      card.style.transform = ''
    })
  })

})()
