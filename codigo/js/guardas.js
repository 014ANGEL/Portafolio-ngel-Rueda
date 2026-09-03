// TAREA 1 — Cláusulas de guarda (15 pts)
//
// ANTES (anidado, forma de flecha):
// function publicarComentario(usuario, texto) {
//   if (usuario) {
//     if (usuario.activo) {
//       if (texto.length > 0) {
//         console.log(usuario.nombre + " dijo: " + texto);
//       }
//     }
//   }
// }
//
// AHORA: si algo falla, return inmediato. Un solo nivel. El caso bueno al final.

export function publicarComentario(usuario, texto) {
  if (!usuario) return;
  if (!usuario.activo) return;
  if (!texto || texto.length === 0) return;

  console.log(usuario.nombre + " dijo: " + texto);
}
