# JyM Grúas Express – Sitio web

Sitio web de **JyM Grúas Express**, servicio de grúa 24/7 en Talca y la Región del Maule (Chile).

Es una página estática (una sola página con secciones), rápida y pensada primero para celular. Su objetivo es que una persona con el auto en panne pueda **llamar o pedir la grúa por WhatsApp en segundos**, incluso enviando su ubicación GPS.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## Características

- Formulario "Pide tu grúa en 30 segundos" que arma el mensaje y abre WhatsApp con los datos del cliente.
- Botón **"Usar mi ubicación"** que agrega un link de Google Maps con la posición GPS.
- Botones de llamada y WhatsApp siempre visibles (barra fija en celular y botón flotante en escritorio).
- Secciones: servicios, cómo funciona, conductor designado, nosotros, cobertura, preguntas frecuentes y contacto.
- SEO local: título y descripción optimizados, datos estructurados de Schema.org, `robots.txt` y `sitemap.xml`.
- Accesible: textos alternativos, etiquetas ARIA, navegación por teclado y respeto por `prefers-reduced-motion`.
- Sin frameworks, sin dependencias y sin paso de compilación.

## Estructura

```
jym-gruas-express/
├── index.html          # Estructura y contenido de la página
├── css/styles.css      # Estilos y sistema de diseño
├── js/main.js          # Menú móvil, GPS y formulario → WhatsApp
├── assets/
│   ├── favicon.svg     # Ícono de la pestaña
│   └── img/            # Fotos del negocio (agregar aquí)
├── docs/MANUAL.md      # Manual técnico completo
├── robots.txt
└── sitemap.xml
```

## Verlo en tu computador

No necesita instalar nada: abre `index.html` con doble clic.

Para probarlo como en un servidor real (recomendado para la función GPS):

```bash
# Con Python
python -m http.server 8000
# Luego abre http://localhost:8000
```

O usa la extensión **Live Server** de Visual Studio Code.

## Publicar

Puedes publicarlo en GitHub Pages, Netlify, Vercel o en el hosting actual del dominio. Los pasos están en [docs/MANUAL.md](docs/MANUAL.md#11-publicación).

## Documentación

Lee el **[manual técnico](docs/MANUAL.md)** para conocer los lenguajes, la arquitectura, el sistema de diseño y cómo hacer cambios comunes, como el teléfono, los colores, las fotos o los servicios.

## Contacto del negocio

- Teléfono / WhatsApp: +56 9 4271 0461
- Correo: alex.orellana@jymgruasexpress.cl
- Dirección: 10 Oriente esquina 3 Sur, Talca
