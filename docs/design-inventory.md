# Seulki.log 홈페이지 디자인 인벤토리 (축적 중)

레퍼런스 사이트에서 뽑은 구현 가능한 기법 카탈로그. 새 레퍼런스가 나오면 여기에 계속 추가한다.

## 대전제
- 1순위: 검색 접근성(AI 인용). 모든 기법은 이 필터를 통과해야 한다.
- 원칙: **콘텐츠는 시맨틱 HTML로 먼저 존재하고, 디자인·모션은 그 위에 얹는다(progressive enhancement).** 캔버스/WebGL로 본문을 '그리는' 방식은 금지.
- 스택: Hugo(정적생성) + GitHub Pages + Lenis(부드러운 스크롤) + GSAP(모션) + 필요시 Lottie. 서버 없이 전부 가능.

## 딱지 범례
- ✅ AEO 안전 (그대로 채택)
- ⚠️ 조건부 (Hugo 정적생성으로 만들면 안전, 클라이언트 렌더면 위험)
- 🎨 무드만 (기법은 안 씀, 분위기만 참고)
- ❌ 금지 (크롤러가 못 읽음)

---

## A. 구조·내비게이션 — "여러 주제, 한 도메인" 문제의 핵심
- ✅ **카테고리 내비 + 개수 배지** `[n]` (glukhovsky) — 한 사람의 여러 갈래(Books/Movies/Games/Articles)를 한 홈에 정리. 우리 시리즈 기둥(사고의 해부 등) 구조와 정확히 동일. **가장 중요한 뼈대.**
- ✅ **다국어 스위처**, ISO 경로 `/ko` `/en` (glukhovsky) — 국문/영문 이중 발행 시(AEO 확장) 사용
- ✅ 스크롤 시 투명→불투명 고정 내비 (kei-inc)
- ✅ 포스트 카드 그리드 (dayloog)
- ✅ 카드형 뉴스 레이아웃 + 날짜 위계 (glukhovsky)

## B. 타이포그래피
- ✅ 자간 벌린 해체형 헤더 "S e u l k i" (dayloog) — 로고/제목 감성 포인트
- ✅ 세로쓰기 실험 (kei-inc, 일본어 세로조판) — 국문 인용구에 절제해서 적용 가능
- ✅ serif + sans 페어링으로 위계 (kei-inc)
- ✅ 큰 활자 + 넉넉한 행간·여백, 좌상단 정렬 (전반, 내 취향과 일치) — Pretendard 유지

## C. 모션·인터랙션 (전부 progressive enhancement라 AEO 안전)
- ✅ 스크롤 스토리텔링 + Lottie 마이크로 애니 + SVG (Oliver Wyman)
- ✅ 부드러운 페이지 전환, 스냅샷 모달, 필터 (tomoya-okada)
- ✅ Intersection Observer 스크롤 리빌 (dayloog)
- ✅ "Drag or Scroll" 커스텀 스크롤 프롬프트 (dayloog)
- ✅ full-bleed 이미지 + 텍스트 오버레이 (kei-inc)
- ✅ 이메일 클립보드 복사 인터랙션 (kei-inc)
- ✅ Lenis 부드러운 스크롤 (공통 기법)

## D. 리더 UX 컨트롤 — 긴 글이 쌓이는 에세이 사이트에 최적
- ✅ 글자 크기 S/M/L 토글 + localStorage 저장 (dayloog)
- ✅ 라이트/다크 테마 토글 (dayloog)
- ✅ 이미지 모드 토글 (dayloog)
- 근거: 길게 읽는 글 = 읽기 편의가 체류·신뢰로 이어짐. AEO와 별개로 독자 자산.

## E. 무드·분위기 (구현 아니라 감만)
- 🎨 다크 시네마틱 (cipher.tv, glukhovsky)
- 🎨 라이브 시계 타임스탬프 + "Never Finished / Since 2018" 영속 WIP 컨셉 (obys) — 별도 "실험실" 섹션 아이디어로
- 🎨 와비사비·keshiki 정적 절제 (kei-inc) — "사고" 브랜드 결과 맞음

---

## 주의 딱지
- ⚠️ **dayloog**는 microCMS 헤드리스라 본문이 클라이언트 렌더면 AEO 위험. 같은 UI를 Hugo 정적생성으로 만들면 문제없음. "기법은 O, 렌더는 Hugo로."
- ❌ **obys experiment / cipher.tv**의 WebGL·캔버스로 본문 그리기: 크롤러가 셸만 봄(cipher.tv 실측 40~60자). 무드·별도 실험 섹션으로만.

## 종합 방향
- 뼈대 = glukhovsky의 카테고리 내비 + 개수 배지 (여러 주제 한 도메인)
- 절제·타이포 = kei-inc
- 리더 컨트롤 = dayloog (글자크기/테마/이미지 토글)
- 스크롤 모션 = Oliver Wyman + Lenis/GSAP
- cipher.tv/obys = 무드·실험섹션만

## 확정된 디자인 결정 (2026-07-07, 시안 v2)
- **구조**: 한 도메인 / 카테고리 3개 = **인사이트 노트** · 생각 · 개인 자동화 + About. 카테고리는 사이드 nav가 아니라 히어로 아래 **카드 3장(무엇을 담는지 한 줄 설명+글 수)**으로 안내. 그 구간부터 배경을 초록빛 띠(band)로 분리.
- **금지 단어**: 사건·부검·해부·사고 등 부정적 단어 안 씀. "분석/인사이트/기록"으로. 플래그십 확정명 = **"인사이트 노트"** (짧은 태그/배지엔 "노트 01").
- **워드마크**: `seulki.log` 소문자.
- **레이아웃 주의(겪은 버그)**: `.wrap`(좌우 var(--mx) 여백)에 섹션 modifier가 `padding: 상 0 하` 단축형을 얹으면 좌우 여백이 0으로 덮여 정렬이 깨짐. 반드시 `padding-top/bottom` 롱핸드로.
- **히어로 = #독립자본 선언**. "회사를 떠나도 내 이름으로 남는 경험". 사이트 = 그것을 쌓는 장치. 이게 전체 관통선.
- **톤**: 밝은 편집형(A안)
- **색 = 딥 에버그린** `#2B5D4C`(light) / `#6EBB9C`(dark). 이유: 독립자본 = 계절 지나도 초록인 것(상록). 축적·자립·차분. HFK 빨강과 분리해 '당신의 색'. 링크·사건번호·라벨에만 극절제.
- **폰트 = Pretendard 단일**. 명조 세리프 폐기. 두 레지스터는 서체 대신 **굵기·크기**로: 부검글 제목 굵게/조이게(600), 에세이 제목 가늘고 크게(350).
- **자간 -15** (-0.015em) 전체.
- **포렌식 장치**: 사고의 해부는 실제 번호 시리즈라 "사건 01 / CASE" 배지·tabular 숫자 정당함.
- **리더 컨트롤**: 글자크기 A/A/A + 라이트/다크 토글 작동(dayloog). 스크롤 리빌.
- 시안 URL: claude.ai/code/artifact/fcf503b9-e7b2-48e9-8751-1518bdae2373
- **미결**: 실사이트 Pretendard는 셀프호스팅(woff2 서브셋) 필요(CSP·방문자 미설치 대비). 개수·날짜는 예시값.

## Hugo 이식 완료 (2026-07-07, 로컬)
- 시각 레이어만 교체, AEO 인프라(head 메타·jsonld·llms.txt·robots·summary 숏코드) 전부 보존. 빌드 검증: 라이트/다크 모두 v5 아티팩트와 일치, sitemap·RSS·llms.txt·robots·JSON-LD 정상 생성.
- 바뀐/추가: `static/css/style.css`(전면), `static/js/site.js`(리더컨트롤·테마·타이프라이터·리빌, localStorage 저장), `layouts/`(baseof·index·single·list·terms·partials/head·header·footer), `hugo.toml`(category 택소노미 추가), `data/categories.yaml`(카드 안내), `static/fonts/PretendardVariable.woff2`(셀프호스팅).
- **시드 글 6편**(content/posts/*): 미리보기용. 실제 발행은 옵시디언→publish.py. 대표글 `stale-read-99-rows`는 옵시디언 실초안과 slug 동일 → 발행 시 덮어써짐.
- **미결**: ① 라이브 배포(gh-pages) 사용자 OK 대기 ② 시드 글 유지/삭제 결정 ③ Pretendard 2MB → 한글 서브셋 최적화(후속) ④ `data-theme` 미결 없음 ⑤ hugo.toml `languageCode` deprecation(무해).
- 미리보기: `hugo server` → localhost:1313. 다크는 OS 테마 자동, 우상단 토글로 전환.

## 레퍼런스 원장
| 사이트 | 성격 | 크롤러 판독 | 채택 |
|---|---|---|---|
| dayloog.com | 미니멀 개인 블로그 | 제목·날짜 O, 본문 JS 가능성 | 기법 다수 ⚠️→Hugo화 |
| glukhovsky.com | 작가 멀티카테고리 | 텍스트 위주 O | 구조 뼈대 ✅ |
| kei-inc.jp | 일본 디자인 스튜디오 | 높은 HTML 비율 O | 절제·타이포 ✅ |
| experiment.obys.agency | WebGL 실험실 | 셸만 | 무드·실험섹션 🎨 |
| cipher.tv | 캔버스 쇼케이스 | 40~60자 | 무드만 🎨 |
| Oliver Wyman(ai-in-mobility) | 편집형 씽크리더십 | 본문 전체 O | 스크롤 모션 ✅ |
| tomoya-okada | Astro 미니멀 포폴 | 본문 O | 전환·모달 ✅ |
