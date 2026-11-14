# Manual técnico – Sitio web JyM Grúas Express

**Versión:** 1.0  
**Fecha:** noviembre de 2026  
**Repositorio:** `jym-gruas-express`

Este manual explica cómo está construido el sitio, qué tecnologías usa, cómo está organizado y cómo hacer los cambios más comunes sin romper nada.

---

## Índice

1. [Resumen del proyecto](#1-resumen-del-proyecto)
2. [Tecnologías y lenguajes](#2-tecnologías-y-lenguajes)
3. [Arquitectura](#3-arquitectura)
4. [Estructura de carpetas y archivos](#4-estructura-de-carpetas-y-archivos)
5. [Estructura de la página (secciones)](#5-estructura-de-la-página-secciones)
6. [Sistema de diseño](#6-sistema-de-diseño)
7. [JavaScript: funcionalidades](#7-javascript-funcionalidades)
8. [SEO](#8-seo)
9. [Accesibilidad y rendimiento](#9-accesibilidad-y-rendimiento)
10. [Cómo hacer cambios comunes](#10-cómo-hacer-cambios-comunes)
11. [Publicación](#11-publicación)
12. [Flujo de trabajo con Git y GitHub](#12-flujo-de-trabajo-con-git-y-github)
13. [Pendientes antes de publicar](#13-pendientes-antes-de-publicar)
14. [Mejoras futuras](#14-mejoras-futuras)

---

## 1. Resumen del proyecto

| Ítem | Detalle |
|---|---|
| Tipo | Sitio web estático de una página (*landing page*) |
| Objetivo | Convertir visitas en contactos: llamada o WhatsApp |
| Público | Conductores en emergencia (mayoría desde celular) y personas que buscan conductor designado |
| Enfoque | *Mobile first*: diseñado primero para celular |
| Backend | No tiene. Todo ocurre en el navegador del usuario |
| Base de datos | No tiene |
| Dependencias | Ninguna instalada. Solo Google Fonts por enlace externo |

**Por qué estático:** un sitio de grúas necesita cargar rápido, incluso con mala señal en carretera, y no requiere usuarios ni datos guardados. Un sitio estático es más rápido, más seguro (no hay servidor que hackear) y gratis o muy barato de alojar.

---

## 2. Tecnologías y lenguajes

| Tecnología | Uso en el proyecto |
|---|---|
| **HTML5** | Estructura y contenido. Usa etiquetas semánticas (`header`, `main`, `section`, `article`, `aside`, `footer`, `nav`, `details`) |
| **CSS3** | Diseño visual. Usa variables CSS (*custom properties*), **CSS Grid**, **Flexbox**, *media queries* y animaciones |
| **JavaScript (ES6+)** | Interactividad, sin librerías (*vanilla JS*): menú móvil, GPS y armado del mensaje de WhatsApp |
| **SVG** | Íconos e ilustraciones dibujados en código: escalan sin perder calidad y no requieren descargar imágenes |
| **JSON-LD (Schema.org)** | Datos estructurados para que Google entienda que es un negocio local (dirección, teléfono, horario) |
| **Google Fonts** | Tipografías *Archivo* (títulos) e *Inter* (textos) |

### APIs del navegador utilizadas

| API | Para qué |
|---|---|
| **Geolocation API** (`navigator.geolocation`) | Obtener la ubicación GPS del cliente, solo si da permiso |
| **`window.open`** | Abrir WhatsApp con el mensaje armado |
| **`encodeURIComponent`** | Convertir el mensaje a un formato válido para URL |

### Servicios externos (por enlace)

| Servicio | Cómo se usa |
|---|---|
| WhatsApp (`wa.me`) | Enlace profundo: `https://wa.me/56942710461?text=...` abre el chat con un mensaje prellenado |
| Google Maps | Link con coordenadas (`maps.google.com/?q=lat,lng`) y botón "Cómo llegar" |
| Teléfono (`tel:`) | `tel:+56942710461` abre el marcador del celular |

---

## 3. Arquitectura

### Vista general

```
┌──────────────────────────────────────────────────────────┐
│                 Navegador del cliente                    │
│                                                          │
│   index.html  ──►  css/styles.css   (cómo se ve)         │
│        │                                                 │
│        └──────►  js/main.js         (qué hace)           │
│                      │                                   │
│                      ├─► Geolocation API (GPS)           │
│                      └─► Arma el mensaje                 │
└──────────────────────────┼───────────────────────────────┘
                           │ enlace wa.me / tel:
                           ▼
            ┌──────────────────────────────┐
            │  WhatsApp / teléfono de JyM  │
            └──────────────────────────────┘
```

- **Capa de contenido (HTML):** qué se muestra.
- **Capa de presentación (CSS):** cómo se ve. Todos los colores y fuentes están centralizados en variables.
- **Capa de comportamiento (JS):** qué pasa cuando el usuario interactúa.

Las tres capas están **separadas en archivos distintos**. Puedes cambiar colores sin tocar el contenido, o textos sin tocar la lógica.

### Flujo de una solicitud de grúa

```
Cliente abre la página
        │
        ▼
Completa nombre, vehículo, qué pasó y ubicación
        │
        ├── (opcional) toca "Usar mi ubicación"
        │        └─► el navegador pide permiso ─► se guarda el link de Google Maps
        ▼
Toca "Enviar por WhatsApp"
        │
        ▼
main.js arma el texto ─► lo codifica ─► abre wa.me/56942710461?text=...
        │
        ▼
Se abre WhatsApp con el mensaje listo ─► el cliente solo presiona "Enviar"
```

**Importante:** la página **no envía ni guarda datos**. El mensaje lo envía el propio cliente desde su WhatsApp. Por eso no hay que preocuparse de servidores, bases de datos ni de proteger información personal en el sitio.

---

## 4. Estructura de carpetas y archivos

```
jym-gruas-express/
├── index.html            # Página completa (contenido y estructura)
├── css/
│   └── styles.css        # Todos los estilos
├── js/
│   └── main.js           # Toda la lógica
├── assets/
│   ├── favicon.svg       # Ícono de la pestaña del navegador
│   └── img/              # Carpeta para fotos reales (grúas, equipo)
├── docs/
│   └── MANUAL.md         # Este manual
├── robots.txt            # Instrucciones para buscadores
├── sitemap.xml           # Mapa del sitio para Google
├── .gitignore            # Archivos que Git debe ignorar
└── README.md             # Presentación del proyecto en GitHub
```

### Partes de `index.html`

1. **`<head>`**: título, descripción, etiquetas para redes sociales (Open Graph), favicon, fuentes, hoja de estilos y datos estructurados JSON-LD.
2. **Íconos SVG (`<symbol>`)**: definidos una sola vez al inicio del `<body>` y reutilizados con `<use href="#i-wa"/>`.
3. **Contenido**: barra superior, cabecera, secciones y pie de página.
4. **Botón flotante de WhatsApp y barra móvil.**
5. **`<script src="js/main.js" defer>`**: carga el JavaScript después del HTML.

---

## 5. Estructura de la página (secciones)

| Orden | ID / clase | Sección | Contenido |
|---|---|---|---|
| 1 | `.topbar` | Barra superior | "Disponibles ahora", 24/7 y teléfono |
| 2 | `header` | Cabecera fija | Logo, menú y botones de WhatsApp y llamada |
| 3 | `.hero` | Portada | Título principal, botones de acción, cifras e ilustración de la grúa |
| 4 | `#solicitar` | Solicitud rápida | Formulario que arma el mensaje de WhatsApp |
| 5 | `#servicios` | Servicios | 4 tarjetas: ciudad, carretera, remolque y cobertura |
| 6 | `#como-funciona` | Cómo funciona | 3 pasos |
| 7 | `#conductor` | Conductor designado | Explicación, beneficios y botón de reserva |
| 8 | `#nosotros` | Nosotros y cobertura | Historia desde 2009 y zonas de atención |
| 9 | `#preguntas` | Preguntas frecuentes | Acordeón con `<details>` |
| 10 | `.band` | Llamado final | "¿Estás detenido ahora?" con botones |
| 11 | `#contacto` (`footer`) | Pie de página | Contacto, servicios y redes |
| — | `.fab` / `.mbar` | Botones fijos | WhatsApp flotante (escritorio) y barra Llamar/WhatsApp (celular) |

---

## 6. Sistema de diseño

Todo está en `css/styles.css`, dentro de `:root`. **Para cambiar un color en todo el sitio, basta con cambiar la variable.**

### Colores

| Variable | Valor | Uso |
|---|---|---|
| `--ink` | `#111214` | Negro principal: fondos oscuros y texto |
| `--ink-2` | `#1b1d21` | Negro secundario (tarjetas sobre fondo oscuro) |
| `--ink-3` | `#2a2d33` | Bordes en zonas oscuras |
| `--red` | `#E32B2B` | **Rojo de marca**: botones, acentos, franjas |
| `--red-2` | `#F04A4A` | Rojo al pasar el mouse (*hover*) |
| `--red-dark` | `#B71C1C` | Rojo oscuro para textos pequeños sobre fondo claro |
| `--paper` | `#F3F4F6` | Gris claro de fondo |
| `--muted` | `#6b6f76` | Gris de textos secundarios |
| `--line` | `#E2E4E8` | Gris de bordes |
| `--wa` | `#25D366` | Verde WhatsApp (se mantiene para que se reconozca) |

> Algunos colores también aparecen escritos directamente dentro de los SVG de `index.html` (por ejemplo `#E32B2B` en el dibujo de la grúa). Si cambias el rojo, busca y reemplaza también ese código en `index.html`.

### Tipografía

| Variable | Fuente | Uso |
|---|---|---|
| `--display` | Archivo (700–900) | Títulos, botones y cifras |
| `--body` | Inter (400–600) | Textos y formularios |

Los títulos usan `clamp()` para crecer o achicarse según la pantalla, por ejemplo `font-size: clamp(2.6rem, 6vw, 4.6rem)`.

### Componentes reutilizables

| Clase | Descripción |
|---|---|
| `.wrap` | Contenedor centrado de ancho máximo 1160 px |
| `.btn` | Botón base (redondeado, con ícono) |
| `.btn-red` / `.btn-wa` / `.btn-ghost` / `.btn-ink` | Variantes: rojo, WhatsApp, transparente y negro |
| `.eyebrow` | Texto pequeño en mayúsculas sobre los títulos |
| `.sec-head` | Encabezado de sección (título + bajada) |
| `.svc` | Tarjeta de servicio |
| `.step` | Paso numerado automáticamente con contadores CSS |
| `.badge` | Recuadro con dato destacado |
| `.checks` | Lista con íconos de check |

### Puntos de quiebre (*responsive*)

| Ancho | Cambios |
|---|---|
| > 960 px | Escritorio: menú completo, diseño en columnas |
| ≤ 960 px | Tablet: menú hamburguesa, columnas apiladas, servicios en 2 columnas |
| ≤ 600 px | Celular: servicios en 1 columna, barra fija inferior con Llamar/WhatsApp, botón flotante oculto |

---

## 7. JavaScript: funcionalidades

Archivo: `js/main.js` (unas 70 líneas, sin librerías).

| Bloque | Qué hace |
|---|---|
| `PHONE` | Constante con el número de WhatsApp (`56942710461`) |
| Año automático | Escribe el año actual en el pie de página |
| Menú móvil | Abre y cierra el menú, y actualiza `aria-expanded` para lectores de pantalla |
| Botón GPS | Pide la ubicación con `navigator.geolocation.getCurrentPosition` y guarda un link de Google Maps |
| Formulario | Evita el envío normal (`preventDefault`), arma el mensaje con los datos, lo codifica y abre WhatsApp |

### Notas importantes

- **El GPS solo funciona en HTTPS** (o en `localhost`). En el sitio publicado con HTTPS funciona; al abrir el archivo con doble clic puede que el navegador lo bloquee.
- Si el cliente niega el permiso, el botón muestra "Permiso denegado" y puede escribir la dirección a mano.
- El script se carga con `defer`, así que se ejecuta cuando el HTML ya está listo.

---

## 8. SEO

| Elemento | Dónde | Detalle |
|---|---|---|
| `<title>` | `index.html` | "Grúa en Talca 24 horas \| JyM Grúas Express…" (palabras clave al inicio) |
| `meta description` | `index.html` | Texto que aparece bajo el título en Google |
| Open Graph (`og:*`) | `index.html` | Cómo se ve el link al compartirlo en WhatsApp o Facebook |
| `canonical` | `index.html` | Indica la URL oficial |
| JSON-LD | `index.html` | Tipo `AutomotiveBusiness` con dirección, teléfono, horario 24/7 y zona |
| `robots.txt` | raíz | Permite indexar todo y apunta al sitemap |
| `sitemap.xml` | raíz | Lista de páginas para Google |
| Jerarquía de títulos | todo | Un solo `h1`, secciones con `h2`, tarjetas con `h3` |

**Recomendación clave:** crear o actualizar la ficha de **Google Business Profile** con la misma dirección y teléfono. En búsquedas locales como "grúa Talca", esa ficha pesa tanto como el sitio.

---

## 9. Accesibilidad y rendimiento

**Accesibilidad**
- `lang="es-CL"` en el documento.
- Textos alternativos (`aria-label`, `role="img"`) en ilustraciones e íconos.
- Botón de menú con `aria-expanded` y `aria-controls`.
- Formularios con `<label>` asociados a cada campo.
- El zoom no está bloqueado (el sitio anterior lo bloqueaba).
- Se respeta `prefers-reduced-motion`: si el usuario lo pidió en su sistema, se desactivan las animaciones.

**Rendimiento**
- Sin librerías ni frameworks: muy poco peso.
- Ilustraciones en SVG dentro del HTML, sin descargas de imágenes pesadas.
- Íconos definidos una vez y reutilizados.
- Fuentes con `display=swap` y `preconnect`, así que el texto se ve antes de que cargue la fuente.

> Al agregar fotos reales, usa formato **WebP**, un ancho máximo de unos 1600 px y el atributo `loading="lazy"` (excepto en la foto de la portada).

---

## 10. Cómo hacer cambios comunes

### Cambiar el número de teléfono o WhatsApp

El número aparece en varios lugares. Usa **Buscar y reemplazar** en todo el proyecto (en VS Code: `Ctrl + Shift + H`):

| Buscar | Reemplazar por (ejemplo) | Dónde aparece |
|---|---|---|
| `56942710461` | `569XXXXXXXX` | Enlaces `wa.me`, `tel:`, JSON-LD y `js/main.js` |
| `+56 9 4271 0461` | `+56 9 XXXX XXXX` | Textos visibles |

### Cambiar los colores

Edita las variables en `:root` al inicio de `css/styles.css`. Por ejemplo, para otro tono de rojo:

```css
--red: #D10000;
--red-2: #E52222;
--red-dark: #A00000;
```

Después busca `#E32B2B` en `index.html` y reemplázalo, porque está escrito directamente en los dibujos SVG.

### Agregar fotos reales

1. Guarda las fotos en `assets/img/` (por ejemplo `grua-1.webp`).
2. Reemplaza la ilustración que quieras. Por ejemplo, en el bloque `.driver-visual`:

```html
<div class="driver-visual">
  <img src="assets/img/conductor.webp" alt="Conductor de JyM manejando el auto de un cliente" loading="lazy"
       style="width:100%;height:100%;object-fit:cover">
</div>
```

### Agregar un servicio

Copia una tarjeta dentro de `#servicios` y cambia el texto:

```html
<article class="svc">
  <span class="num">05</span>
  <div class="ico"><svg><use href="#i-hook"/></svg></div>
  <h3>Nuevo servicio</h3>
  <p>Descripción breve del servicio.</p>
</article>
```

### Agregar una pregunta frecuente

Dentro de `.faq`:

```html
<details>
  <summary>¿Tu pregunta?</summary>
  <p>La respuesta.</p>
</details>
```

### Agregar los links de redes sociales

En el `footer`, reemplaza `href="#"` por la URL de Facebook e Instagram.

### Agregar una opción al formulario

En `index.html`, agrega un `<option>` al `<select>` correspondiente (`#f-veh` o `#f-what`). No hay que tocar el JavaScript, porque toma el valor elegido automáticamente.

---

## 11. Publicación

### Opción A: GitHub Pages (gratis)

1. Sube el proyecto a GitHub (ver la sección 12).
2. En el repositorio: **Settings → Pages**.
3. En *Source* elige la rama `main` y la carpeta `/ (root)`. Guarda.
4. En uno o dos minutos queda publicado en `https://TU-USUARIO.github.io/jym-gruas-express/`.
5. Para usar el dominio `jymgruasexpress.cl`: en **Settings → Pages → Custom domain** escribe el dominio, y en el panel del proveedor del dominio crea los registros DNS que indica GitHub. Activa **Enforce HTTPS**.

### Opción B: Netlify o Vercel (gratis)

1. Crea una cuenta y elige "Importar desde GitHub".
2. Selecciona el repositorio. No requiere comando de *build* y la carpeta de publicación es la raíz.
3. Configura el dominio propio desde su panel.

### Opción C: el hosting actual (cPanel)

El dominio hoy usa WordPress. Para reemplazarlo:

1. **Haz un respaldo completo** del WordPress actual (archivos y base de datos) antes de tocar nada.
2. Entra al **Administrador de archivos** de cPanel, en `public_html`.
3. Mueve el WordPress a una carpeta de respaldo, o elimina sus archivos solo si ya tienes el respaldo.
4. Sube `index.html`, `robots.txt`, `sitemap.xml` y las carpetas `css`, `js` y `assets`.
5. Verifica que el certificado SSL (HTTPS) esté activo.

> Después de publicar, entra a **Google Search Console**, agrega el dominio y envía `https://jymgruasexpress.cl/sitemap.xml`.

---

## 12. Flujo de trabajo con Git y GitHub

### Primera vez

```bash
cd jym-gruas-express
git init
git add .
git commit -m "Versión inicial del sitio JyM Grúas Express"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/jym-gruas-express.git
git push -u origin main
```

Antes de esto, crea el repositorio vacío en GitHub (**New repository**, sin README).

### Cambios posteriores

```bash
git add .
git commit -m "Describe el cambio, ej: Actualiza teléfono"
git push
```

Si usas GitHub Pages, Netlify o Vercel, cada `git push` actualiza el sitio publicado automáticamente.

### Convención sugerida para los mensajes

| Prefijo | Uso |
|---|---|
| `feat:` | Nueva funcionalidad o sección |
| `fix:` | Corrección de un error |
| `style:` | Cambios visuales (colores, espacios) |
| `content:` | Cambios de textos, fotos o datos |
| `docs:` | Cambios en la documentación |

---

## 13. Pendientes antes de publicar

- [ ] Confirmar el número correcto: la web anterior mostraba `+56 9 4271 0461` y `+56 9 4271 0641`.
- [ ] Agregar fotos reales de las grúas y del equipo en `assets/img/`.
- [ ] Agregar los links de Facebook e Instagram.
- [ ] Confirmar la zona de cobertura y los textos de "Nosotros".
- [ ] Revisar que el correo `alex.orellana@jymgruasexpress.cl` siga vigente.
- [ ] Crear una imagen para compartir (`og:image`, de 1200 × 630 px) y agregarla al `<head>`.
- [ ] Publicar con HTTPS y probar el botón de GPS desde un celular.
- [ ] Enviar el sitemap a Google Search Console.

---

## 14. Mejoras futuras

| Mejora | Descripción |
|---|---|
| Reseñas reales | Mostrar reseñas de Google Business Profile (nunca inventadas) |
| Medición | Google Analytics o Plausible, y eventos al tocar Llamar o WhatsApp |
| Galería | Sección con fotos de trabajos realizados |
| Páginas por servicio | Páginas separadas por servicio o ciudad (ej. "Grúa en Linares") para posicionar en más búsquedas |
| Panel de solicitudes | Guardar las solicitudes en una base de datos con estados (recibida, en camino, finalizada) |
| Tarifas referenciales | Mostrar precios desde, si el negocio lo decide |
| Botón "Compartir ubicación en vivo" | Instrucciones para que el cliente comparta su ubicación en tiempo real por WhatsApp |
