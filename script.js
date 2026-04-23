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

}, { threshold: [0.3, 0.6, 0.9] })

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
