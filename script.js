(function () {
  'use strict';

  const vid = document.getElementById('vid');
  const vidTag = document.getElementById('vid-tag');
  const ovPlay = document.getElementById('ov-play');
  const ovChoice = document.getElementById('ov-choice');
  const ovEnd = document.getElementById('ov-end');
  const endMsg = document.getElementById('end-msg');
  const fill = document.getElementById('progress-fill');
  const dot0 = document.getElementById('dot-0');
  const dotA = document.getElementById('dot-a');
  const dotB = document.getElementById('dot-b');
  const btnPlay = document.getElementById('btn-play');
  const btnA = document.getElementById('btn-a');
  const btnB = document.getElementById('btn-b');
  const btnReplay = document.getElementById('btn-replay');
  const btnOther = document.getElementById('btn-other');

  const SRC = {
    intro: 'videos/video1_intro.mp4',
    pathA: 'videos/video2_brancha.mp4',
    pathB: 'videos/video3_branchb.mp4',
  };

  const TAG = {
    intro: 'Opening Route',
    pathA: 'Route A · Lakeside Pavilion',
    pathB: 'Route B · Willow Garden',
  };

  const END_MSG = {
    pathA: 'You stayed with the lakeside pavilion route.\nThe park felt open, bright, and architectural.',
    pathB: 'You followed the willow garden route.\nThe park felt quieter, softer, and close to detail.',
  };

  let phase = 'intro';

  function setDot(state) {
    [dot0, dotA, dotB].forEach((dot) => dot.classList.remove('dot-active'));
    if (state === 'intro') dot0.classList.add('dot-active');
    if (state === 'pathA') dotA.classList.add('dot-active');
    if (state === 'pathB') dotB.classList.add('dot-active');
  }

  function showOverlay(which) {
    [ovPlay, ovChoice, ovEnd].forEach((overlay) => overlay.classList.add('hidden'));
    if (which) which.classList.remove('hidden');
  }

  function tryPlay() {
    return vid.play().catch(() => {
      showOverlay(ovPlay);
    });
  }

  function loadAndPlay(src, state) {
    phase = state;
    vid.src = src;
    vid.load();
    vidTag.textContent = TAG[state];
    setDot(state);
    fill.style.width = '0%';
    showOverlay(null);
    vid.addEventListener('canplay', function handler() {
      vid.removeEventListener('canplay', handler);
      tryPlay();
    });
  }

  function revealOnScroll() {
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }

  setDot('intro');
  showOverlay(ovPlay);
  revealOnScroll();

  vid.addEventListener('error', () => showOverlay(ovPlay));

  btnPlay.addEventListener('click', () => {
    ovPlay.classList.add('fade-out');
    setTimeout(() => showOverlay(null), 220);
    tryPlay();
  });

  vid.addEventListener('timeupdate', () => {
    if (vid.duration) {
      fill.style.width = `${(vid.currentTime / vid.duration) * 100}%`;
    }
  });

  vid.addEventListener('ended', () => {
    fill.style.width = '100%';
    if (phase === 'intro') {
      showOverlay(ovChoice);
      return;
    }
    endMsg.textContent = END_MSG[phase] || '';
    showOverlay(ovEnd);
  });

  btnA.addEventListener('click', () => loadAndPlay(SRC.pathA, 'pathA'));
  btnB.addEventListener('click', () => loadAndPlay(SRC.pathB, 'pathB'));

  btnReplay.addEventListener('click', () => {
    loadAndPlay(phase === 'pathA' ? SRC.pathA : SRC.pathB, phase);
  });

  btnOther.addEventListener('click', () => {
    if (phase === 'pathA') {
      loadAndPlay(SRC.pathB, 'pathB');
    } else {
      loadAndPlay(SRC.pathA, 'pathA');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}());
