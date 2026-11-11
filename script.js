// Número de WhatsApp (formato internacional sin "+"). DEMO: reemplazar por el real.
const WHATSAPP = '56900000000';

// Año en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Cerrar aviso de demo
document.querySelector('.demo-bar__close')?.addEventListener('click', (e) => {
  e.currentTarget.parentElement.remove();
});

// Menú móvil
const header = document.querySelector('.header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  header.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
};
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// Animación de aparición + contadores
const counters = document.querySelectorAll('[data-count]');
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const dur = 1400;
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const val = Math.round(target * (1 - Math.pow(1 - p, 3)));
    el.textContent = (target >= 1000 ? '+' : '') + val.toLocaleString('es-CL');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const revealTargets = document.querySelectorAll('.card, .steps li, .review, .features li, .section__head, .why > div, .form');
if ('IntersectionObserver' in window) {
  revealTargets.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll?.('[data-count]').forEach(animateCount);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((el) => io.observe(el));
} else {
  counters.forEach((el) => { el.textContent = el.dataset.count; });
}

// Formulario → WhatsApp
const form = document.getElementById('quote-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach((input) => {
    const bad = !input.value.trim();
    input.classList.toggle('invalid', bad);
    if (bad) ok = false;
  });
  if (!ok) return;
  const d = Object.fromEntries(new FormData(form));
  const text = [
    `Hola, soy ${d.nombre}.`,
    `Necesito: ${d.servicio}${d.comuna ? ` en ${d.comuna}` : ''}.`,
    d.mensaje && `Detalle: ${d.mensaje}`,
    `Mi teléfono: ${d.telefono}`,
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
