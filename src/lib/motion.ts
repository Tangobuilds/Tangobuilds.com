// Shared motion for every page. Runs on each astro:page-load, so it also
// re-binds after a view transition swaps the page.

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let cleanups: Array<() => void> = [];

export function initMotion() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  reveals();
  counters();
  headerState();
  tilt();
  magnetic();
  copyButtons();
}

/** Elements with data-reveal fade and rise in when they enter the viewport. data-delay staggers them (ms). */
function reveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduced() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.style.transitionDelay = `${el.dataset.delay ?? 0}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

/** <span data-count="329">329</span> counts up from zero the first time it is seen. */
function counters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (reduced() || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      const target = Number(el.dataset.count);
      const start = performance.now();
      const dur = 1400;
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.6 });
  els.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

/** Adds .is-scrolled to the header once the page has moved, for the frosted background. */
function headerState() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));
}

/** [data-tilt] leans toward the pointer in 3D. Mouse and pen only. */
function tilt() {
  if (reduced()) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt || 6);
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
      el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
    };
    const leave = () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    });
  });
}

/** [data-magnetic] buttons drift a few pixels toward the pointer. */
function magnetic() {
  if (reduced()) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    };
    const leave = () => (el.style.transform = '');
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    });
  });
}

/** <button data-copy="text"> copies its text and says so. */
function copyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    const label = btn.textContent;
    const click = async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy || '');
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = btn.dataset.copy || '';
      }
      setTimeout(() => (btn.textContent = label), 1800);
    };
    btn.addEventListener('click', click);
    cleanups.push(() => btn.removeEventListener('click', click));
  });
}
