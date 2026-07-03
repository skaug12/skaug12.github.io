# Seulki.log

개인 블로그. 커뮤니티 운영과 AI 자동화의 사건·판단 기록.

- 라이브: https://skaug12.github.io/
- 엔진: Hugo (미니멀 자체 테마, Pretendard)
- AEO 내장: robots.txt AI봇 전면 허용 · BlogPosting/Person JSON-LD · llms.txt 자동 생성 · 정리박스 shortcode

## 글쓰기 → 발행

1. 옵시디언 `Memo/콘텐츠파이프라인/블로그/`에 글 작성 (frontmatter: title·slug·date·series·summary·status)
2. 다 쓰면 frontmatter `status: draft` → `publish`로 변경
3. `python3 scripts/publish.py` (dry-run 확인) → `python3 scripts/publish.py --go`
4. 스크립트가 변환 → main 푸시 → hugo 빌드 → gh-pages 배포 → 라이브 검증 → 원본에 posted_url 기록

## 배포 구조

main = Hugo 소스 / gh-pages = 빌드 산출물 (Pages 서빙 소스).
gh 토큰에 workflow 스코프가 생기면 `scripts/hugo-workflow.yml.txt`를 `.github/workflows/hugo.yml`로 옮겨 CI 배포로 전환 가능.

## 도메인 연결 시

1. `static/CNAME` 파일에 도메인 한 줄 추가
2. `hugo.toml` baseURL + `scripts/publish.py` BASE_URL 수정
3. DNS: A 레코드 4개(185.199.108~111.153) + www CNAME → skaug12.github.io
4. 레포 Settings → Pages → Custom domain 설정 + Enforce HTTPS
