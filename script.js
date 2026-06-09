(function () {
  'use strict';

  const vid       = document.getElementById('vid');
  const vidTag    = document.getElementById('vid-tag');
  const ovPlay    = document.getElementById('ov-play');
  const ovChoice  = document.getElementById('ov-choice');
  const ovEnd     = document.getElementById('ov-end');
  const endMsg    = document.getElementById('end-msg');
  const fill      = document.getElementById('progress-fill');
  const dot0      = document.getElementById('dot-0');
  const dotA      = document.getElementById('dot-a');
  const dotB      = document.getElementById('dot-b');
  const btnPlay   = document.getElementById('btn-play');
  const btnA      = document.getElementById('btn-a');
  const btnB      = document.getElementById('btn-b');
  const btnReplay = document.getElementById('btn-replay');
  const btnOther  = document.getElementById('btn-other');

  const SRC = {
    intro: 'videos/video1_intro.mp4',
    pathA: 'videos/video2_brancha.mp4',
    pathB: 'videos/video3_branchb.mp4',
  };

  const END_MSG = {
    pathA: 'You stayed with the wildlife trail.\nThe walk became slower and more watchful.',
    pathB: 'You followed the rainy detour.\nThe path changed, but the walk continued.',
  };

  let phase = 'intro';

  function setDot(p) {
    [dot0, dotA, dotB].forEach(d => d.classList.remove('dot-active'));
    if (p === 'intro') dot0.classList.add('dot-active');
    if (p === 'pathA') dotA.classList.add('dot-active');
    if (p === 'pathB') dotB.classList.add('dot-active');
  }

  function showOverlay(which) {
    [ovPlay, ovChoice, ovEnd].forEach(o => o.classList.add('hidden'));
    if (which) which.classList.remove('hidden');
  }

  function tryPlay() {
    return vid.play().catch(() => {
      // Autoplay blocked — surface play button so user can tap
      showOverlay(ovPlay);
    });
  }

  function loadAndPlay(src, tag, p) {
    phase = p;
    vid.src = src;
    vid.load();
    vidTag.textContent = tag;
    setDot(p);
    fill.style.width = '0%';
    showOverlay(null);
    // Wait for the video to be ready before playing
    vid.addEventListener('canplay', function handler() {
      vid.removeEventListener('canplay', handler);
      tryPlay();
    });
  }

  // ── Initial state ─────────────────────────────────────────────────────────
  setDot('intro');
  showOverlay(ovPlay);

  // Video load error — surface play button
  vid.addEventListener('error', () => showOverlay(ovPlay));

  // ── First play button ─────────────────────────────────────────────────────
  ovPlay.addEventListener('click', () => {
    ovPlay.classList.add('fade-out');
    setTimeout(() => showOverlay(null), 280);
    vid.play().catch(() => {
      ovPlay.classList.remove('fade-out');
      showOverlay(ovPlay);
    });
  });

  // ── Progress bar ──────────────────────────────────────────────────────────
  vid.addEventListener('timeupdate', () => {
    if (vid.duration) fill.style.width = (vid.currentTime / vid.duration * 100) + '%';
  });

  // ── Video ended ───────────────────────────────────────────────────────────
  vid.addEventListener('ended', () => {
    fill.style.width = '100%';
    if (phase === 'intro') {
      showOverlay(ovChoice);
    } else {
      endMsg.textContent = END_MSG[phase] || '';
      showOverlay(ovEnd);
    }
  });

  // ── Path choices ──────────────────────────────────────────────────────────
  btnA.addEventListener('click', () =>
    loadAndPlay(SRC.pathA, 'Path A — Wildlife Trail', 'pathA'));
  btnB.addEventListener('click', () =>
    loadAndPlay(SRC.pathB, 'Path B — Rainy Detour', 'pathB'));

  // ── End actions ───────────────────────────────────────────────────────────
  btnReplay.addEventListener('click', () => {
    const iA = phase === 'pathA';
    loadAndPlay(iA ? SRC.pathA : SRC.pathB,
                iA ? 'Path A — Wildlife Trail' : 'Path B — Rainy Detour',
                phase);
  });
  btnOther.addEventListener('click', () => {
    if (phase === 'pathA') loadAndPlay(SRC.pathB, 'Path B — Rainy Detour', 'pathB');
    else                   loadAndPlay(SRC.pathA, 'Path A — Wildlife Trail', 'pathA');
  });

  // ── Smooth scroll ─────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── Hero fade-in ──────────────────────────────────────────────────────────
  const heroContent = document.querySelector('.hero-content');
  Object.assign(heroContent.style, {
    opacity: '0', transform: 'translateY(18px)',
    transition: 'opacity .8s ease, transform .8s ease',
  });
  setTimeout(() =>
    Object.assign(heroContent.style, { opacity: '1', transform: 'translateY(0)' }), 80);

}());
