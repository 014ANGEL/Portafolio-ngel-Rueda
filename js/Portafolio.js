export class Portafolio {
  constructor(datos) {
    this.datos = datos;
  }

  cargar() {
    this.pintarFrase();
    this.pintarHabilidades();
  }

  pintarFrase() {
    const nodo = document.getElementById('frase');
    if (!nodo) return;
    nodo.textContent = this.datos.perfil.frase;
  }

  pintarHabilidades() {
    const lista = document.getElementById('listaHabilidades');
    if (!lista) return;

    lista.replaceChildren();

    this.datos.habilidades.forEach((habilidad) => {
      const item = document.createElement('li');
      item.className = 'medidor';
      item.innerHTML = `
        <div class="medidor__etiqueta">
          <span></span>
          <span></span>
        </div>
        <div class="medidor__pista" role="meter" aria-valuemin="0" aria-valuemax="100">
          <div class="medidor__barra"></div>
        </div>
      `;
      item.querySelector('.medidor__etiqueta span:first-child').textContent = habilidad.nombre;
      item.querySelector('.medidor__etiqueta span:last-child').textContent = `${habilidad.nivel}%`;
      const pista = item.querySelector('.medidor__pista');
      pista.setAttribute('aria-label', habilidad.nombre);
      pista.setAttribute('aria-valuenow', String(habilidad.nivel));
      item.querySelector('.medidor__barra').dataset.nivel = String(habilidad.nivel);
      lista.append(item);
    });
  }
}
