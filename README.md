# Portfolio — Mariano Tomás Corino

Portfolio personal de desarrollador frontend y diseñador. Sitio de una sola página con navegación por secciones, tema dual claro/oscuro y animaciones reactivas.

🔗 **[Ver demo en vivo](#)** · _(agregar URL de Vercel)_

![Portfolio preview](images/profile/1.webp)

## ✨ Características

- **Tema dual** claro/oscuro con transiciones suaves y persistencia.
- **Navegación por secciones** con scroll-snap e indicador animado.
- **Canvas reactivo** de fondo en la sección Stack.
- **Timeline de formación** con hexágonos interactivos y modales de diplomas.
- **Sección de proyectos** filtrable por categoría (Code · Webs · Diseño).
- **Modales** de identidad de marca (con zoom) y descarga de app (QR).
- **Diseño responsive** — desktop, tablet y mobile (vertical y apaisado).
- **Loader inicial** con el logo animado.
- **Optimización** — imágenes en WebP, fuentes con preload, lazy loading.

## 🛠️ Stack

- **HTML5** semántico
- **SCSS** con arquitectura 7-1
- **JavaScript** vanilla (ES6+)
- **EmailJS** para el formulario de contacto
- **FontAwesome** para iconografía

## 📂 Estructura

```
├── index.html
├── script.js
├── styles.css          # CSS compilado
├── scss/               # Fuentes SCSS (arquitectura 7-1)
│   ├── abstracts/      # Variables y mixins
│   ├── base/           # Estilos base
│   ├── components/     # Componentes reutilizables
│   ├── layout/         # Secciones de la página
│   └── utilities/      # Animaciones
├── images/             # Imágenes (WebP optimizadas)
└── files/              # CV y diplomas
```

## 🚀 Desarrollo local

```bash
# Instalar dependencias
npm install

# Compilar SCSS en modo watch
npm run sass:dev
```

Luego abrir `index.html` con Live Server o similar.

## 📬 Contacto

- **Email:** mariano.corino@gmail.com
- **GitHub:** [@mariaNtC](https://github.com/mariaNtC)
- **Ubicación:** Buenos Aires, Argentina

---

© 2026 Mariano Tomás Corino
