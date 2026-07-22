/* seulki.log — 조회수 / 좋아요 / 공유 (slog-reactions 백엔드) */
(function () {
  var el = document.querySelector('.reactions');
  if (!el) return;
  var api = (el.getAttribute('data-api') || '').replace(/\/+$/, '');
  var slug = el.getAttribute('data-slug') || '';
  if (!api || !slug) return;

  var likeBtn = el.querySelector('.react-like');
  var likesEl = el.querySelector('.react-likes');
  var viewsEl = el.querySelector('.react-views-n');
  var sharesEl = el.querySelector('.react-shares');
  var liked = false;
  var busy = false;

  function num(n) { return (typeof n === 'number' ? n : 0).toLocaleString('ko-KR'); }

  function render(c) {
    if (!c) return;
    if (typeof c.views === 'number') viewsEl.textContent = num(c.views);
    if (typeof c.likes === 'number') likesEl.textContent = num(c.likes);
    if (typeof c.shares === 'number') sharesEl.textContent = num(c.shares);
    if (typeof c.liked === 'boolean') {
      liked = c.liked;
      likeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
      likeBtn.classList.toggle('on', liked);
      var ic = likeBtn.querySelector('.ic');
      if (ic) ic.textContent = liked ? '♥' : '♡'; // ♥ / ♡
    }
  }

  function post(path, extra) {
    return fetch(api + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ slug: slug }, extra || {}))
    }).then(function (r) { return r.json(); });
  }

  // 초기 카운트
  fetch(api + '/counts?slug=' + encodeURIComponent(slug))
    .then(function (r) { return r.json(); }).then(render).catch(function () {});

  // 조회 기록 (브라우저 세션당 1회만 요청; 서버도 12시간 중복 차단)
  try {
    var key = 'slog-view-' + slug;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      post('/view').then(render).catch(function () {});
    }
  } catch (e) {
    post('/view').then(render).catch(function () {});
  }

  // 좋아요 토글
  likeBtn.addEventListener('click', function () {
    if (busy) return;
    busy = true;
    post('/like', { action: liked ? 'unlike' : 'like' })
      .then(render).catch(function () {}).then(function () { busy = false; });
  });

  // 공유 (버튼 클릭 기록 + 실제 공유/복사)
  el.querySelectorAll('.react-share').forEach(function (b) {
    b.addEventListener('click', function () {
      var plat = b.getAttribute('data-platform');
      var url = location.href;
      var title = document.title;
      if (plat === 'x') {
        window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title), '_blank', 'noopener');
      } else if (plat === 'linkedin') {
        window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), '_blank', 'noopener');
      } else if (plat === 'copy') {
        if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function () {});
        var orig = b.textContent;
        b.textContent = '복사됨';
        setTimeout(function () { b.textContent = orig; }, 1500);
      }
      post('/share', { platform: plat }).then(render).catch(function () {});
    });
  });
})();
