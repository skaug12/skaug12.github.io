#!/usr/bin/env python3
"""옵시디언 초안 → 블로그 발행 파이프라인.

기본 실행은 dry-run: 발행 대상만 보여준다. 실제 발행은 --go.

흐름: Memo/콘텐츠파이프라인/블로그/ 안의 md 중 frontmatter `status: publish`인 글을
content/posts/{slug}.md로 변환·복사 → git commit·push → GitHub Actions 빌드 대기
→ 라이브 URL 검증 → 성공 시 원본 frontmatter를 status: published + posted_url로 갱신.

원본 노트의 본문은 절대 수정하지 않는다 (frontmatter만 갱신).
"""
import argparse
import re
import subprocess
import sys
import time
import urllib.request
from pathlib import Path
from datetime import date

VAULT = Path.home() / "Library/Mobile Documents/iCloud~md~obsidian/Documents/Memo/콘텐츠파이프라인/블로그"
REPO = Path(__file__).resolve().parent.parent
CONTENT = REPO / "content" / "posts"
BASE_URL = "https://skaug12.github.io"  # 도메인 연결 시 여기와 hugo.toml baseURL을 함께 수정


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
    if fm.get("series"):
        lines.append(f'series: ["{fm["series"]}"]')
    if fm.get("summary"):
        lines.append(f'summary: "{fm["summary"]}"')
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


def verify_live(url: str, title: str, timeout_s: int = 360) -> bool:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=15) as r:
                html = r.read().decode("utf-8", errors="ignore")
                if r.status == 200 and title in html:
                    return True
        except Exception:
            pass
        time.sleep(15)
    return False


def run(cmd, **kw):
    print(f"$ {' '.join(cmd)}")
    return subprocess.run(cmd, cwd=REPO, check=True, **kw)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--go", action="store_true", help="실제 발행 (기본은 dry-run)")
    args = ap.parse_args()

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

    print("\nGitHub Actions 빌드·배포 대기 후 라이브 검증...")
    ok_all = True
    for f, fm, _ in targets:
        url = f"{BASE_URL}/posts/{fm['slug']}/"
        if verify_live(url, fm["title"]):
            print(f"✓ 라이브 확인: {url}")
            mark_published(f, url)
        else:
            ok_all = False
            print(f"✗ 검증 실패 (6분 내 미반영): {url} — Actions 탭 확인 필요")

    sys.exit(0 if ok_all else 1)


if __name__ == "__main__":
    main()
