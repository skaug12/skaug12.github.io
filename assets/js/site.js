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

  /* ---- contact form (Formspree AJAX, 페이지 이동 없이 전송) ---- */
  var cf = document.querySelector('.connect-form');
  if (cf) {
    var status = cf.querySelector('.cf-status');
    var sendBtn = cf.querySelector('.cf-send');
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = cf.querySelector('[name="_hp"]');
      if (hp && hp.value) return; // honeypot 채워짐 = 봇, 조용히 무시
      if (!cf.checkValidity()) { cf.reportValidity(); return; }
      status.textContent = '';
      status.className = 'cf-status';
      sendBtn.disabled = true;
      var prev = sendBtn.textContent;
      sendBtn.textContent = '보내는 중…';
      // 구글 폼(formResponse)은 CORS로 응답을 못 읽어 no-cors로 전송 → 낙관적 성공 처리
      var params = new URLSearchParams();
      new FormData(cf).forEach(function (v, k) { if (k !== '_hp') params.append(k, v); });
      fetch(cf.action, { method: 'POST', mode: 'no-cors', body: params })
        .then(function () {
          cf.reset();
          status.textContent = '보냈어요. 확인하고 곧 답장 드릴게요.';
          status.classList.add('ok');
        })
        .catch(function () {
          status.textContent = '전송에 실패했어요. 잠시 후 다시 시도하거나 인스타 DM으로 주셔도 좋아요.';
          status.classList.add('err');
        })
        .then(function () {
          sendBtn.disabled = false;
          sendBtn.textContent = prev;
        });
    });
  }

  /* ---- 메일 보내기: 팝업(모달)로 컨택 폼 열기 ---- */
  document.querySelectorAll('.c-mail-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = document.querySelector('.mail-modal');
      if (!modal) return;
      if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
      var first = modal.querySelector('input, textarea');
      if (first) setTimeout(function () { first.focus(); }, 30);
    });
  });
  document.querySelectorAll('.mail-modal').forEach(function (modal) {
    function closeIt() { if (modal.close) modal.close(); else modal.removeAttribute('open'); }
    modal.addEventListener('click', function (e) { if (e.target === modal) closeIt(); });
    var c = modal.querySelector('.modal-close');
    if (c) c.addEventListener('click', closeIt);
  });

  /* ---- 읽기 진행바 (글·목록 페이지) ---- */
  var progBar = document.querySelector('.read-progress span');
  if (progBar) {
    var updateProg = function () {
      var el = document.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      var y = window.scrollY || el.scrollTop;
      progBar.style.width = (max > 0 ? Math.min(1, y / max) * 100 : 0).toFixed(2) + '%';
    };
    window.addEventListener('scroll', updateProg, { passive: true });
    window.addEventListener('resize', updateProg);
    updateProg();
  }

  /* ---- 맨 위로 버튼 ---- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    var toggleTop = function () { toTop.classList.toggle('show', (window.scrollY || 0) > 400); };
    window.addEventListener('scroll', toggleTop, { passive: true });
    toggleTop();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
})();
