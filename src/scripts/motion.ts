// Leichte Motion ohne Libraries: Scroll-Reveals, sanfter Parallax, Lichtreflex auf den Facetten.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// ---------- Scroll-Reveal (IntersectionObserver) ----------
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduce.matches || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealEls.forEach((el) => io.observe(el));
}

// ---------- Parallax (max. ~8 %) ----------
const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
if (!reduce.matches && parallax.length) {
  let ticking = false;
  const update = () => {
    const vh = innerHeight;
    for (const el of parallax) {
      const box = (el.parentElement ?? el).getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) continue;
      const progress = (box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2); // -1 … 1
      el.style.transform = `translate3d(0, ${(progress * -8 * box.height) / 100}px, 0)`;
    }
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// ---------- Facetten reagieren auf die Maus (nur Desktop) ----------
if (!reduce.matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('.facets').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
      el.classList.add('is-lit');
    });
    el.addEventListener('pointerleave', () => el.classList.remove('is-lit'));
  });
}
