#!/usr/bin/env python3
"""옵시디언 초안 → 블로그 발행 파이프라인.

기본 실행은 dry-run: 발행 대상만 보여준다. 실제 발행은 --go.

흐름: Memo/3 콘텐츠/블로그/ 안의 md 중 frontmatter `status: publish`인 글을
content/posts/{slug}.md로 변환·복사 → main 커밋·푸시 → 로컬 hugo 빌드 →
public/을 gh-pages 브랜치로 강제 푸시 → 라이브 URL 검증
→ 성공 시 원본 frontmatter를 status: published + posted_url로 갱신.

원본 노트의 본문은 절대 수정하지 않는다 (frontmatter만 갱신).

배포 방식 메모: gh 토큰에 workflow 스코프가 없어 GitHub Actions 대신
로컬 빌드 + gh-pages 브랜치 배포를 쓴다. 스코프를 부여하면
scripts/hugo-workflow.yml.txt를 .github/workflows/hugo.yml로 옮겨 CI 배포로 전환 가능.
"""
import argparse
import re
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path
from datetime import date

VAULT = Path.home() / "Library/Mobile Documents/iCloud~md~obsidian/Documents/Memo/3 콘텐츠/블로그"
REPO = Path(__file__).resolve().parent.parent
CONTENT = REPO / "content" / "posts"
PUBLIC = REPO / "public"
BASE_URL = "https://skaug12.github.io"  # 도메인 연결 시 여기와 hugo.toml baseURL을 함께 수정
REMOTE = "https://github.com/skaug12/skaug12.github.io.git"
HUGO = shutil.which("hugo") or "/opt/homebrew/bin/hugo"


def split_frontmatter(text: str):
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, re.DOTALL)
    if not m:
        return None, text
    fm = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.split("#")[0].strip().strip('"')
    return fm, m.group(2)


def find_targets():
    targets = []
    for f in sorted(VAULT.glob("*.md")):
        fm, body = split_frontmatter(f.read_text(encoding="utf-8"))
        if not fm or fm.get("status") != "publish":
            continue
        if not fm.get("slug"):
            print(f"!! slug 없음, 건너뜀: {f.name} (frontmatter에 slug: 영문-슬러그 추가 필요)")
            continue
        targets.append((f, fm, body))
    return targets


def build_post(fm: dict, body: str) -> str:
    today = date.today().isoformat()
    pub_date = fm.get("date") or today
    lines = [
        "---",
        f'title: "{fm["title"]}"',
        f"slug: {fm['slug']}",
        f"date: {pub_date}",
        f"lastmod: {today}",
    ]
    if fm.get("category"):
        lines.append(f'categories: ["{fm["category"]}"]')
    if fm.get("series"):
        lines.append(f'series: ["{fm["series"]}"]')
    if fm.get("summary"):
        lines.append(f'summary: "{fm["summary"]}"')
    if fm.get("pinned", "").lower() in ("true", "yes", "1"):
        lines.append("pinned: true")
    if fm.get("episode"):
        lines.append(f'episode: "{fm["episode"]}"')
    lines += ["---", "", body.strip(), ""]
    return "\n".join(lines)


def mark_published(f: Path, url: str):
    text = f.read_text(encoding="utf-8")
    text = re.sub(r"^(status:).*$", r"\1 published", text, count=1, flags=re.MULTILINE)
    if "posted_url:" in text:
        text = re.sub(r"^(posted_url:).*$", rf"\1 {url}", text, count=1, flags=re.MULTILINE)
    else:
        text = re.sub(r"\n---\n", f"\nposted_url: {url}\n---\n", text, count=1)
    f.write_text(text, encoding="utf-8")


def verify_live(url: str, needle: str, timeout_s: int = 300) -> bool:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            req = urllib.request.Request(f"{url}?v={int(time.time())}")
            with urllib.request.urlopen(req, timeout=15) as r:
                html = r.read().decode("utf-8", errors="ignore")
                if r.status == 200 and needle in html:
                    return True
        except Exception:
            pass
        time.sleep(15)
    return False


def run(cmd, cwd=REPO, **kw):
    print(f"$ {' '.join(cmd)}")
    return subprocess.run(cmd, cwd=cwd, check=True, **kw)


def deploy():
    """로컬 빌드 후 public/을 gh-pages로 강제 푸시 (임시 git)."""
    run([HUGO, "--minify"])
    (PUBLIC / ".nojekyll").touch()
    git_dir = PUBLIC / ".git"
    if git_dir.exists():
        shutil.rmtree(git_dir)
    try:
        run(["git", "init", "-b", "gh-pages", "-q"], cwd=PUBLIC)
        run(["git", "add", "-A"], cwd=PUBLIC)
        run(["git", "commit", "-q", "-m", f"deploy: {date.today().isoformat()}"], cwd=PUBLIC)
        run(["git", "push", "-f", REMOTE, "gh-pages"], cwd=PUBLIC)
    finally:
        if git_dir.exists():
            shutil.rmtree(git_dir)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--go", action="store_true", help="실제 발행 (기본은 dry-run)")
    ap.add_argument("--deploy", action="store_true", help="글 발행 없이 현재 상태로 빌드+gh-pages 배포만")
    args = ap.parse_args()

    if args.deploy:
        deploy()
        print(f"배포 완료 → {BASE_URL}/")
        return

    targets = find_targets()
    if not targets:
        print("발행 대상 없음 (status: publish인 글이 없습니다)")
        return

    print(f"발행 대상 {len(targets)}건:")
    for f, fm, _ in targets:
        print(f"  - {fm['title']}  →  {BASE_URL}/posts/{fm['slug']}/")

    if not args.go:
        print("\ndry-run입니다. 실제 발행: python3 scripts/publish.py --go")
        return

    CONTENT.mkdir(parents=True, exist_ok=True)
    for f, fm, body in targets:
        out = CONTENT / f"{fm['slug']}.md"
        out.write_text(build_post(fm, body), encoding="utf-8")
        print(f"복사됨: {out.relative_to(REPO)}")

    run(["git", "add", "content"])
    titles = ", ".join(fm["title"] for _, fm, _ in targets)
    run(["git", "commit", "-m", f"post: {titles}"])
    run(["git", "push"])

    deploy()

    print("\n라이브 검증...")
    ok_all = True
    for f, fm, _ in targets:
        url = f"{BASE_URL}/posts/{fm['slug']}/"
        if verify_live(url, fm["title"]):
            print(f"✓ 라이브 확인: {url}")
            mark_published(f, url)
        else:
            ok_all = False
            print(f"✗ 검증 실패 (5분 내 미반영): {url} — Pages 빌드 상태 확인 필요")

    sys.exit(0 if ok_all else 1)


if __name__ == "__main__":
    main()
