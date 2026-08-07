// Diagram slide viewer: tabs, prev/next, arrow keys, three sizes —
// framed (default), wide (fills the browser viewport), and OS
// fullscreen. Shared by every architecture entry page.
(function () {
  var viewer = document.getElementById('dwg-viewer');
  if (!viewer) return;
  var stage = viewer.querySelector('.viewer-stage');
  var slides = Array.prototype.slice.call(viewer.querySelectorAll('.diagram'));
  var tabbar = viewer.querySelector('.viewer-tabs');
  var count = viewer.querySelector('.count');
  var wideBtn = viewer.querySelector('[data-act="wide"]');
  var idx = 0;

  var tabs = slides.map(function (s, i) {
    var b = document.createElement('button');
    b.className = 'vt';
    b.setAttribute('role', 'tab');
    b.textContent = s.dataset.code;
    b.title = s.querySelector('figcaption').textContent;
    b.addEventListener('click', function () { show(i); });
    tabbar.appendChild(b);
    return b;
  });

  function show(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach(function (s, j) { s.classList.toggle('current', j === idx); });
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === idx ? 'true' : 'false'); });
    count.textContent = slides[idx].dataset.code + ' · ' + (idx + 1) + ' / ' + slides.length;
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) { document.exitFullscreen(); }
    else if (stage.requestFullscreen) { stage.requestFullscreen(); }
  }

  function toggleWide() {
    var wide = viewer.classList.toggle('wide');
    if (wideBtn) wideBtn.textContent = wide ? '⤡ Narrow' : '⤢ Wide';
  }

  viewer.querySelector('[data-act="prev"]').addEventListener('click', function () { show(idx - 1); });
  viewer.querySelector('[data-act="next"]').addEventListener('click', function () { show(idx + 1); });
  viewer.querySelector('[data-act="fs"]').addEventListener('click', toggleFullscreen);
  if (wideBtn) wideBtn.addEventListener('click', toggleWide);

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') { show(idx - 1); }
    else if (e.key === 'ArrowRight') { show(idx + 1); }
    else if (e.key === 'f' || e.key === 'F') { toggleFullscreen(); }
    else if (e.key === 'w' || e.key === 'W') { toggleWide(); }
  });

  viewer.classList.add('enhanced');
  show(0);
})();
