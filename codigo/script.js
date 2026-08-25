// =========================================================
// PORTAFOLIO — ANGEL RUEDA — interactividad
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // ---- Año dinámico en el footer ----
  document.getElementById('anioActual').textContent = new Date().getFullYear();

  // ---- Menú móvil ----
  const botonMenu = document.getElementById('menuToggle');
  const nav = document.getElementById('navPrincipal');

  botonMenu.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', String(abierto));
  });

  // Cierra el menú móvil al elegir una sección
  nav.querySelectorAll('.nav__enlace').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      nav.classList.remove('abierto');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Resaltar el enlace de la sección visible ----
  const secciones = document.querySelectorAll('main .plano');
  const enlacesNav = document.querySelectorAll('.nav__enlace');

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const id = entrada.target.getAttribute('id');
          enlacesNav.forEach((enlace) => {
            enlace.classList.toggle('activo', enlace.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  secciones.forEach((seccion) => observador.observe(seccion));

  // ---- Animar las barras de habilidades al entrar en pantalla ----
  const barras = document.querySelectorAll('.medidor__barra');
  const observadorBarras = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const barra = entrada.target;
          barra.style.width = `${barra.dataset.nivel}%`;
          obs.unobserve(barra);
        }
      });
    },
    { threshold: 0.4 }
  );
  barras.forEach((barra) => observadorBarras.observe(barra));

  // ---- Modo "papel" (whiteprint) con memoria en el navegador ----
  const botonModo = document.getElementById('modoToggle');
  const modoGuardado = localStorage.getItem('portafolio-modo');

  const aplicarModo = (papel) => {
    document.body.classList.toggle('modo-papel', papel);
    botonModo.setAttribute('aria-pressed', String(papel));
    botonModo.querySelector('.modo-toggle__texto').textContent = papel ? 'Modo plano' : 'Modo papel';
  };

  aplicarModo(modoGuardado === 'papel');

  botonModo.addEventListener('click', () => {
    const esPapel = !document.body.classList.contains('modo-papel');
    aplicarModo(esPapel);
    localStorage.setItem('portafolio-modo', esPapel ? 'papel' : 'plano');
  });

  // ---- Formulario de contacto: validación con mensajes propios ----
  const formulario = document.getElementById('formularioContacto');
  const estadoFormulario = document.getElementById('formularioEstado');

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      estadoFormulario.textContent = '⚠ Revisa los campos marcados: falta información válida.';
      estadoFormulario.style.color = '#ff6b6b';
      formulario.reportValidity();
      return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    estadoFormulario.textContent = `✔ Gracias, ${nombre}. Este formulario es una demo (sin backend todavía) — tu mensaje no se envió a ningún servidor.`;
    estadoFormulario.style.color = '';
    formulario.reset();
  });
});