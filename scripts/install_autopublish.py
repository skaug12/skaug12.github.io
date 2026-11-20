#!/usr/bin/env python3
"""블로그 자동 발행 launchd 작업 등록기 (멱등).

옵시디언 블로그 폴더에 `status: publish` 글이 생기면 주기적으로 감지해
`publish.py --go` 를 실행한다 → 변환·main 커밋·빌드·gh-pages 배포·라이브 검증까지 자동.
글이 없으면 로컬에서 조용히 no-op (네트워크·git 안 건드림).

  설치:  python3 scripts/install_autopublish.py
  상태:  python3 scripts/install_autopublish.py --status
  제거:  python3 scripts/install_autopublish.py --uninstall
  주기:  기본 10분 (--interval 초 로 변경)

원칙(손조립 cron 금지): 이 스크립트가 절대경로 plist 를 만들고 launchctl 로
멱등 등록한다. cron one-liner 를 손으로 조립해 crontab 에 파이프하지 않는다.
"""
import argparse
import plistlib
import subprocess
import sys
from pathlib import Path

LABEL = "com.seulki.blog-autopublish"
REPO = Path(__file__).resolve().parent.parent
PY = "/usr/bin/python3"
PUBLISH = REPO / "scripts" / "publish.py"
LOGDIR = REPO / "logs"
LOG = LOGDIR / "autopublish.log"
PLIST = Path.home() / "Library" / "LaunchAgents" / f"{LABEL}.plist"


def install(interval: int):
    if not PUBLISH.exists():
        sys.exit(f"!! publish.py 없음: {PUBLISH}")
    LOGDIR.mkdir(exist_ok=True)
    plist = {
        "Label": LABEL,
        "ProgramArguments": [PY, str(PUBLISH), "--go"],
        "StartInterval": interval,
        "RunAtLoad": False,
        "WorkingDirectory": str(REPO),
        "StandardOutPath": str(LOG),
        "StandardErrorPath": str(LOG),
        "EnvironmentVariables": {
            "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
        },
    }
    PLIST.parent.mkdir(parents=True, exist_ok=True)
    with open(PLIST, "wb") as f:
        plistlib.dump(plist, f)
    # 멱등 재적재 (기존 있으면 unload 후 load)
    subprocess.run(["launchctl", "unload", str(PLIST)], capture_output=True)
    r = subprocess.run(["launchctl", "load", "-w", str(PLIST)], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"!! launchctl load 실패: {r.stderr.strip()}")
    print(f"✓ 자동 발행 등록 완료: {LABEL}")
    print(f"  주기: {interval // 60}분마다 감지")
    print(f"  동작: 옵시디언 블로그 폴더에 status: publish 글 있으면 자동 발행+배포")
    print(f"  plist: {PLIST}")
    print(f"  로그:  {LOG}")


def uninstall():
    subprocess.run(["launchctl", "unload", str(PLIST)], capture_output=True)
    if PLIST.exists():
        PLIST.unlink()
    print(f"✓ 자동 발행 제거 완료: {LABEL}")


def status():
    r = subprocess.run(["launchctl", "list"], capture_output=True, text=True)
    hit = [ln for ln in r.stdout.splitlines() if LABEL in ln]
    print(f"등록 상태: {'실행 중 — ' + hit[0].strip() if hit else '미등록'}")
    print(f"plist:     {'있음' if PLIST.exists() else '없음'}  ({PLIST})")
    print(f"로그:      {LOG}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--uninstall", action="store_true")
    ap.add_argument("--status", action="store_true")
    ap.add_argument("--interval", type=int, default=600, help="감지 주기(초), 기본 600=10분")
    a = ap.parse_args()
    if a.uninstall:
        uninstall()
    elif a.status:
        status()
    else:
        install(a.interval)


if __name__ == "__main__":
    main()
