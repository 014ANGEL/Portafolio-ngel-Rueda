// TAREA 3 — Clase Reloj (POO + módulo) (15 pts)
// Esta clase muestra la hora en el footer y la va actualizando sola.
// Yo le paso el id del reloj, pinto la hora con Date y cada segundo
// setInterval vuelve a llamar pintar() para que se vean los segundos pasar.

export class Reloj {
  constructor(selector) {
    this.nodo = document.querySelector(selector);
    this.idIntervalo = null;
  }

  arrancar() {
    if (!this.nodo) return;
    this.pintar();
    this.idIntervalo = window.setInterval(() => this.pintar(), 1000);
  }

  pintar() {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    this.nodo.textContent = hora;
    this.nodo.setAttribute('datetime', ahora.toISOString());
  }

  detener() {
    if (!this.idIntervalo) return;
    window.clearInterval(this.idIntervalo);
    this.idIntervalo = null;
  }
}
