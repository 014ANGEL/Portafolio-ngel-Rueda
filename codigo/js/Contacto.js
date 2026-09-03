// TAREA 4 — Validación con guardas + fetch (15 pts)
// Si el mensaje trae http:// o https://, aviso y salgo con return.
// Solo si pasa la guarda se hace el fetch.

export class Contacto {
  constructor(formulario) {
    this.formulario = formulario;
    this.estado = document.getElementById('formularioEstado');
    this.formulario.addEventListener('submit', (evento) => this.enviar(evento));
  }

  avisar(texto, esError = true) {
    this.estado.textContent = texto;
    this.estado.classList.toggle('es-error', esError);
  }

  contieneEnlace(texto) {
    return /https?:\/\//i.test(texto);
  }

  async enviar(evento) {
    evento.preventDefault();

    const nombre = this.formulario.nombre.value.trim();
    const correo = this.formulario.correo.value.trim();
    const mensaje = this.formulario.mensaje.value.trim();

    if (!this.formulario.checkValidity()) {
      this.avisar('Revisa los campos marcados: falta información válida.');
      this.formulario.reportValidity();
      return;
    }

    if (this.contieneEnlace(mensaje)) {
      this.avisar('El mensaje parece spam: no se permiten enlaces (http/https).');
      return;
    }

    try {
      const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, mensaje })
      });

      if (!respuesta.ok) {
        this.avisar('No se pudo enviar. Intenta de nuevo.');
        return;
      }

      this.avisar(`Gracias, ${nombre}. Tu mensaje se envió (demo con fetch).`, false);
      this.formulario.reset();
      this.formulario.dispatchEvent(new Event('reset'));
    } catch {
      this.avisar('Sin conexión: el mensaje no salió. Abre codigo/ con Live Server.');
    }
  }
}
