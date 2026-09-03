// 7
// Candado: (8 - 4) / 2 + 5 = 4 / 2 + 5 = 2 + 5 = 7
import { publicarComentario } from './guardas.js';
import { Portafolio } from './Portafolio.js';
import { Reloj } from './Reloj.js';
import { Contacto } from './Contacto.js';
import { iniciarUI } from './ui.js';

async function iniciar() {
  const respuesta = await fetch('datos.json');
  if (!respuesta.ok) {
    throw new Error('No se pudo leer datos.json. Abre el sitio con Live Server.');
  }

  const datos = await respuesta.json();
  const app = new Portafolio(datos);
  app.cargar();

  iniciarUI();

  const reloj = new Reloj('#reloj');
  reloj.arrancar();

  const formulario = document.getElementById('formularioContacto');
  new Contacto(formulario);

  publicarComentario(
    { nombre: 'Angel', activo: true },
    'Portafolio listo con guardas, JSON y módulos.'
  );
}

iniciar().catch((error) => {
  console.error(error);
});
