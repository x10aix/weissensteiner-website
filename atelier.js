'use strict';
const drawingScene = document.querySelector('.drawing-scene');
const drawingRange = document.getElementById('drawing-range');
function revealDrawing(value) {
  const amount = Math.max(0, Math.min(100, Number(value)));
  drawingRange.value = amount;
  drawingScene.style.setProperty('--drawing', amount + '%');
  drawingRange.setAttribute('aria-valuetext', amount + ' Prozent Plan, ' + (100 - amount) + ' Prozent Foto');
  document.querySelectorAll('[data-drawing]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.drawing) === amount)));
}
drawingRange.addEventListener('input', () => revealDrawing(drawingRange.value));
document.querySelectorAll('[data-drawing]').forEach(button => button.addEventListener('click', () => revealDrawing(button.dataset.drawing)));
revealDrawing(drawingRange.value);
const drawingImages = document.querySelector('.scene-images');
let drawingPointer = null;
function moveDrawing(event) {
  const bounds = drawingImages.getBoundingClientRect();
  revealDrawing((event.clientX - bounds.left) / bounds.width * 100);
}
drawingImages.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  drawingPointer = event.pointerId;
  drawingImages.setPointerCapture(event.pointerId);
  moveDrawing(event);
});
drawingImages.addEventListener('pointermove', event => {
  if (event.pointerId === drawingPointer) moveDrawing(event);
});
for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  drawingImages.addEventListener(eventName, () => {drawingPointer = null;});
}
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target);}
    });
  }, {threshold: 0.08});
  document.querySelectorAll('.section-head, .project-layout, .steps li, .prep-list > div, .office').forEach(element => {
    element.classList.add('will-reveal'); revealObserver.observe(element);
  });
}
