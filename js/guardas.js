// Cláusulas de guarda: si algo falta, salimos YA.
// Así el caso bueno queda al final y no hay ifs anidados.

export function publicarComentario(usuario, texto) {
  if (!usuario) return;
  if (!usuario.activo) return;
  if (!texto || texto.length === 0) return;

  console.log(usuario.nombre + " dijo: " + texto);
}
