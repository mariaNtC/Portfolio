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

  // Precargamos las imágenes para evitar flash en el primer hover
  images.forEach(src => {
    const img = new Image()
    img.src = src
  })

  let lastIndex = 0
  profileImage.addEventListener('mouseenter', () => {
    let next
    do { next = Math.floor(Math.random() * images.length) } while (next === lastIndex)
    lastIndex      = next
    profileImage.src = images[next]
  })
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

    setTimeout(() => titleEl.classList.remove('is-animating'), 400)
  }, 250)

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

  setTimeout(() => { isScrolling = false }, 500)
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
const dots = document.querySelectorAll('.dot-scroll')

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

}, { threshold: [0.3, 0.6, 0.9] })

sections.forEach(section => observer.observe(section))
