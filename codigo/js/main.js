// 7
// TAREA 1 a 5 del desafío de código — Clase 04
import { publicarComentario } from './guardas.js';
import { Portafolio } from './Portafolio.js';
import { Reloj } from './Reloj.js';
import { Contacto } from './Contacto.js';
import { iniciarUI } from './ui.js';

async function iniciar() {
  // TAREA 2: los datos salen de JSON, no del HTML
  const respuesta = await fetch('datos.json');
  if (!respuesta.ok) {
    throw new Error('No se pudo leer datos.json. Abre la carpeta codigo/ con Live Server.');
  }

  const datos = await respuesta.json();
  const app = new Portafolio(datos);
  app.cargar();

  iniciarUI();

  // TAREA 3: el reloj vive en su archivo; aquí solo se usa
  const reloj = new Reloj('#reloj');
  reloj.arrancar();

  // TAREA 4: el formulario lo controla la clase Contacto
  const formulario = document.getElementById('formularioContacto');
  new Contacto(formulario);

  // TAREA 1: pruebo las guardas (mira la consola F12)
  publicarComentario(
    { nombre: 'Angel', activo: true },
    'Portafolio listo con guardas, JSON y módulos.'
  );
}

iniciar().catch((error) => {
  console.error(error);
});
