/**
 * seulki.log 지표 → Google Sheets 일별 누적
 *
 * 사전 준비
 *  1) 시트 열고 확장 프로그램 > Apps Script
 *  2) 왼쪽 "서비스" + 클릭 > "Google Analytics Data API" 추가 (식별자: AnalyticsData)
 *  3) 프로젝트 설정 > "appsscript.json 매니페스트 파일 표시" 체크 후,
 *     appsscript.json 에 아래 oauthScopes 블록 추가 (검색 시트에 필요)
 *       "oauthScopes": [
 *         "https://www.googleapis.com/auth/spreadsheets",
 *         "https://www.googleapis.com/auth/script.scriptapp",
 *         "https://www.googleapis.com/auth/script.external_request",
 *         "https://www.googleapis.com/auth/analytics.readonly",
 *         "https://www.googleapis.com/auth/webmasters.readonly"
 *       ]
 *  4) PROPERTY_ID 교체 — GA4 > 관리 > 속성 설정 > 속성 세부정보 > 속성 ID (9자리 숫자)
 *  5) listSites() 한 번 실행 → 실행 로그에 뜬 값을 SITE_URL 에 붙여넣기
 *  6) setup() 실행 → 권한 승인 + 매일 오전 8시 트리거 등록
 */

const PROPERTY_ID = '000000000';  // ← 교체
const SITE_URL = 'sc-domain:seulkilog.today';  // ← listSites() 결과로 확인
const SPREADSHEET_ID = '1An8bf3MlabVTjcOHPfzhHtVgG4dSJDXQCugqBL0-1B8';
const LOOKBACK_DAYS = 4;   // GA4: 최근 N일 재수집 (늦게 들어오는 데이터 보정)
const SC_LOOKBACK = 12;    // 검색: Search Console은 2~3일 지연돼 더 길게 본다

function setup() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('collect').timeBased().atHour(8).everyDays(1).create();
  collect();
}

function collect() {
  syncDaily();
  syncPages();
  syncChannels();
  syncReadDepth();
  syncSearch();
}

/* ---------- 시트별 정의 ---------- */

function syncDaily() {
  sync({
    sheetName: '일별',
    keyCols: 1,
    dimensions: ['date'],
    metrics: ['totalUsers', 'newUsers', 'sessions', 'screenPageViews',
              'engagedSessions', 'averageSessionDuration'],
    headers: ['날짜', '사용자', '신규', '세션', '페이지뷰', '참여세션', '평균참여시간(초)'],
  });
}

function syncPages() {
  sync({
    sheetName: '글별',
    keyCols: 2,
    dimensions: ['date', 'pagePath'],
    metrics: ['screenPageViews', 'totalUsers', 'userEngagementDuration'],
    headers: ['날짜', '경로', '페이지뷰', '사용자', '총참여시간(초)'],
  });
}

function syncChannels() {
  sync({
    sheetName: '유입',
    keyCols: 2,
    dimensions: ['date', 'sessionDefaultChannelGroup'],
    metrics: ['sessions', 'totalUsers', 'engagedSessions'],
    headers: ['날짜', '어디서 왔나', '세션', '사용자', '참여세션'],
    translate: { 1: channelKo },   // 2번째 열(채널)을 우리말로 바꿔 넣는다
  });
}

/** 읽기 깊이: site.js가 보내는 scroll_25 … scroll_100 이벤트 집계 */
function syncReadDepth() {
  sync({
    sheetName: '읽기깊이',
    keyCols: 3,
    dimensions: ['date', 'pagePath', 'eventName'],
    metrics: ['eventCount'],
    headers: ['날짜', '경로', '어디까지 읽음', '횟수'],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { matchType: 'BEGINS_WITH', value: 'scroll_' },
      },
    },
    translate: { 2: depthKo },
  });
}

/* ---------- 사람이 읽는 말로 바꾸기 ---------- */

const CHANNEL_KO = {
  'Direct': '직접 방문 (주소창·북마크)',
  'Organic Search': '검색으로 유입 (구글·네이버)',
  'Organic Social': 'SNS에서 유입',
  'Organic Video': '영상에서 유입 (유튜브 등)',
  'Referral': '다른 사이트 링크 타고',
  'Email': '이메일 링크',
  'Paid Search': '검색 광고',
  'Paid Social': 'SNS 광고',
  'Display': '배너 광고',
  'Affiliates': '제휴 링크',
  'Unassigned': '분류 안 됨',
};

const DEPTH_KO = {
  'scroll_25': '4분의 1까지',
  'scroll_50': '절반까지',
  'scroll_75': '4분의 3까지',
  'scroll_100': '끝까지 다 읽음',
};

function channelKo(v) { return CHANNEL_KO[v] || v; }
function depthKo(v) { return DEPTH_KO[v] || v; }

/* ---------- Search Console ---------- */

/** 내 계정에 등록된 사이트 목록을 로그에 찍는다. SITE_URL 값 확인용. */
function listSites() {
  const res = scFetch('https://www.googleapis.com/webmasters/v3/sites', null);
  (res.siteEntry || []).forEach(s => Logger.log('%s  (권한: %s)', s.siteUrl, s.permissionLevel));
  if (!res.siteEntry) Logger.log('등록된 사이트가 없습니다. Search Console에 사이트를 먼저 등록하세요.');
}

function syncSearch() {
  const end = daysAgo(1);
  const start = daysAgo(SC_LOOKBACK);
  const url = 'https://www.googleapis.com/webmasters/v3/sites/'
            + encodeURIComponent(SITE_URL) + '/searchAnalytics/query';

  let res;
  try {
    res = scFetch(url, {
      startDate: start, endDate: end,
      dimensions: ['date', 'query'],
      type: 'web', rowLimit: 5000,
    });
  } catch (e) {
    Logger.log('검색 시트 건너뜀: %s', e.message);
    return;
  }

  const rows = (res.rows || []).map(r => [
    r.keys[0],                        // 날짜
    r.keys[1],                        // 검색어
    r.clicks,                         // 클릭 (실제 방문)
    r.impressions,                    // 노출 (검색결과에 보인 횟수)
    Math.round(r.ctr * 1000) / 10,    // 클릭률 %
    Math.round(r.position * 10) / 10, // 평균 순위
  ]);

  writeRows({
    sheetName: '검색',
    keyCols: 2,
    headers: ['날짜', '검색어', '클릭(방문)', '노출(보인 횟수)', '클릭률(%)', '평균순위'],
  }, rows);
}

function scFetch(url, payload) {
  const opt = {
    method: payload ? 'post' : 'get',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  };
  if (payload) opt.payload = JSON.stringify(payload);

  const res = UrlFetchApp.fetch(url, opt);
  const code = res.getResponseCode();
  if (code !== 200) {
    throw new Error('Search Console ' + code + ' — ' + res.getContentText().slice(0, 300));
  }
  return JSON.parse(res.getContentText());
}

/* ---------- 공통 로직 ---------- */

function sync(cfg) {
  let rows = runReport(cfg.dimensions, cfg.metrics, cfg.dimensionFilter);
  if (cfg.translate) {
    rows = rows.map(r => {
      const out = r.slice();
      Object.keys(cfg.translate).forEach(i => { out[i] = cfg.translate[i](out[i]); });
      return out;
    });
  }
  writeRows(cfg, rows);
}

/** 같은 키는 갱신, 새 키는 추가. 몇 번을 돌려도 중복이 안 쌓인다. */
function writeRows(cfg, rows) {
  if (!rows.length) { Logger.log('%s: 가져온 데이터 없음', cfg.sheetName); return; }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(cfg.sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(cfg.sheetName);
    sheet.appendRow(cfg.headers);
    sheet.setFrozenRows(1);
  }

  const last = sheet.getLastRow();
  const width = cfg.headers.length;
  const existing = last > 1 ? sheet.getRange(2, 1, last - 1, width).getValues() : [];

  const index = {};
  existing.forEach((r, i) => { index[key(r, cfg.keyCols)] = i; });

  let added = 0;
  rows.forEach(r => {
    const k = key(r, cfg.keyCols);
    if (k in index) {
      existing[index[k]] = r;
    } else {
      index[k] = existing.length;
      existing.push(r);
      added++;
    }
  });

  existing.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  sheet.getRange(2, 1, existing.length, width).setValues(existing);
  Logger.log('%s: 총 %s행 (신규 %s)', cfg.sheetName, existing.length, added);
}

function key(row, n) {
  return row.slice(0, n).join(' ');
}

function runReport(dimensions, metrics, dimensionFilter) {
  const req = {
    dateRanges: [{ startDate: LOOKBACK_DAYS + 'daysAgo', endDate: 'yesterday' }],
    dimensions: dimensions.map(name => ({ name })),
    metrics: metrics.map(name => ({ name })),
    orderBys: [{ dimension: { dimensionName: 'date' } }],
    limit: 10000,
  };
  if (dimensionFilter) req.dimensionFilter = dimensionFilter;

  const res = AnalyticsData.Properties.runReport(req, 'properties/' + PROPERTY_ID);
  if (!res.rows) return [];

  return res.rows.map(row => {
    const dims = row.dimensionValues.map((v, i) =>
      dimensions[i] === 'date' ? fmtDate(v.value) : v.value);
    const mets = row.metricValues.map(v => Number(v.value));
    return dims.concat(mets);
  });
}

function fmtDate(yyyymmdd) {
  return yyyymmdd.slice(0, 4) + '-' + yyyymmdd.slice(4, 6) + '-' + yyyymmdd.slice(6, 8);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return Utilities.formatDate(d, 'GMT+9', 'yyyy-MM-dd');
}
