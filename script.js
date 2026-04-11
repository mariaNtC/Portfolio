// ==============================
// SELECTORES BASE
// ==============================
const sections = [...document.querySelectorAll('section')]
const titleEl = document.querySelector('.nav-title')
const animator = document.querySelector('.nav-animator')

const menuItemsLeft = document.querySelectorAll(".menu-item")
const menuItemsRight = document.querySelectorAll(".menu-item-right")
const allMenuLinks = document.querySelectorAll('a[href^="#"]')

// ==============================
// ESTADO GLOBAL
// ==============================
let currentTitle = ''
let isScrolling = false
let scrollTimeout = null

// ==============================
let currentIndex = 0

// ==============================
// INIT NAV
// ==============================
if (animator && titleEl && sections.length > 0) {
  animator.classList.add('is-visible')
  currentTitle = sections[0].dataset.title || ''
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
    dynamicText.style.opacity = 0
    dynamicText.style.transform = 'translateY(-4px)'

    setTimeout(() => {
      index = (index + 1) % words.length
      dynamicText.textContent = words[index]
      dynamicText.style.opacity = 1
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

  profileImage.addEventListener('mouseenter', () => {
    const randomIndex = Math.floor(Math.random() * images.length)
    profileImage.src = images[randomIndex]
  })
}

// ==============================
// THEME TOGGLE
// ==============================
const root = document.documentElement
const themeBtn = document.getElementById('theme-toggle')

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const savedTheme = localStorage.getItem('theme') || 'dark'
applyTheme(savedTheme)

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme')
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark')
  })
}

// ==============================
// CV INTERACCIÓN
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const cvItem = document.querySelector(".cv-item")
  const labelText = document.querySelector(".label-text")
  const confirmBtn = document.querySelector(".cv-confirm")
  const cancelBtn = document.querySelector(".cv-cancel")

  if (!cvItem || !labelText || !confirmBtn || !cancelBtn) return

  cvItem.addEventListener("click", (e) => {
    if (!cvItem.classList.contains("confirming")) {
      e.preventDefault()
      cvItem.classList.add("confirming")
      labelText.innerHTML = `¿Descargar<br>currículum?`
    }
  })

  cancelBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    cvItem.classList.remove("confirming")
    labelText.textContent = "Currículum"
  })

  confirmBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    window.location.href = "./files/cv.pdf"
  })
})

// ==============================
// HELPERS
// ==============================
const clearActiveStates = () => {
  menuItemsLeft.forEach(i => i.classList.remove("active"))
  menuItemsRight.forEach(i => i.classList.remove("active"))
}

const setActiveById = (id) => {
  menuItemsLeft.forEach(item => {
    if (item.getAttribute("href") === `#${id}`) {
      item.classList.add("active")
    }
  })

  menuItemsRight.forEach(item => {
    if (item.getAttribute("href") === `#${id}`) {
      item.classList.add("active")
    }
  })
}








function animateTitleChange(newTitle, newIndex) {
  if (!titleEl || newTitle === currentTitle) return
  if (titleEl.classList.contains('is-animating')) return

  const direction = newIndex > currentIndex ? 1 : -1

  titleEl.classList.add('is-animating')

  // 🔻 SALIDA (dinámica)
  titleEl.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  titleEl.style.transform = `translateY(${direction * -12}px) scale(0.98)`
  titleEl.style.opacity = '0'
  titleEl.style.filter = 'blur(6px)'

  setTimeout(() => {
    // cambiar texto
    titleEl.textContent = newTitle

    // 🔺 POSICIÓN INICIAL DE ENTRADA
    titleEl.style.transition = 'none'
    titleEl.style.transform = `translateY(${direction * 20}px) scale(0.98)`
    titleEl.style.opacity = '0'
    titleEl.style.filter = 'blur(8px)'

    requestAnimationFrame(() => {
      // 🔥 ENTRADA PRO
      titleEl.style.transition = 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
      titleEl.style.transform = 'translateY(0) scale(1)'
      titleEl.style.opacity = '1'
      titleEl.style.filter = 'blur(0)'
    })

    setTimeout(() => {
      titleEl.classList.remove('is-animating')
    }, 400)

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

  // ✅ ACTIVAR INMEDIATAMENTE
  clearActiveStates()
  setActiveById(id)
  setActiveDot(id)

  const newTitle = target.dataset.title
  const newIndex = sections.findIndex(sec => sec.id === id)

  animateTitleChange(newTitle, newIndex)

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
  // ⏳ desbloquear observer después
  setTimeout(() => {
    isScrolling = false
  }, 500)
}
// ==============================
// CLICK MENU → ACTIVE
// ==============================
allMenuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault()

    const targetId = link.getAttribute("href").replace("#", "")
    scrollToSection(targetId)
  })
})

// ==============================
// SCROLL ARROW → FOOTER
// ==============================
const scrollArrow = document.querySelector('.scroll-arrow-container')

if (scrollArrow) {
  scrollArrow.addEventListener('click', () => {
    scrollToSection('footer')
  })
}

// ==============================
// DOTS
// ==============================
const dots = document.querySelectorAll('.dot-scroll')

const setActiveDot = (id) => {
  dots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.target === id)
  })
}

// click en dots
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const id = dot.dataset.target
    scrollToSection(id)
  })
})
// ==============================
// INTERSECTION OBSERVER
// ==============================
const observer = new IntersectionObserver((entries) => {
  if (isScrolling) return // 🔒 CLAVE

  let visibleSection = null

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!visibleSection || entry.intersectionRatio > visibleSection.intersectionRatio) {
        visibleSection = entry
      }
    }
  })

  if (!visibleSection) return

  const section = visibleSection.target
  const id = section.id

  clearActiveStates()
  setActiveById(id)
  setActiveDot(id)

  const newTitle = section.dataset.title
const newIndex = sections.findIndex(sec => sec.id === id)

animateTitleChange(newTitle, newIndex)

}, {
  threshold: [0.3, 0.6, 0.9]
})

sections.forEach(section => observer.observe(section))
