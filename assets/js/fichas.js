/* Las fichas: dos cosas pequeñas y nada más.
   1) El botón «Abrir el asistente» de la ficha de agentes abre el mismo
      chat que la burbuja de la esquina. La demo de un agente es el agente,
      no un vídeo de un agente.
   2) La pista de «bajar la página» desaparece en cuanto alguien baja, que
      es cuando ya sobra. */
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-abre-chat]');
    if (!b) return;
    var burbuja = document.getElementById('chat-bubble');
    if (burbuja) burbuja.click();
  });

  var marcos = document.querySelectorAll('.fi-marco');
  for (var i = 0; i < marcos.length; i++) (function (marco) {
    var vista = marco.querySelector('.fi-viewport');
    if (!vista) return;
    vista.addEventListener('scroll', function () {
      marco.classList.toggle('es-bajado', vista.scrollTop > 24);
    }, { passive: true });
  })(marcos[i]);
})();
