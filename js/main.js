/* ==========================================================
   JyM Grúas Express – Lógica del sitio
   JavaScript puro (sin librerías). Ver docs/MANUAL.md.
   ========================================================== */

// Número de WhatsApp en formato internacional, sin "+" ni espacios.
const PHONE = '56942710461';

// Link de Google Maps con la ubicación GPS del cliente (si la comparte).
let mapsLink = '';

/* ---------- Año automático en el pie de página ---------- */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ---------- Menú móvil ---------- */
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

// Cierra el menú al tocar un enlace.
nav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  })
);

/* ---------- Ubicación GPS (Geolocation API) ---------- */
const locBtn = document.getElementById('loc-btn');

locBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    locBtn.textContent = 'No disponible';
    return;
  }
  locBtn.textContent = 'Buscando…';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      mapsLink = `https://maps.google.com/?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
      const input = document.getElementById('f-loc');
      if (!input.value) input.value = 'Mi ubicación actual (GPS)';
      locBtn.textContent = '✓ Ubicación lista';
      locBtn.classList.add('ok');
    },
    () => { locBtn.textContent = 'Permiso denegado'; },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

/* ---------- Formulario → mensaje de WhatsApp ---------- */
document.getElementById('req').addEventListener('submit', e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();

  let msg =
    `Hola JyM, necesito una grúa.\n\n` +
    `👤 Nombre: ${v('f-name')}\n` +
    `🚗 Vehículo: ${v('f-veh')}\n` +
    `⚠️ Qué pasó: ${v('f-what')}\n` +
    `📍 Ubicación: ${v('f-loc')}`;
  if (mapsLink) msg += `\n🗺️ GPS: ${mapsLink}`;

  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
});
