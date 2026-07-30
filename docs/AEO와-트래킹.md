# AEO와 트래킹 (2026-07-30 정리)

seulkilog.today의 AI 검색 노출(AEO)과 유입 추적을 어떻게 보고 있는지, 무엇이 남았는지.

## 지금 상태

### 코드로 끝낸 것 (2026-07-30)

- **자리표시 글 5편 삭제**: `note-placeholder-1~5`. 7/22에 레이아웃 확인용으로 만든 더미가 라이브로 크롤되고 있었다. sitemap·llms.txt·RSS에 다 들어가서, AI가 이 사이트를 읽으면 글 7편 중 5편이 "이 글은 자리표시 글입니다"였다. 이제 실글 2편만 남는다.
- **JSON-LD 이중 따옴표 수정**: 템플릿이 `{{ .Title | jsonify }}`를 쓰는데, `<script type="application/ld+json">` 안은 Go 템플릿이 JS 문맥으로 잡아 한 번 더 인코딩한다. 결과가 `"headline":"\"같은 7명이…\""`, `"datePublished":"\"2026-07-03\""`라서 날짜가 날짜로 안 읽혔다. `| jsonify`를 빼서 Go 이스케이퍼가 한 번만 감싸게 고침.
- **BlogPosting 필드 보강**: `url`·`wordCount`·`image`·`articleSection`(카테고리)·`isPartOf`(시리즈)·`publisher` 추가, `datePublished`/`dateModified`를 ISO 8601 오프셋 형식으로, `mainEntityOfPage`를 WebPage 객체로.
- **robots.txt Sitemap 줄**: 옛 도메인(`skaug12.github.io`)을 `https://seulkilog.today/sitemap.xml`로 교체.
- **소유확인·분석 슬롯 추가**: `hugo.toml [params]`에 `google_verification`·`naver_verification`·`cf_beacon`·`ga4`. 전부 빈 값이면 태그가 하나도 안 나간다. 값을 넣고 배포하면 그때 붙는다.

### 남은 것 (계정 작업, 아래 절차대로)

1. Google Search Console 등록
2. 네이버 서치어드바이저 등록
3. Cloudflare를 DNS 앞에 두기 (AI 크롤러 추적)
4. Cloudflare Web Analytics 켜기
5. (선택) GA4

---

## 왜 GA4보다 Search Console이 먼저인가

지금 사이트는 GitHub Pages 직결이다. 도메인 A레코드가 185.199.108~111.153을 직접 가리킨다. 이 구성에서는:

- **서버 로그를 볼 수 없다.** GPTBot·ClaudeBot·PerplexityBot이 실제로 크롤해 갔는지 확인할 방법이 0이다.
- **분석 스크립트는 봇을 못 잡는다.** GA4든 무엇이든 브라우저에서 도는 JS라, 크롤러는 애초에 실행하지 않는다.

그래서 AEO가 되는지 안 되는지를 GA4로는 판단할 수 없다. 필요한 건 두 가지다.

| 알고 싶은 것 | 필요한 도구 |
|---|---|
| 검색에 몇 번 노출되고 무슨 검색어로 들어오나 | Search Console |
| 색인이 됐나, 안 됐으면 왜 | Search Console |
| 어떤 AI 봇이 며칠에 몇 번 크롤했나 | Cloudflare 프록시 (AI Crawler 대시보드) |
| 사람 방문자가 어디서 왔나 (referrer·국가) | Cloudflare Web Analytics 또는 GA4 |
| 글별 조회·좋아요·공유 | 이미 있음 (slog-reactions Worker) |

---

## 절차

### 1. Google Search Console

1. https://search.google.com/search-console 접속, `seulkilog.today` 도메인 추가
2. 소유확인 방식 중 **"HTML 태그"** 선택 → `content="..."` 안의 값을 복사
3. `hugo.toml`의 `google_verification = "복사한값"`에 붙여넣기
4. `python3 scripts/publish.py --deploy`
5. Search Console에서 "확인" 클릭
6. 확인되면 **사이드바 → Sitemaps → `sitemap.xml` 제출**
7. URL 검사에 `https://seulkilog.today/posts/stale-read-99-rows/` 넣고 **색인 생성 요청**. 실글 2편 다 해준다.

색인 데이터는 며칠 뒤부터 쌓인다. 노출·클릭·검색어는 "실적" 탭에서 본다.

> 삭제한 자리표시 글 5편이 이미 색인됐다면 며칠 안에 404로 빠진다. 서둘러 없애려면 Search Console → 삭제 → 임시 삭제로 5개 URL을 넣는다.

### 2. 네이버 서치어드바이저

1. https://searchadvisor.naver.com 에서 사이트 등록
2. HTML 태그 방식의 content 값을 `hugo.toml`의 `naver_verification`에 넣고 배포
3. 소유확인 후 사이트맵 제출: `https://seulkilog.today/sitemap.xml`

### 3. Cloudflare를 DNS 앞에 두기

**이게 AEO 추적의 답이다.** GitHub Pages 서빙은 그대로 두고 앞에 프록시만 얹는다.

1. Cloudflare 대시보드(Worker 쓰는 그 계정)에서 **Add a site** → `seulkilog.today`
2. Free 플랜 선택. Cloudflare가 현재 DNS 레코드를 자동으로 읽어온다
   - A `@` → 185.199.108.153 / .109.153 / .110.153 / .111.153 (4개)
   - CNAME `www` → skaug12.github.io
   - 전부 **Proxied(주황 구름)** 로 켠다
3. Cloudflare가 알려주는 네임서버 2개를 **GoDaddy**에서 교체한다
   (GoDaddy → 내 도메인 → seulkilog.today → 네임서버 → 변경 → 내 네임서버 사용)
4. 전파에 몇 시간~하루. Cloudflare에서 "Active" 뜨면 완료
5. **SSL/TLS → 암호화 모드를 "Full"** 로 (Flexible이면 리디렉션 루프가 난다)
6. **Rules → Always Use HTTPS** 켜기

**전파 중 주의**: GitHub Pages의 인증서 갱신이 Cloudflare 프록시 뒤에서 막힐 수 있다. 문제가 생기면 A 레코드를 잠깐 DNS only(회색 구름)로 돌려 갱신시킨 뒤 다시 켠다.

끝나면 Cloudflare **Analytics → AI Crawlers**(Free 플랜 포함)에서 GPTBot·ClaudeBot·PerplexityBot 등이 언제 몇 번 왔는지 본다. 이게 "AEO가 되고 있나"의 직접 증거다.

### 4. Cloudflare Web Analytics

3번을 마쳤으면 자동 주입도 되지만, 확실하게 하려면 토큰을 넣는다.

1. Cloudflare → **Analytics & Logs → Web Analytics** → Add a site → `seulkilog.today`
2. 발급된 스니펫에서 `"token": "..."` 값만 복사
3. `hugo.toml`의 `cf_beacon = "복사한토큰"`
4. `python3 scripts/publish.py --deploy`

쿠키를 안 쓰므로 동의 배너가 필요 없다. referrer·국가·페이지별 방문·기기까지 나온다.

### 5. GA4 (선택)

Cloudflare Web Analytics로 유입 경로는 충분히 보인다. GA4는 이벤트·전환 퍼널(예: 컨택트 폼 제출률, 스크롤 깊이)을 정교하게 볼 때 값어치가 있다. 붙이려면:

1. https://analytics.google.com 에서 속성 생성 → 웹 데이터 스트림에 `https://seulkilog.today`
2. 측정 ID(`G-`로 시작) 복사
3. `hugo.toml`의 `ga4 = "G-XXXXXXXXXX"` → 배포

GA4를 켜면 쿠키를 쓴다. EU 방문자를 신경 쓴다면 동의 배너가 따로 필요해진다. 그래서 기본값은 Cloudflare 쪽을 권한다.

---

## AEO가 실제로 작동하려면

기술 설비는 위로 끝난다. 남는 건 콘텐츠다.

- **지금 실글이 2편이다.** AI가 인용하려면 인용할 문서가 있어야 한다. 2편으로는 노출될 표면이 거의 없다.
- 인용되기 좋은 글의 모양: 구체적 숫자와 사건이 있고("같은 7명이 14번 등록됐다"), 질문 형태의 소제목이 있고, `{{< summary >}}` 정리 박스로 답이 먼저 나온다.
- `llms.txt`의 글 목록은 요약(`summary` frontmatter)을 그대로 쓴다. 요약을 성의 있게 쓰는 게 곧 AEO다.

## 점검 명령

```bash
# 라이브 엔드포인트
for u in / /llms.txt /robots.txt /sitemap.xml /index.xml; do
  printf "%s -> " "$u"; curl -s -o /dev/null -w "%{http_code}\n" "https://seulkilog.today$u"
done

# JSON-LD가 파싱되는지
curl -s https://seulkilog.today/posts/stale-read-99-rows/ \
  | grep -oE '<script type=application/ld\+json>[^<]*' \
  | sed 's|<script[^>]*>||' | python3 -m json.tool

# 글별 조회·좋아요·공유 누적 (STATS_TOKEN은 ~/Projects/slog-reactions/.secrets)
curl -s "https://slog-reactions.seulkilog.workers.dev/stats?token=$TOKEN" | python3 -m json.tool
```
