export function iniciarUI() {
  const anio = document.getElementById('anioActual');
  if (anio) anio.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const botonMenu = document.getElementById('menuToggle');
  const nav = document.getElementById('navPrincipal');
  const textoMenu = document.getElementById('menuToggleTexto');

  const cerrarMenu = () => {
    nav.classList.remove('abierto');
    botonMenu.setAttribute('aria-expanded', 'false');
    if (textoMenu) textoMenu.textContent = 'Abrir menú';
  };

  botonMenu.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', String(abierto));
    if (textoMenu) textoMenu.textContent = abierto ? 'Cerrar menú' : 'Abrir menú';
  });

  nav.querySelectorAll('.nav__enlace').forEach((enlace) => {
    enlace.addEventListener('click', cerrarMenu);
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cerrarMenu();
  });

  document.addEventListener('click', (evento) => {
    if (!nav.contains(evento.target) && !botonMenu.contains(evento.target)) {
      cerrarMenu();
    }
  });

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

  const botonModo = document.getElementById('modoToggle');
  const modoGuardado = localStorage.getItem('portafolio-modo');
  const temaColor = document.querySelector('meta[name="theme-color"]');

  const aplicarModo = (papel) => {
    document.body.classList.toggle('modo-papel', papel);
    botonModo.setAttribute('aria-pressed', String(papel));
    botonModo.querySelector('.modo-toggle__texto').textContent = papel ? 'Modo plano' : 'Modo papel';
    if (temaColor) temaColor.setAttribute('content', papel ? '#efe6d4' : '#061018');
  };

  aplicarModo(modoGuardado === 'papel');

  botonModo.addEventListener('click', () => {
    const esPapel = !document.body.classList.contains('modo-papel');
    aplicarModo(esPapel);
    localStorage.setItem('portafolio-modo', esPapel ? 'papel' : 'plano');
  });

  const barras = document.querySelectorAll('.medidor__barra');
  const observadorBarras = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const barra = entrada.target;
          barra.style.width = `${barra.dataset.nivel}%`;
          observadorBarras.unobserve(barra);
        }
      });
    },
    { threshold: 0.4 }
  );
  barras.forEach((barra) => observadorBarras.observe(barra));

  if (!reduceMotion) {
    document.querySelectorAll('.tarjeta').forEach((tarjeta) => {
      tarjeta.addEventListener('mousemove', (evento) => {
        const caja = tarjeta.getBoundingClientRect();
        const x = (evento.clientX - caja.left) / caja.width;
        const y = (evento.clientY - caja.top) / caja.height;
        const rotY = (x - 0.5) * 16;
        const rotX = (0.5 - y) * 12;
        tarjeta.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(18px)`;
      });

      tarjeta.addEventListener('mouseleave', () => {
        tarjeta.style.transform = '';
      });
    });
  }

  const progreso = document.getElementById('progresoScroll');
  const irArriba = document.getElementById('irArriba');
  const actualizarProgreso = () => {
    const maximo = document.documentElement.scrollHeight - window.innerHeight;
    const valor = maximo > 0 ? Math.round((window.scrollY / maximo) * 100) : 0;
    progreso.style.width = `${valor}%`;
    progreso.setAttribute('aria-valuenow', String(valor));
    irArriba.hidden = window.scrollY < 400;
  };
  window.addEventListener('scroll', actualizarProgreso, { passive: true });
  actualizarProgreso();
  irArriba.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const foco = document.getElementById('foco');
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (evento) => {
      foco.style.left = `${evento.clientX}px`;
      foco.style.top = `${evento.clientY}px`;
    });
  } else {
    foco.hidden = true;
  }

  const maquina = document.getElementById('textoMaquina');
  if (maquina) {
    const frases = maquina.dataset.frases.split('|');
    let indiceFrase = 0;
    let indiceLetra = 0;
    let borrando = false;

    const escribir = () => {
      const frase = frases[indiceFrase];
      maquina.textContent = frase.slice(0, indiceLetra);

      if (!borrando && indiceLetra < frase.length) {
        indiceLetra += 1;
        window.setTimeout(escribir, reduceMotion ? 0 : 54);
        return;
      }

      if (!borrando && indiceLetra === frase.length) {
        borrando = true;
        window.setTimeout(escribir, reduceMotion ? 0 : 1400);
        return;
      }

      if (borrando && indiceLetra > 0) {
        indiceLetra -= 1;
        window.setTimeout(escribir, reduceMotion ? 0 : 28);
        return;
      }

      borrando = false;
      indiceFrase = (indiceFrase + 1) % frases.length;
      window.setTimeout(escribir, reduceMotion ? 0 : 220);
    };

    escribir();
  }

  const animarContador = (nodo) => {
    const destino = Number(nodo.dataset.contador);
    const duracion = reduceMotion ? 0 : 900;
    const inicio = performance.now();

    const tick = (ahora) => {
      const t = duracion === 0 ? 1 : Math.min((ahora - inicio) / duracion, 1);
      nodo.textContent = String(Math.round(destino * t));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observadorStats = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        animarContador(entrada.target);
        observadorStats.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-contador]').forEach((nodo) => observadorStats.observe(nodo));

  const cubo = document.getElementById('cubo');
  cubo?.addEventListener('click', () => {
    const pausado = cubo.classList.toggle('pausado');
    cubo.setAttribute('aria-pressed', String(pausado));
  });

  const avatar = document.getElementById('avatarVoltear');
  avatar?.addEventListener('click', () => {
    const volteado = avatar.getAttribute('aria-pressed') === 'true';
    avatar.setAttribute('aria-pressed', String(!volteado));
  });

  document.querySelectorAll('.filtro').forEach((boton) => {
    boton.addEventListener('click', () => {
      const filtro = boton.dataset.filtro;
      document.querySelectorAll('.filtro').forEach((otro) => {
        const activo = otro === boton;
        otro.classList.toggle('activo', activo);
        otro.setAttribute('aria-pressed', String(activo));
      });

      document.querySelectorAll('.tarjeta').forEach((tarjeta) => {
        const tags = tarjeta.dataset.tags || '';
        const visible = filtro === 'todos' || tags.includes(filtro);
        tarjeta.classList.toggle('oculta', !visible);
      });
    });
  });

  const proyectos = {
    equipo: {
      titulo: 'Proyecto de equipo — SENA',
      texto: 'Un trabajo colaborativo con compañeros de ficha. Aquí practico HTML, CSS y el flujo de Git para no pisarnos el código.'
    },
    portafolio: {
      titulo: 'Este portafolio',
      texto: 'Una página con HTML semántico, CSS en volumen y JavaScript para menú, tema, filtros, terminal y formularios. Sin frameworks.'
    },
    laboratorio: {
      titulo: 'Laboratorio interactivo',
      texto: 'Zona de pruebas: terminal con comandos, línea de tiempo clicable y efectos 3D. Sirve para mostrar que el sitio responde al usuario.'
    }
  };

  const modal = document.getElementById('modalProyecto');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalTexto = document.getElementById('modalTexto');

  document.querySelectorAll('[data-modal]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const dato = proyectos[boton.dataset.modal];
      if (!dato) return;
      modalTitulo.textContent = dato.titulo;
      modalTexto.textContent = dato.texto;
      modal.showModal();
    });
  });

  const pasos = [
    'Estructura semántica: header, main, section y footer.',
    'Volumen, perspectiva y un tema claro/oscuro con variables.',
    'Menú, filtros, terminal y barras que se animan al aparecer.'
  ];
  const detalle = document.getElementById('lineaDetalle');
  document.querySelectorAll('.linea-tiempo__nodo').forEach((boton) => {
    boton.addEventListener('click', () => {
      document.querySelectorAll('.linea-tiempo__nodo').forEach((otro) => {
        const activo = otro === boton;
        otro.classList.toggle('activo', activo);
        otro.setAttribute('aria-pressed', String(activo));
      });
      detalle.textContent = pasos[Number(boton.dataset.paso)];
    });
  });

  const salida = document.getElementById('terminalSalida');
  const formTerminal = document.getElementById('formularioTerminal');
  const inputTerminal = document.getElementById('comandoTerminal');
  const imprimir = (texto, clase = '') => {
    const linea = document.createElement('p');
    if (clase) linea.className = clase;
    linea.textContent = texto;
    salida.append(linea);
    salida.scrollTop = salida.scrollHeight;
  };

  const comandos = {
    help: () => imprimir('comandos: help, sobre, proyectos, skills, contacto, tema, hola, clear'),
    sobre: () => imprimir('Angel Rueda · aprendiz ADSO en el SENA de Bucaramanga'),
    proyectos: () => imprimir('3 piezas: equipo SENA, este portafolio y el laboratorio'),
    skills: () => imprimir('HTML 80 · CSS 70 · JavaScript 55 · Git 65'),
    contacto: () => {
      imprimir('abre la sección de contacto');
      document.getElementById('contacto').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    },
    tema: () => botonModo.click(),
    hola: () => imprimir('hola. prueba help si quieres el mapa'),
    clear: () => { salida.replaceChildren(); }
  };

  formTerminal.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const comando = inputTerminal.value.trim().toLowerCase();
    if (!comando) return;
    imprimir(`❯ ${comando}`, 'cmd');
    const accion = comandos[comando];
    if (accion) accion();
    else imprimir(`comando no encontrado: ${comando}`);
    inputTerminal.value = '';
  });

  const mensaje = document.getElementById('mensaje');
  const contador = document.getElementById('contadorMensaje');
  const actualizarContador = () => {
    contador.textContent = String(mensaje.value.length);
  };
  mensaje.addEventListener('input', actualizarContador);
  mensaje.form.addEventListener('reset', actualizarContador);
  actualizarContador();

  const copiar = document.getElementById('copiarCorreo');
  copiar.addEventListener('click', async () => {
    const correo = copiar.dataset.correo;
    try {
      await navigator.clipboard.writeText(correo);
      copiar.textContent = 'Copiado';
    } catch {
      copiar.textContent = 'No se pudo copiar';
    }
    window.setTimeout(() => { copiar.textContent = 'Copiar'; }, 1600);
  });

  const botonImprimir = document.getElementById('imprimirCV');
  botonImprimir?.addEventListener('click', () => window.print());
}
