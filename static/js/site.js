/* seulki.log — reader controls, theme, typewriter, scroll reveal */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- typewriter: the site writes its own name in ---- */
  var tw = document.querySelector('.tw');
  var caret = document.querySelector('.caret');
  if (tw) {
    var full = tw.getAttribute('data-text') || '';
    if (reduce) {
      tw.textContent = full;
    } else {
      var i = 0;
      (function type() {
        tw.textContent = full.slice(0, i);
        i++;
        if (i <= full.length) {
          setTimeout(type, 58 + Math.random() * 46);
        } else if (caret) {
          setTimeout(function () { caret.style.animation = 'none'; caret.style.opacity = '0'; }, 3200);
        }
      })();
    }
  }

  /* ---- reader font size (persisted) ---- */
  var fsBtns = document.querySelectorAll('.fs button');
  function markFs(val) {
    fsBtns.forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-fs') === val); });
  }
  var savedFs = null;
  try { savedFs = localStorage.getItem('slog-reader'); } catch (e) {}
  if (savedFs) { root.style.setProperty('--reader', savedFs); markFs(savedFs); }
  fsBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-fs');
      root.style.setProperty('--reader', v);
      markFs(v);
      try { localStorage.setItem('slog-reader', v); } catch (e) {}
    });
  });

  /* ---- theme toggle (persisted) ---- */
  var themeBtn = document.getElementById('theme');
  function current() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function sync() { if (themeBtn) themeBtn.textContent = current() === 'dark' ? 'Light' : 'Dark'; }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('slog-theme', next); } catch (e) {}
      sync();
    });
    sync();
  }

  /* ---- scroll reveal ---- */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i, 6) * 60) + 'ms';
      io.observe(el);
    });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();
