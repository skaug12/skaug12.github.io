---
title: 만든 시스템
slug: systems
summary: "커뮤니티 운영을 위해 만든 슬래시 명령 125개, 사람 없이 도는 자동화 52건, 스크립트 305개의 목록입니다."
---

커뮤니티 운영을 자동화하면서 만든 것들의 목록입니다. 2026년 1월에 시작해 여덟 달 만에 이만큼이 됐습니다.

- **슬래시 명령 125개** 명령 한 줄이 여러 단계 업무를 대신합니다
- **자동화 52건** 사람이 켜지 않아도 정해진 시각에 돕니다
- **스크립트 305개** 위 둘이 실제로 일하는 부분입니다

코드는 회사 자산이라 여기 두지 않고, 무엇을 만들었는지만 남깁니다. 각각의 제작 계기와 결과는 [인사이트 노트](/categories/인사이트-노트/)에 따로 적었습니다.

## 자주 쓰는 것 열둘

매주 또는 매 시즌 반드시 도는 것들입니다.

| 명령 | 만든 계기 | 지금 |
|---|---|---|
| `/wed` | 매주 수요일에 스무 가지 일을 순서를 외워서 했다. 하나 빠뜨리면 그 주 세션이 흔들렸다 | 프리플라이트 뒤 다섯 묶음이 순서대로 이어서 돈다 |
| `/run-season-planning` | 시즌 하나를 여는 데 필요한 일이 흩어져 있었다 | 상품 노트·일정·레터·공지 예약까지 한 흐름 |
| `/run-season-ops` | 새 시즌 슬랙 셋업을 매번 손으로 했다 | 채널 정리·생성, 캔버스, 멤버 초대, 회차 시드 일괄 |
| `/manage-signup-thread` | 정원 20명에 댓글 30개가 달리면 사람이 셌다. 세는 동안 또 달렸다 | 몇 분 간격으로 확정·대기를 갱신, 이벤트 끝나면 자가 해제 |
| `/post-arrival-check` | 이모지 수와 실제 참석자가 계속 어긋났고 이름 태그가 틀렸다 | 시작 30분 전 체크박스 게시, 운영진만 토글 |
| `/audit-membership-consistency` | 시트·채널·출석부가 각각 다른 명단을 갖고 있었다 | 3소스 전수 대조, 읽기 전용 리포트만 |
| `/detect-churn-signals` | 이탈은 시즌이 끝나고서야 알았다 | 진행 중 연속 불참 감지, 이름+회사 동시 일치일 때만 발송 |
| `/make-nametags` | 명단이 바뀔 때마다 디자인 툴에서 159장을 다시 뽑았다 | 시트를 읽어 합본 PDF까지 한 번에 |
| `/manage-season-stock` | 재등록 기간에 인기 팀이 다 차서 신규에게 남는 게 없었다 | 정원 절반만 열고 마감 시각에 증분 복원 |
| `/post-linkedin` | 후기 한 편을 매체 네 곳에 각각 다시 썼다 | 정본에서 파생, 초안까지만 자동 |
| `/check-ai-not-to-do` | 외부에 나가는 글에서 AI 티가 났다 | 금지어·전형 패턴 일괄 검수 |
| `/audit-memory` | 메모리가 250개가 되자 뭐가 있는지 몰랐다 | 인덱스 정합·중복·상충·아카이브 후보 탐지 |

## 사람 없이 도는 것

정해진 시각에 알아서 도는 작업이 52건입니다. 아침 6시에 회고 자리를 만들고, 3시 반에 상품을 백업하고, 7시 반에 멤버 명단을 대조합니다.

각 작업은 시작과 끝에 신호를 보냅니다. 예상 시각까지 신호가 안 오면 알림이 옵니다. 왜 이렇게 했는지는 [자동화가 멈춘 걸 아무도 모르는 게 제일 무섭다](/posts/silent-failure/)에 적었습니다.

## 전체 목록

## 오케스트레이션 (22개)

| 명령 | 하는 일 |
|---|---|
| `/run-book-prep` | 책 인쇄 사양 입력 → 인터프로 견적 + 책등 자동 산출 → 내지 템플릿 .indd → 표지 템플릿 .indd 까지 한 흐름으로 진행합니다. 각 단계마다 사용자 확인을 받습니다. |
| `/run-content-ops` | 이벤트 후기 생성부터 아임웹 HTML 변환까지 콘텐츠 제작 워크플로우를 실행합니다. |
| `/run-crm-mailing` | 휴면 멤버에게 4통(T1 안부 → T2 콘텐츠 → T3 이벤트 → T4 다음 시즌)을 D+0/5/10/18 일정으로 보내는 캠페인 스킬. 매 회차마다 수신자 리스트업 → 본문 미리보기 → 사용자 o |
| `/run-daily-note` | 하루 마무리 시 실행. 작업 내역 자동 수집 → 미리알림 관리 → 출석 확인 → 커밋/푸시까지 한 번에 처리합니다. |
| `/run-event-ops` | 이벤트(스페셜 토크·저자 북토크·AAR 밋업·브랜드 토크 등) 진행에 필요한 작업을 시점에 맞춰 순차 안내·실행합니다. 개별 스킬을 깜빡하지 않고 흐름으로 챙기기 위한 에이전트입니다. |
| `/run-higgsfield-batch` | **어떤 마크다운 문서든 입력 받아 그 안의 모든 프롬프트(코드펜스 ` ``` ` 블록)를 단계적으로 4장씩 자동 생성**하는 범용 힉스필드 배치 스킬. 결과는 정리된 폴더 구조로 저장하고 인덱스 |
| `/run-image-ops` | source 폴더의 이미지를 용도에 맞게 자동 분류합니다. |
| `/run-instagram-report` | @hfk_official 인스타그램 인바운드(태그·해시태그·스토리 리그램) 집계 + 내용 정리 |
| `/run-member-roadmap` | 시즌 등록 마감 직후 또는 시즌 종료 후 1회 실행. 통합멤버십 시트와 Slack 4L 캔버스를 다시 읽어 멤버 로드맵 페이지(https://thehfk.github.io/hfk-dashboards |
| `/run-odc-ops` | ODC(One Day Crew) 멤버 1년 멤버십 운영 자동화 스킬. 매 시즌 등록 오픈 직전·마감 직후마다 반복되는 작업 묶음입니다. |
| `/run-product-ops` | 상품 백업 → 완성도 평가 → 보완 → 동기화까지 상품 관리 전체 워크플로우를 실행합니다. |
| `/run-rereg-campaign` | HFK 재등록 캠페인 (타겟 산출 → 문안 → 검증 → 슬랙·메일 발송) |
| `/run-season-editing` | 시즌 상품노트 전체를 에디팅해 발뮤다형 상세페이지까지 만드는 파이프라인. 26가을(2026-07-17~07-22, 세션 d202fba4·a970f6fd·c79add0c·0adb29d6)에서 만든 방 |
| `/run-season-ops` | 새 시즌의 슬랙 운영을 시작하는 에이전트. 이전 시즌 채널 정리, 신규 채널 생성, 4L 캔버스 생성, 멤버 초대, 캔버스 회차 시드까지 일괄 처리합니다. |
| `/run-season-planning` | 새 시즌 기획·운영 준비(상품 노트 생성, 일정 제안, 시즌 레터, 공지 예약 등)를 자동으로 수행합니다. 슬랙 채널·캔버스·멤버 초대 같은 운영 시작 셋업은 `/run-season-ops`를 사용 |
| `/run-wednesday` | 매주 수요일, 한 주간의 슬랙 활동 정리부터 핸드아웃 생성, 공지 예약, 시즌레터, 녹취 콘텐츠까지 순차 실행합니다. |
| `/wed-announce` | run-wednesday를 쪼갠 5개 중 하나. **멤버 대상 공지·발표가 몰린 가장 중요한 클러스터.** 각 발송은 미리보기 필수. |
| `/wed-data` | run-wednesday를 쪼갠 5개 중 하나. **멤버 로드맵 + 운영 대시보드 갱신** (백그라운드 batch 중심). |
| `/wed-handout` | run-wednesday를 쪼갠 5개 중 하나. **이번 주 세션 준비** (핸드아웃 + 도착체크 + 4L). 응집도 높음(전부 금주 수~차주 화 세션 대상). |
| `/wed-maintain` | run-wednesday를 쪼갠 5개 중 하나. **주간 콘텐츠·감사·백업** (대부분 선택/ask-first). |
| `/wed-review` | run-wednesday를 쪼갠 5개 중 하나. **슬랙 리뷰 → 미리알림 → to-do-log** (읽기중심·저위험). |
| `/wed` | 프리플라이트(예약 실행 환경) + 쪼갠 5개 클러스터(`wed-review`·`wed-handout`·`wed-announce`·`wed-data`·`wed-maintain`)를 **순서대로 이어서 |

## 시즌·상품 (18개)

| 명령 | 하는 일 |
|---|---|
| `/clone-and-move-product` | 지난 시즌 상품을 다음 시즌으로 옮기되, 원래 카테고리에는 복사본을 남겨 발자취를 보존합니다. 아임웹 + Obsidian 제품노트 + 캘린더 + 하드코딩 ref까지 한 번에 정리합니다. |
| `/close-season` | 끝난 시즌의 `work/{시즌}/` 을 **전수** 훑어 승격 / 보관 / 폐기 3분류로 비웁니다. |
| `/deploy-product-note` | 팀 이름 하나만 받아서 26가을 제품노트를 아임웹 상세페이지에 배포하고, 배포가 끝나면 |
| `/evaluate-teams` | 지정된 카테고리(시즌)의 상품 노트들을 두 층으로 평가합니다: |
| `/harvest-season-evidence` | 지난 시즌 팀 슬랙 채널과 4L 캔버스에서 아래 3가지를 추출해 팀별 근거 파일을 만듭니다. 상세페이지의 "지난 시즌엔 이런 질문을 나눴어요" 섹션과 소개글 업데이트의 재료입니다. |
| `/link-product-references` | 상품 노트 본문에서 책·상품·기업명을 추출해 화이트리스트 표로 정리하고, 사용자 확인 후 공식 URL을 마크다운 링크로 일괄 삽입합니다. |
| `/plan-teams` | 회의록·기존 팀 분석·매출 플레이북·알라딘 도서 트렌드·통합멤버십을 근거로, 한 시즌의 신규 팀 N개를 기획하고 제품노트 초안 + 라인업 + 파트너 후보까지 만듭니다. 새 분석을 만들지 않고, 이미 |
| `/refresh-presale` | 새 시즌이 시작될 때, 아임웹 **사전등록 상품(product_no 195 "멤버십 사전 등록", thehfk.org/shop_view?idx=195)** 을 새 시즌으로 한 번에 갱신한다. 요약설 |
| `/refund-member` | 멤버 환불 요청을 받아 규정에 맞는 환불액을 산출하고, 아임웹 취소 승인까지 실행합니다. |
| `/refund-out-of-window` | 시즌 오픈이 그룹별로 순차 진행될 때, 자기 등록 기간이 열리기 전에 결제한 사람을 찾아 |
| `/rename-team` | 팀 이름이 참조되는 모든 위치(캘린더, 상품 노트, 트래킹, 대시보드 HTML)를 한 번에 검색·치환합니다. 부분적 변경으로 데이터 불일치가 생기는 것을 막기 위해, 항상 전체 범위를 먼저 보여주고 |
| `/set-presale` | Imweb 상품에 `use_pre_sale=true` + `pre_sale_start_date` (+ 선택적 `pre_sale_end_date`)를 설정해, **Imweb 자체 기능으로** 정해진 |
| `/set-product-badges` | 아임웹 상품에 붙는 뱃지(신상품 / MD추천 / 주문폭주 등)를 시즌 단위로 한 번에 세팅한다. |
| `/swap-schedule` | 두 팀의 진행 시간을 서로 교체합니다. 상품 노트, 대시보드, 구글 캘린더를 한 번에 수정합니다. |
| `/sync-adventure-attendance` | 시즌 어드벤처 신청 채널(기본 26여름 = `#1--26여름-어드벤처-신청`)의 모든 메타 공지를 읽고, 각 어드벤처 세션의 확정자(선착순 3명)를 출석 시트의 시즌 어드벤처 탭(기본 `26여름 어 |
| `/sync-event-attendance` | HFK 캘린더의 [이벤트] 일정을 모두 읽고, 각 이벤트 채널의 회차 공지 thread에서 "참석 확정" 댓글의 멘션 + 봇의 "참석자 변경" 취소자 차감을 통해 실제 참석자를 추출, 출석 시트의 |
| `/sync-products` | Obsidian에서 수정한 상품 노트를 아임웹에 동기화합니다. |
| `/sync-season-data` | product/.md 변경 사항을 SSOT JSON과 추천 위젯 데이터 블록에 일괄 반영합니다. 시즌 운영 중 팀 이름·일정·본문이 변경되면 추천 위젯·대시보드가 옛 정보로 응답하지 않도록 동기화합 |

## 이벤트·공지 (17개)

| 명령 | 하는 일 |
|---|---|
| `/check-ai-not-to-do` | 외부 노출 콘텐츠 발행 전 "AI 티"(금지어·AI 전형 패턴·문체 위반) 일괄 검수 |
| `/check-event-arrivals` | 이벤트/세션 시작 30분 전, 공지 스레드에 **도착 체크박스 댓글**을 단다. 개인 @태그·리액션 추측을 쓰지 않는다(태그 오인 방지). 명단은 신뢰할 수 있는 출처에서만 온다: |
| `/check-reactions` | 공지 URL을 입력받아 리액션하지 않은 **현재 시즌 팀 멤버**를 찾고, 스레드에 멘션 댓글을 답니다. |
| `/manage-signup-thread` | 슬랙 공지 스레드에 **댓글로 신청받는 선착순 이벤트**를 자동 관리합니다. 신청 순서대로 정원까지 ✅(white_check_mark) 리액션을 달고, 확정/대기 명단을 갱신합니다. |
| `/notify-partner-roster` | 팀별 신청자 명단을 파트너에게 안내. 시트·캘린더 정본에서 명단을 조립해 회차별 문안으로 렌더하고, 셀프 DM에 ✅ 승인한 팀만 예약 발송 |
| `/open-event-signup` | 시즌노트/레터의 이벤트를 받아 **(1) 신청 폼 항목을 만들고 (2) 슬랙 공지를 올리는** 표준 워크플로우. |
| `/post-adventure-attendees` | `#1--26여름-어드벤처-신청` 채널의 최신 메타 공지를 읽어 등재된 팀 채널들의 세션 공지 스레드 댓글에서 신청자/취소자를 추출하고, **선착순 최대 3명**을 참석 확정으로, 나머지는 대기자로 |
| `/post-arrival-check` | 2-- 이벤트 공지 스레드에, 시작 30분 전 **일반 도착 리마인드 + 도착 체크박스** 댓글을 답니다. 개인 @태그는 걸지 않고(태그 오인 방지) 확정자 이름은 체크박스 라벨로만 표기합니다. 체 |
| `/post-event-attendees` | 아임웹 입력폼에서 다운로드한 xlsx 명단을 읽어, 지정한 슬랙 공지 스레드에 "참석 확정 / 대기자" 댓글을 자동 분류하여 게시합니다. |
| `/post-linkedin` | HFK 콘텐츠를 링크드인용 글로 다시 써서 Buffer에 **초안**으로 등록하고 운영자에게 슬랙 DM으로 알린다. 라이브 발행은 하지 않는다. 사람이 Buffer에서 확인·수정 후 직접 발행한다. |
| `/post-signup-attendees` | 상시 구글 폼 응답에서 특정 이벤트 신청자를 읽어, 슬랙 공지 스레드에 **확정/대기 댓글**을 게시하고 신청자 개인에게 **확정/대기 DM**을 보냅니다. (아임웹 xlsx 기반 `/post-ev |
| `/post-to-buffer` | PNG 폴더와 캡션을 받아 R2에 올리고 Buffer로 예약/즉시 발행한다. 후기 카드뿐 아니라 모든 카드뉴스·SNS 이미지에 쓴다. |
| `/relay-form-response` | 지정한 구글 폼에 새 응답이 들어오면 응답 내용을 슬랙 DM과 이메일로 전달합니다. |
| `/schedule-4l-reminders` | 지정 기간(기본: 오늘~+6일)에 진행될 HFK 팀 세션의 4L 리뷰 리마인드 메시지를 |
| `/schedule-notices` | 입력받은 기간에 세션이 있는 팀을 찾아 슬랙 채널별 공지 메시지를 생성하고, 테스트 확인 후 예약 발송합니다. |
| `/schedule-unhide-product` | 아임웹 상품의 `prod_status`를 정해진 시각에 자동으로 변경합니다 (대표 용례: 숨김 `nosale` → 판매중 `sale`). macOS launchd 일회성 LaunchAgent로 등록 |
| `/send-partner-briefing` | 시즌 사전 서베이 마감 후, 팀별 파트너에게 브리핑 PDF를 DM으로 보내고 #hfk-partners 채널에 시즌 전체 브리핑을 게시한다. |

## 멤버 관리 (10개)

| 명령 | 하는 일 |
|---|---|
| `/add-contacts` | 통합멤버십 시트에서 특정 시즌 멤버를 Google 주소록(People API)에 일괄 추가/업데이트합니다. |
| `/detect-churn-signals` | 시즌 진행 중, 라이브 출석 시트를 읽어 불참이 누적된 멤버를 이탈 신호로 감지하고, |
| `/extract-reregistration-contacts` | 다음 시즌 등록 오픈 직전, 이전 시즌 등록자 중 새 시즌에 아직 등록 안 한 멤버를 추출해 SMS·DM 안내·쿠폰 발급 대상으로 정리합니다. |
| `/invite-new-members` | (수동 폴백) 신규 멤버 슬랙 가입초대 + 주소록 추가. 평상시엔 cron이 자동 처리 |
| `/manage-member` | 멤버 추가, 삭제, 이동을 처리합니다. 관련된 모든 시스템을 일괄 수정합니다. |
| `/move-member` | > `/manage-member` 스킬의 이동(move) 기능 바로가기입니다. |
| `/send-member-roadmap` | 각 멤버에게 본인의 로드맵 페이지 링크를 Slack DM으로 발송한다. `/run-member-roadmap`을 먼저 실행해 데이터 갱신 + GitHub Pages 배포가 완료된 상태에서 호출한다. |
| `/send-softlanding-newmembers` | 시즌 시작 후 **진짜 뉴멤버(첫 참여)**에게 HFK 정착 안내를 개별 슬랙 DM으로 보냅니다. |
| `/send-welcome-email` | 결제 직후~슬랙 초대 사이의 침묵 구간을 메우는 환영 메일을 **등록 이메일로 1통** 보냅니다. |
| `/sync-slack-profiles` | HFK 멤버 Slack 표시 이름·직책 표준화 (계획 산출 + 자기-변경 안내 DM) |

## 콘텐츠 제작 (16개)

| 명령 | 하는 일 |
|---|---|
| `/convert-review-to-html` | 마크다운으로 작성된 후기를 순수 HTML 코드로 변환합니다. CSS나 inline style 없이 시맨틱 HTML 태그만 사용합니다. |
| `/convert-to-imweb` | Obsidian 마크다운(.md) 파일을 읽어 Imweb NOTE 게시판에 붙여넣을 수 있는 HTML 코드로 변환합니다. |
| `/draft-from-recording` | 클로버노트 텍스트 파일 또는 오디오 파일(m4a/mp3/wav 등)을 가져와 리뷰 초안을 생성하는 워크플로우입니다. 오디오 파일이면 mlx-whisper로 직접 트랜스크립션합니다. |
| `/expand-cover-concepts` | JD101 권별 표지를 **여러 스타일 컨셉으로 동시에 전개**하기 위한 힉스필드 프롬프트를 생성하는 메타 스킬. 결과 마크다운은 `run-higgsfield-batch`로 바로 넘길 수 있는 형식 |
| `/expand-idea` | 아이디어 노트를 바탕으로 완성도 높은 상품 초안(draft)을 작성합니다. |
| `/generate-certificate` | 수강생 정보를 입력받아 Google Sheets 수강확인증 템플릿을 수정하고 PDF로 다운로드합니다. |
| `/generate-event-review` | 녹취 텍스트 파일을 기반으로 HFK(Harvard Business Review Forum Korea) 멤버십 이벤트 또는 외부 컨퍼런스 후기를 자동 생성합니다. |
| `/generate-handout` | 세션 날짜를 입력하면 해당 날짜 모든 팀의 A4 핸드아웃 PDF를 생성하고 GitHub Pages에 배포합니다. |
| `/generate-letter` | 공지 볼트의 레터 템플릿을 기반으로 HFK(Harvard Business Review Forum Korea) 시즌레터를 자동 생성합니다. |
| `/generate-product-content` | 상품 노트의 MD 본문을 읽어 `## 요약 (simple_content)`과 `## 상세 원문 텍스트 (content)` 섹션을 생성/갱신합니다. sync-products는 이 두 섹션을 그대로 I |
| `/generate-team-review` | 녹취 텍스트 파일을 기반으로 HFK 팀 활동 후기를 자동 생성합니다. |
| `/make-nametags` | HFK사람들 시트의 시즌 탭에서 멤버 + 파트너 이름을 읽어 90×60mm 명찰을 1인 1페이지로 만들고, 합본 단일 PDF + 개별 PDF + 명단 CSV까지 자동 생성합니다. 일러스트레이터/인디 |
| `/make-review-cards` | 아임웹에 쌓인 멤버 후기를 받아 HFK 카드뉴스(PNG)로 만든다. 디자인은 [docs/CARD-NEWS-GUIDE.md](../../docs/CARD-NEWS-GUIDE.md)를 따른다. |
| `/make-season-dialogue` | 시즌을 만드는 대화 - 가을시즌 기획 대화 에피소드 생성 (웹사이트·링크드인·인스타 3채널 버전) |
| `/recap` | 세션 리캡 - 이 창에서 뭘 하고 있었는지, 다른 창에서 뭐가 돌아가고 있는지 정리 |
| `/update-card-news` | 카드뉴스 템플릿의 사진과 글을 교체합니다. 디자인은 그대로, 내용만 바뀝니다. |

## 감사 (7개)

| 명령 | 하는 일 |
|---|---|
| `/audit-membership-consistency` | 멤버십 정합성 감사. 통합멤버십 시트 ↔ 슬랙 팀채널 ↔ 출석 시트 3소스 전수 대조. 읽기 전용 리포트만 내고, 수정은 audit-team-channels·manage-member·reconcil |
| `/audit-memory` | `~/hfk-workspace/memory/*.md` 전체를 스캔하여 메모리 품질 이슈를 탐지합니다. 인덱스 정합, 훅(description) 품질, [[링크]] 무결성, 아카이브 후보, 중복·상충 |
| `/audit-partner-comms` | 파트너 일정 소통 감사. 카톡·슬랙DM(내가 알려준 일정) ↔ 상품노트 ↔ 아임웹 라이브 ↔ 구글캘린더 4자 전수 대조. 읽기 전용 리포트만 내고 수정은 update-schedule·sync-pro |
| `/audit-product-templates` | 지정된 시즌 폴더의 모든 팀 노트에서 특정 섹션의 템플릿 일관성을 감사합니다. 헤딩 형식, 분량, 필수 서브섹션, 필드 충족 여부를 비교해 일탈한 팀을 식별합니다. |
| `/audit-security` | hfk-workspace 워크스페이스 전반의 credential 노출, 파일 권한, git 오염을 점검합니다. 월 1회 실행 권장. |
| `/audit-skills` | `.claude/commands/*.md` 전체를 스캔하여 품질 이슈를 탐지합니다. 토큰 낭비, 인증 에러 위험, stale 참조, 병렬화 여지, 중복 로직 5가지를 점검하고 리포트를 저장합니다. |
| `/audit-team-channels` | 시즌 (멤버×팀) 배정 ↔ 슬랙 팀 채널 가입 전수 대조 감사 + 누락분 멱등 초대 + 유령 초대(다른 이메일로 가입) 탐지·복구 |

## 운영 인프라 (12개)

| 명령 | 하는 일 |
|---|---|
| `/add-reminder` | 아이폰 미리알림(Reminders)에 To-Do 항목을 추가합니다. |
| `/analyze-slack` | Slack 워크스페이스의 메시지를 수집하고 분석하여 hfk-workspace의 `note/분석/` 폴더에 MD 파일로 저장합니다. |
| `/backup-notes` | thehfk.org의 NOTE 게시판 글을 Obsidian에 백업합니다. |
| `/backup-products` | 아임웹의 모든 상품 정보를 Obsidian 노트로 백업합니다. |
| `/cleanup-home` | 홈 디렉토리(`~/`)에 흩어진 업무 관련 폴더·파일을 감사하고, 정리 방향을 제시한 뒤 안전하게 정리합니다. |
| `/hello-world` | 하루를 시작할 때 실행. 코드 동기화 → 스킬 현황 → 캘린더 → 미리알림 → 어제 이어서 할 일까지, 아무것도 놓치지 않게 브리핑합니다. |
| `/review-model-choices` | Reddit(r/ClaudeAI, r/LocalLLaMA, r/Anthropic)과 Anthropic 공식 릴리즈 노트를 수집하여 현재 스킬-모델 매핑에 대한 개선 제안을 담은 주간 리포트를 생성합 |
| `/save-conversation` | 현재 대화 세션의 내용을 구조화된 Markdown 파일로 정리하여 저장합니다. |
| `/save-output` | 직전 작업의 출력 결과를 구조화된 Markdown 파일로 정리하여 저장합니다. |
| `/session-dashboard` | 오늘 진행한 Claude Code 세션을 한 화면에 모아 봅니다. 세션마다 처음 목표, 턴별 흐름(나의 프롬프트 → Claude 응답 요약), 사용한 도구·스킬·만든 파일, 진행 상태를 카드로 정리 |
| `/update-skill-guide` | `.claude/commands/` 폴더의 모든 스킬을 스캔하여 스킬 가이드를 자동 업데이트합니다. |
| `/view-slack-archive` | Slack export ZIP 파일을 브라우저에서 열람하거나, Obsidian 마크다운 볼트로 변환합니다. |

## 그 밖 (23개)

| 명령 | 하는 일 |
|---|---|
| `/brief-event-speaker` | 아임웹에서 받은 신청 xlsx로 이벤트 발표자에게 전달할 등록자 브리핑 마크다운을 생성합니다. 통합멤버십(members.json)과 전화번호로 교차 매칭해 직장·직무·연차를 채우고, 응답을 질문/기 |
| `/categorize-images-hfk` | 사진 촬영 시간과 HFK 캘린더 일정을 매칭하여 이벤트별로 폴더를 자동 정리합니다. |
| `/categorize-images-imweb` | 이미지를 팀 테마에 맞게 자동 분류합니다. |
| `/color-guide` | HFK 브랜드 컬러 시스템 정보를 안내합니다. 디자인 작업, 콘텐츠 제작, 웹 개발 시 참고할 수 있는 공식 컬러 팔레트입니다. |
| `/confirm-deposit` | 입금 SMS를 읽어서, 지정한 구글 폼 응답 시트의 신청자 행 마지막 열에 "입금 완료"를 표시합니다. |
| `/create-slack-channels` | CSV 파일을 읽어 Slack 채널을 생성하고, 이메일로 멤버를 초대합니다. |
| `/edit-premiere-xml` | Premiere Pro에서 내보낸 FCP XML 파일의 자막 수정, 내용 정리, 분량 편집을 수행합니다. |
| `/export-to-figma` | 카드뉴스를 Figma로 내보내거나, Figma 파일을 Claude Code로 읽어와 수정합니다. |
| `/ga-report` | Google Analytics 4에서 페이지별 조회수, 방문자 수, 세션 수, 이벤트 수를 월별로 조회하여 CSV 파일로 저장합니다. |
| `/indd-outline-and-export` | member-books의 Vol-01~10 .indd 파일을 복제해서 모든 텍스트를 윤곽선(outline) 처리한 뒤, 그 결과를 PDF로 내보냅니다. 원본은 건드리지 않습니다. |
| `/manage-attendance-26summer` | HFK 2026 여름시즌 출석 스프레드시트를 관리합니다. |
| `/manage-attendance` | > ⚠️ **이 스킬은 26봄 시즌 전용이고 시트 탭·팀 목록이 26봄으로 하드코딩돼 있습니다.** |
| `/manage-season-stock` | 시즌 등록 기간에 상품 재고를 정원의 일부만 열어두고, 재등록 마감 시각에 나머지를 일괄로 풀면서 일반등록 오픈까지 예약합니다. |
| `/normalize-profile-gallery` | 투명 레이어 PNG 인물 사진들을 흑백 변환 + 얼굴 기반 밝기 균일화 + 얼굴 사이즈 정규화로 갤러리 통일감을 만듭니다. |
| `/print-interpro-indigo` | 인터프로프린트 인디고 출력 견적 폼을 Playwright로 자동 호출하고, 책등 두께도 같이 계산합니다. |
| `/process-screenshots` | Photos 앱의 스크린샷과 inbox 폴더의 이미지를 OCR 처리하여 옵시디언 노트로 저장합니다. |
| `/rename-by-content` | 파일 내용을 읽어 적절한 파일명을 제안하고 변경합니다. 텍스트 파일(.md, .txt, .json 등), 이미지(.png, .jpg, .heic, .webp 등), PDF 모두 지원합니다. |
| `/seed-canvas-sessions` | 옵시디언 상품 노트의 회차별 주제를 4L 캔버스에 일괄 시드합니다. 시즌 시작 시 한 번 실행하면 모든 회차 헤더가 캔버스에 미리 들어갑니다. |
| `/select-team-photos` | 시즌 팀 제품노트에 넣을 사진을, 팀 1개=라운드 1개로 하나씩 HTML에서 골라 노트에 자동 반영한다. |
| `/update-cs-doc` | HFK CS 응대 매뉴얼 갱신 + 구글 드라이브 재발행 |
| `/update-dashboard` | 시즌 운영 대시보드의 데이터를 최신 상태로 갱신합니다. |
| `/update-presentations` | hfk-workspace의 발표 HTML 파일을 hfk-presentations 레포에 복사하고 GitHub Pages에 배포합니다. |
| `/update-schedule` | 구글 캘린더에서 HFK 일정을 가져와 상품 정보를 업데이트합니다. |