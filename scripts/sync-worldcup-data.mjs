import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "public", "data", "worldcup-live.json");
const execFileAsync = promisify(execFile);

const ESPN_SCOREBOARD_URL =
  process.env.ESPN_SCOREBOARD_URL ??
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const ESPN_STANDINGS_URL =
  process.env.ESPN_STANDINGS_URL ??
  "https://site.web.api.espn.com/apis/v2/sports/soccer/fifa.world/standings";
const ESPN_TEAMS_URL =
  process.env.ESPN_TEAMS_URL ??
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams";
const ESPN_SUMMARY_URL =
  process.env.ESPN_SUMMARY_URL ??
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary";
const ESPN_DATES = process.env.ESPN_DATES ?? "20260611-20260719";
const ESPN_SUMMARY_CONCURRENCY = Number(process.env.ESPN_SUMMARY_CONCURRENCY ?? 6);
const ESPN_SUMMARY_LIMIT = Number(process.env.ESPN_SUMMARY_LIMIT ?? 104);
const MATCH_DETAIL_SCHEMA_VERSION = 9;
const SYNC_INTERVAL_MS = Number(process.env.WORLDCUP_SYNC_INTERVAL_MS ?? 60 * 1000);
const DISPLAY_TIME_ZONE = process.env.WORLDCUP_DISPLAY_TIME_ZONE ?? "Asia/Shanghai";
const POLYMARKET_ENABLED = process.env.POLYMARKET_ENABLED !== "false";
const POLYMARKET_GAMMA_URL = process.env.POLYMARKET_GAMMA_URL ?? "https://gamma-api.polymarket.com";
const POLYMARKET_SERIES_ID = process.env.POLYMARKET_SERIES_ID ?? "11433";
const POLYMARKET_EVENTS_LIMIT = Number(process.env.POLYMARKET_EVENTS_LIMIT ?? 40);
const POLYMARKET_SEARCH_LIMIT = Number(process.env.POLYMARKET_SEARCH_LIMIT ?? 8);
const POLYMARKET_SEARCH_CONCURRENCY = Number(process.env.POLYMARKET_SEARCH_CONCURRENCY ?? 6);
const POLYMARKET_CONNECT_TIMEOUT_SECONDS = Number(process.env.POLYMARKET_CONNECT_TIMEOUT_SECONDS ?? 10);
const POLYMARKET_MAX_TIME_SECONDS = Number(process.env.POLYMARKET_MAX_TIME_SECONDS ?? 30);
const POLYMARKET_DEBUG = process.env.POLYMARKET_DEBUG === "true";

const zhTeamNames = {
  Albania: "阿尔巴尼亚",
  Algeria: "阿尔及利亚",
  Andorra: "安道尔",
  Angola: "安哥拉",
  Argentina: "阿根廷",
  Armenia: "亚美尼亚",
  Aruba: "阿鲁巴",
  Australia: "澳大利亚",
  Austria: "奥地利",
  Azerbaijan: "阿塞拜疆",
  Bahrain: "巴林",
  Belarus: "白俄罗斯",
  Belgium: "比利时",
  Bermuda: "百慕大",
  Bolivia: "玻利维亚",
  "Bosnia-Herzegovina": "波黑",
  Brazil: "巴西",
  Bulgaria: "保加利亚",
  "Burkina Faso": "布基纳法索",
  Burundi: "布隆迪",
  Cambodia: "柬埔寨",
  Cameroon: "喀麦隆",
  Canada: "加拿大",
  "Cape Verde": "佛得角",
  "Cape Verde Islands": "佛得角",
  "Cabo Verde": "佛得角",
  Chile: "智利",
  China: "中国",
  "Chinese Taipei": "中国台北",
  Colombia: "哥伦比亚",
  "Congo DR": "刚果（金）",
  "Costa Rica": "哥斯达黎加",
  Croatia: "克罗地亚",
  Curacao: "库拉索",
  Curaçao: "库拉索",
  Cyprus: "塞浦路斯",
  Czechia: "捷克",
  "Côte d'Ivoire": "科特迪瓦",
  Denmark: "丹麦",
  "Dominican Republic": "多米尼加共和国",
  "DR Congo": "刚果（金）",
  Ecuador: "厄瓜多尔",
  Egypt: "埃及",
  "El Salvador": "萨尔瓦多",
  England: "英格兰",
  Estonia: "爱沙尼亚",
  "Faroe Islands": "法罗群岛",
  Finland: "芬兰",
  France: "法国",
  Gabon: "加蓬",
  Gambia: "冈比亚",
  Georgia: "格鲁吉亚",
  Germany: "德国",
  Ghana: "加纳",
  Greece: "希腊",
  Guatemala: "危地马拉",
  Guinea: "几内亚",
  Haiti: "海地",
  Honduras: "洪都拉斯",
  Hungary: "匈牙利",
  Iceland: "冰岛",
  Iran: "伊朗",
  "IR Iran": "伊朗",
  Iraq: "伊拉克",
  Israel: "以色列",
  Italy: "意大利",
  "Ivory Coast": "科特迪瓦",
  Jamaica: "牙买加",
  Japan: "日本",
  Jordan: "约旦",
  Kazakhstan: "哈萨克斯坦",
  Kenya: "肯尼亚",
  "Korea Republic": "韩国",
  Kosovo: "科索沃",
  Kuwait: "科威特",
  Kyrgyzstan: "吉尔吉斯斯坦",
  Latvia: "拉脱维亚",
  Liechtenstein: "列支敦士登",
  Lithuania: "立陶宛",
  Luxembourg: "卢森堡",
  Madagascar: "马达加斯加",
  Mali: "马里",
  Malta: "马耳他",
  Mauritania: "毛里塔尼亚",
  Mexico: "墨西哥",
  Moldova: "摩尔多瓦",
  Montenegro: "黑山",
  Morocco: "摩洛哥",
  Netherlands: "荷兰",
  "New Zealand": "新西兰",
  Nicaragua: "尼加拉瓜",
  Nigeria: "尼日利亚",
  "North Macedonia": "北马其顿",
  "Northern Ireland": "北爱尔兰",
  Norway: "挪威",
  Oman: "阿曼",
  Panama: "巴拿马",
  Paraguay: "巴拉圭",
  Peru: "秘鲁",
  Portugal: "葡萄牙",
  Poland: "波兰",
  "Puerto Rico": "波多黎各",
  Qatar: "卡塔尔",
  "Republic of Ireland": "爱尔兰",
  Romania: "罗马尼亚",
  Russia: "俄罗斯",
  "Saudi Arabia": "沙特阿拉伯",
  Scotland: "苏格兰",
  Senegal: "塞内加尔",
  Serbia: "塞尔维亚",
  Slovakia: "斯洛伐克",
  Slovenia: "斯洛文尼亚",
  "South Africa": "南非",
  "South Korea": "韩国",
  Spain: "西班牙",
  Sweden: "瑞典",
  Switzerland: "瑞士",
  Tunisia: "突尼斯",
  Türkiye: "土耳其",
  Turkey: "土耳其",
  "Trinidad and Tobago": "特立尼达和多巴哥",
  Ukraine: "乌克兰",
  "United Arab Emirates": "阿联酋",
  "United States": "美国",
  Uruguay: "乌拉圭",
  Uzbekistan: "乌兹别克斯坦",
  Venezuela: "委内瑞拉",
  Wales: "威尔士",
  Zambia: "赞比亚",
  Zimbabwe: "津巴布韦",
};

const teamAliases = {
  "bosnia-herzegovina": ["bosnia herzegovina", "bosnia and herzegovina", "bosnia"],
  "cape verde": ["cape verde", "cape verde islands", "cabo verde"],
  "cape verde islands": ["cape verde", "cape verde islands", "cabo verde"],
  "congo dr": ["congo dr", "dr congo", "democratic republic of congo"],
  curaçao: ["curacao", "curaçao"],
  "czechia": ["czechia", "czech republic"],
  "ivory coast": ["ivory coast", "cote divoire", "cote d ivoire", "côte d'ivoire"],
  iran: ["iran", "ir iran"],
  netherlands: ["netherlands", "nld"],
  "south korea": ["south korea", "korea republic", "korea"],
  switzerland: ["switzerland", "che"],
  türkiye: ["turkiye", "türkiye", "turkey"],
  "united states": ["united states", "usa", "us"],
  uruguay: ["uruguay", "ury"],
};

const stageNames = {
  "group-stage": "小组赛",
  "round-of-32": "32强",
  "round-of-16": "16强",
  quarterfinals: "四分之一决赛",
  semifinals: "半决赛",
  "3rd-place-match": "三四名决赛",
  final: "决赛",
};

const stageLabelMap = {
  Group: "小组赛",
  "Round of 32": "32强",
  "Rd of 16": "16强",
  Quarterfinals: "四分之一决赛",
  Semifinals: "半决赛",
  "3rd-Place Match": "三四名决赛",
  Final: "决赛",
};

const statLabelsZh = {
  accuratePasses: "成功传球",
  defensiveInterventions: "防守干预",
  expectedGoals: "预期进球",
  foulsCommitted: "犯规",
  goalAssists: "助攻",
  goalDifference: "净胜球",
  goalsConceded: "失球",
  offsides: "越位",
  passPct: "传球成功率",
  possessionPct: "控球率",
  redCards: "红牌",
  saves: "扑救",
  shotsOnTarget: "射正",
  totalGoals: "进球",
  totalPasses: "传球",
  totalShots: "射门",
  wonCorners: "角球",
  yellowCards: "黄牌",
};

const resultLabelsZh = {
  W: "胜",
  D: "平",
  L: "负",
};

const competitionNamesZh = new Map([
  ["AFC Asian Cup", "亚洲杯"],
  ["Africa Cup of Nations", "非洲杯"],
  ["CONCACAF Gold Cup", "中北美及加勒比金杯赛"],
  ["CONCACAF Nations League", "中北美及加勒比国家联赛"],
  ["CONMEBOL Copa América", "美洲杯"],
  ["Copa América", "美洲杯"],
  ["FIFA Confederations Cup", "联合会杯"],
  ["FIFA World Cup", "FIFA 世界杯"],
  ["FIFA World Cup Qualifying - AFC", "世界杯亚洲区预选赛"],
  ["FIFA World Cup Qualifying - CAF", "世界杯非洲区预选赛"],
  ["FIFA World Cup Qualifying - Concacaf", "世界杯中北美区预选赛"],
  ["FIFA World Cup Qualifying - CONMEBOL", "世界杯南美区预选赛"],
  ["FIFA World Cup Qualifying - OFC", "世界杯大洋洲区预选赛"],
  ["FIFA World Cup Qualifying - UEFA", "世界杯欧洲区预选赛"],
  ["Gold Cup", "金杯赛"],
  ["International Friendly", "国际友谊赛"],
  ["UEFA European Championship", "欧洲杯"],
  ["European Championship", "欧洲杯"],
  ["European Championship Qualifying", "欧洲杯预选赛"],
  ["UEFA Nations League", "欧国联"],
  ["Olympic Men's Soccer", "奥运会男足"],
  ["World Cup Qualifying - AFC", "世界杯亚洲区预选赛"],
  ["World Cup Qualifying - CAF", "世界杯非洲区预选赛"],
  ["World Cup Qualifying - Concacaf", "世界杯中北美区预选赛"],
  ["World Cup Qualifying - CONMEBOL", "世界杯南美区预选赛"],
  ["World Cup Qualifying - OFC", "世界杯大洋洲区预选赛"],
  ["World Cup Qualifying - UEFA", "世界杯欧洲区预选赛"],
]);

const weekdayZh = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "world-cup-data-portal/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }

  return response.json();
}

function withParams(baseUrl, params) {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

async function fetchJsonWithCurl(url) {
  const { stdout } = await execFileAsync(
    "curl",
    [
      "-L",
      "--connect-timeout",
      String(POLYMARKET_CONNECT_TIMEOUT_SECONDS),
      "--max-time",
      String(POLYMARKET_MAX_TIME_SECONDS),
      "--retry",
      "2",
      "--retry-delay",
      "1",
      "-sS",
      url,
    ],
    { maxBuffer: 32 * 1024 * 1024 },
  );
  return JSON.parse(stdout);
}

function parseMaybeJsonArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function aliasesForTeam(team) {
  const sourceName = team?.sourceName ?? "";
  const base = normalizeText(sourceName);
  const display = normalizeText(team?.name);
  const code = normalizeText(team?.code);
  const aliasItems = [
    base,
    display,
    code,
    ...(teamAliases[sourceName.toLowerCase()] ?? []),
    ...(teamAliases[base] ?? []),
  ];
  return unique(aliasItems.map(normalizeText).filter((alias) => alias.length >= 3));
}

function textHasAlias(text, aliases) {
  return aliases.some((alias) => alias && text.includes(alias));
}

function statValue(stats = [], name, fallback = 0) {
  const stat = stats.find((item) => item.name === name || item.type === name);
  return Number(stat?.value ?? stat?.displayValue ?? fallback) || fallback;
}

function statDisplay(stats = [], name, fallback = "0") {
  const stat = stats.find((item) => item.name === name || item.type === name);
  return stat?.displayValue ?? String(stat?.value ?? fallback);
}

function translateSeedName(name) {
  const value = String(name ?? "");
  const groupWinner = /^Group\s+([A-L])\s+Winner$/i.exec(value);
  if (groupWinner) {
    return `${groupWinner[1].toUpperCase()}组第一`;
  }

  const groupSecond = /^Group\s+([A-L])\s+2nd\s+Place$/i.exec(value);
  if (groupSecond) {
    return `${groupSecond[1].toUpperCase()}组第二`;
  }

  const thirdPlace = /^Third\s+Place\s+Group\s+(.+)$/i.exec(value);
  if (thirdPlace) {
    return `${thirdPlace[1].replace(/\//g, "/")}组第三名之一`;
  }

  const roundWinner = /^Round\s+of\s+(\d+)\s+(\d+)\s+Winner$/i.exec(value);
  if (roundWinner) {
    return `${roundWinner[1]}强第${roundWinner[2]}场胜者`;
  }

  const quarterWinner = /^Quarterfinal\s+(\d+)\s+Winner$/i.exec(value);
  if (quarterWinner) {
    return `四分之一决赛第${quarterWinner[1]}场胜者`;
  }

  const semifinalWinner = /^Semifinal\s+(\d+)\s+Winner$/i.exec(value);
  if (semifinalWinner) {
    return `半决赛第${semifinalWinner[1]}场胜者`;
  }

  const semifinalLoser = /^Semifinal\s+(\d+)\s+Loser$/i.exec(value);
  if (semifinalLoser) {
    return `半决赛第${semifinalLoser[1]}场负者`;
  }

  return "";
}

function teamDisplayName(team) {
  const translatedSeed = translateSeedName(team?.displayName) || translateSeedName(team?.name);
  return zhTeamNames[team?.displayName] ?? zhTeamNames[team?.name] ?? (translatedSeed || team?.displayName || team?.name || "待定");
}

function buildTeamsMap(teamsPayload, scoreboardPayload, standingsPayload) {
  const teams = {};

  function addTeam(team, group = "") {
    if (!team?.id) {
      return;
    }
    const existing = teams[String(team.id)];
    teams[String(team.id)] = {
      name: teamDisplayName(team),
      code: team.abbreviation ?? team.shortDisplayName ?? "TBD",
      flag: "",
      flagUrl: team.logo ?? team.logos?.[0]?.href ?? "",
      group: group || existing?.group || "",
      form: existing?.form ?? "待更新",
      sourceName: team.displayName ?? team.name,
    };
  }

  for (const entry of teamsPayload.sports?.[0]?.leagues?.[0]?.teams ?? []) {
    addTeam(entry.team);
  }

  for (const group of standingsPayload.children ?? []) {
    const groupName = group.name?.replace("Group ", "") ? `${group.name.replace("Group ", "")}组` : "";
    for (const entry of group.standings?.entries ?? []) {
      addTeam(entry.team, groupName);
    }
  }

  for (const event of scoreboardPayload.events ?? []) {
    for (const competition of event.competitions ?? []) {
      for (const competitor of competition.competitors ?? []) {
        addTeam(competitor.team);
        const existing = teams[String(competitor.team.id)];
        if (existing && competitor.form) {
          existing.form = competitor.form;
        }
      }
    }
  }

  return teams;
}

function dateParts(isoDate) {
  const date = new Date(isoDate);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: DISPLAY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  const weekday = weekdayZh[Number(new Intl.DateTimeFormat("en-US", { timeZone: DISPLAY_TIME_ZONE, weekday: "short" }).formatToParts(date).length) % 7];
  const displayDate = new Date(date.toLocaleString("en-US", { timeZone: DISPLAY_TIME_ZONE }));

  return {
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
    date: `${parts.month}-${parts.day}`,
    day: weekdayZh[displayDate.getDay()],
    time: `${parts.hour}:${parts.minute}`,
    sortTime: date.getTime(),
  };
}

function stageFrom(event, competition) {
  const slug = event.season?.slug;
  if (stageNames[slug]) {
    return stageNames[slug];
  }
  const note = competition.altGameNote ?? "";
  if (/Group/i.test(note)) {
    return "小组赛";
  }
  return stageLabelMap[note.replace("FIFA World Cup, ", "")] ?? "淘汰赛";
}

function groupFrom(competition) {
  const note = competition.altGameNote ?? "";
  const groupMatch = /Group\s+([A-L])/i.exec(note);
  if (groupMatch) {
    return `${groupMatch[1].toUpperCase()}组`;
  }
  const cleaned = note.replace("FIFA World Cup, ", "");
  if (!cleaned || cleaned === "FIFA World Cup") {
    return "淘汰赛";
  }
  return stageLabelMap[cleaned] ?? cleaned;
}

function normalizeStatus(status) {
  if (status?.type?.completed) {
    return "已结束";
  }
  if (status?.type?.state === "in") {
    return "进行中";
  }
  return "未开始";
}

function getCompetitor(competition, homeAway) {
  return competition.competitors?.find((competitor) => competitor.homeAway === homeAway);
}

function scoreFor(status, home, away) {
  if (status === "未开始") {
    return "-";
  }
  return `${home?.score ?? 0} - ${away?.score ?? 0}`;
}

function scoringPlayersFor(details = [], teamId) {
  return details
    .filter((detail) => detail.scoringPlay && String(detail.team?.id) === String(teamId))
    .flatMap((detail) => detail.athletesInvolved ?? [])
    .map((athlete) => athlete.shortName ?? athlete.displayName ?? athlete.fullName)
    .filter(Boolean);
}

function buildMatches(scoreboardPayload) {
  return (scoreboardPayload.events ?? [])
    .map((event) => {
      const competition = event.competitions?.[0];
      const home = getCompetitor(competition, "home");
      const away = getCompetitor(competition, "away");
      const status = normalizeStatus(competition.status);
      const dateInfo = dateParts(event.date);

      return {
        id: String(event.id),
        date: dateInfo.date,
        isoDate: dateInfo.isoDate,
        day: dateInfo.day,
        time: dateInfo.time,
        sortTime: dateInfo.sortTime,
        stage: stageFrom(event, competition),
        group: groupFrom(competition),
        matchday: event.season?.type ?? "",
        home: String(home?.team?.id ?? `home-${event.id}`),
        away: String(away?.team?.id ?? `away-${event.id}`),
        score: scoreFor(status, home, away),
        status,
        venue: competition.venue?.fullName ?? "待定场馆",
        city: competition.venue?.address?.city ?? "",
        weather: "天气数据待接入",
        timeElapsed: competition.status?.type?.shortDetail ?? competition.status?.type?.description ?? "",
        homeScore: status === "未开始" ? null : Number(home?.score ?? 0),
        awayScore: status === "未开始" ? null : Number(away?.score ?? 0),
        homeScorers: scoringPlayersFor(competition.details, home?.team?.id),
        awayScorers: scoringPlayersFor(competition.details, away?.team?.id),
      };
    })
    .sort((a, b) => a.sortTime - b.sortTime || Number(a.id) - Number(b.id));
}

function buildStandings(standingsPayload, teams) {
  const standings = {};

  for (const group of standingsPayload.children ?? []) {
    const letter = group.name?.replace("Group ", "") ?? "";
    const groupName = letter ? `${letter}组` : group.name;
    standings[groupName] = (group.standings?.entries ?? [])
      .map((entry) => {
        const stats = entry.stats ?? [];
        const teamId = String(entry.team.id);
        return {
          team: teamId,
          played: statValue(stats, "gamesPlayed"),
          win: statValue(stats, "wins"),
          draw: statValue(stats, "ties"),
          loss: statValue(stats, "losses"),
          gf: statValue(stats, "pointsFor"),
          ga: statValue(stats, "pointsAgainst"),
          gd: statDisplay(stats, "pointDifferential"),
          gdValue: statValue(stats, "pointDifferential"),
          pts: statValue(stats, "points"),
          teamName: teams[teamId]?.name ?? entry.team.displayName,
        };
      })
      .sort((a, b) => b.pts - a.pts || b.gdValue - a.gdValue || b.gf - a.gf || a.teamName.localeCompare(b.teamName));
  }

  return standings;
}

function buildPlayers(matches, teams) {
  const scorerMap = new Map();

  function addScorers(teamKey, scorers) {
    for (const scorer of scorers) {
      const key = `${scorer}-${teamKey}`;
      const current = scorerMap.get(key) ?? {
        name: scorer,
        country: teamKey,
        team: teams[teamKey]?.name ?? "",
        goals: 0,
        assists: 0,
        rating: 0,
        shots: 0,
      };
      current.goals += 1;
      current.rating = Number((7 + current.goals * 0.4).toFixed(1));
      current.shots = current.goals * 2;
      scorerMap.set(key, current);
    }
  }

  for (const match of matches) {
    addScorers(match.home, match.homeScorers);
    addScorers(match.away, match.awayScorers);
  }

  return [...scorerMap.values()].sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name)).slice(0, 50);
}

function buildTeamStats(standings, teams) {
  return Object.entries(standings)
    .flatMap(([group, rows]) =>
      rows.map((row) => ({
        team: row.team,
        group,
        played: row.played,
        goalsFor: row.gf,
        goalsAgainst: row.ga,
        goalDifference: row.gd,
        points: row.pts,
        form: teams[row.team]?.form ?? "待更新",
        name: teams[row.team]?.name ?? row.team,
      })),
    )
    .sort((a, b) => b.points - a.points || Number.parseInt(b.goalDifference, 10) - Number.parseInt(a.goalDifference, 10));
}

function displayDateTime(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: DISPLAY_TIME_ZONE,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.month}-${map.day} ${map.hour}:${map.minute}`;
}

function translateCompetitionName(name) {
  const value = String(name ?? "").trim();
  if (!value) {
    return "";
  }

  const hostWorldCup = /^World Cup\s+-\s+(.+?)\s+(\d{4})$/i.exec(value);
  if (hostWorldCup) {
    const host = zhTeamNames[hostWorldCup[1]] ?? hostWorldCup[1];
    return `${hostWorldCup[2]} ${host}世界杯`;
  }

  const yearSuffixGroup = /^Group Stage\s+(\d{4})$/i.exec(value);
  if (yearSuffixGroup) {
    return `${yearSuffixGroup[1]} 小组赛`;
  }

  const yearMatch = /^(\d{4})\s+(.+)$/.exec(value);
  const year = yearMatch?.[1] ?? "";
  const base = yearMatch?.[2] ?? value;
  const normalizedBase = base.toLowerCase();
  const translated =
    competitionNamesZh.get(base) ??
    [...competitionNamesZh.entries()].find(([english]) => english.toLowerCase() === normalizedBase)?.[1] ??
    [...competitionNamesZh.entries()].find(([english]) => normalizedBase.includes(english.toLowerCase()))?.[1] ??
    base;

  return year ? `${year} ${translated}` : translated;
}

function teamIdFromSummaryTeam(team) {
  return String(team?.id ?? "");
}

function resolveSummaryTeamName(team, teams) {
  const teamId = teamIdFromSummaryTeam(team);
  return teams[teamId]?.name ?? teamDisplayName(team);
}

function normalizeStatItem(stat) {
  return {
    key: stat.name,
    label: statLabelsZh[stat.name] ?? stat.label ?? stat.displayName ?? stat.name,
    value: stat.displayValue ?? String(stat.value ?? "-"),
  };
}

function statValueFromRosterEntry(entry, names) {
  const stats = entry.stats ?? [];
  const stat = stats.find((item) => names.includes(item.name));
  return stat?.displayValue ?? (Number.isFinite(stat?.value) ? String(stat.value) : "");
}

function normalizePlayer(entry) {
  return {
    id: String(entry.athlete?.id ?? entry.id ?? entry.athlete?.displayName ?? ""),
    name: entry.athlete?.displayName ?? entry.athlete?.fullName ?? entry.displayName ?? "待定球员",
    shortName: entry.athlete?.shortName ?? entry.athlete?.displayName ?? entry.displayName ?? "待定",
    jersey: entry.jersey ?? "",
    position: entry.position?.abbreviation ?? entry.position?.displayName ?? "",
    starter: Boolean(entry.starter),
    subbedIn: Boolean(entry.subbedIn),
    subbedOut: Boolean(entry.subbedOut),
    goals: statValueFromRosterEntry(entry, ["totalGoals", "goals"]) || "0",
    shots: statValueFromRosterEntry(entry, ["totalShots"]) || "0",
    passes: statValueFromRosterEntry(entry, ["accuratePasses", "totalPasses"]) || "",
  };
}

function normalizeLineups(summary, match, teams) {
  const rosterBySide = { home: null, away: null };

  for (const entry of summary.rosters ?? []) {
    const side = entry.homeAway === "away" ? "away" : entry.homeAway === "home" ? "home" : null;
    const teamId = teamIdFromSummaryTeam(entry.team);
    const resolvedSide = side ?? (teamId === match.home ? "home" : teamId === match.away ? "away" : null);
    if (!resolvedSide) {
      continue;
    }

    const roster = entry.roster ?? [];
    const starters = roster.filter((player) => player.starter).map(normalizePlayer);
    const substitutes = roster.filter((player) => !player.starter).map(normalizePlayer);
    rosterBySide[resolvedSide] = {
      team: resolvedSide === "home" ? match.home : match.away,
      teamName: teams[resolvedSide === "home" ? match.home : match.away]?.name ?? resolveSummaryTeamName(entry.team, teams),
      formation: entry.formation ?? "待公布",
      status: starters.length ? "official" : roster.length ? "squad" : "pending",
      starters,
      substitutes,
    };
  }

  return {
    home: rosterBySide.home ?? {
      team: match.home,
      teamName: teams[match.home]?.name ?? "主队",
      formation: "待公布",
      status: "pending",
      starters: [],
      substitutes: [],
    },
    away: rosterBySide.away ?? {
      team: match.away,
      teamName: teams[match.away]?.name ?? "客队",
      formation: "待公布",
      status: "pending",
      starters: [],
      substitutes: [],
    },
  };
}

function normalizeTeamBoxStats(summary, match) {
  const sides = { home: [], away: [] };
  for (const teamEntry of summary.boxscore?.teams ?? []) {
    const teamId = teamIdFromSummaryTeam(teamEntry.team);
    const side = teamId === match.home ? "home" : teamId === match.away ? "away" : null;
    if (!side) {
      continue;
    }
    sides[side] = (teamEntry.statistics ?? []).map(normalizeStatItem);
  }

  const keys = [...new Set([...sides.home, ...sides.away].map((item) => item.key))];
  return keys.map((key) => {
    const home = sides.home.find((item) => item.key === key);
    const away = sides.away.find((item) => item.key === key);
    return {
      key,
      label: home?.label ?? away?.label ?? statLabelsZh[key] ?? key,
      home: home?.value ?? "-",
      away: away?.value ?? "-",
    };
  });
}

function normalizeLeaders(summary, teams) {
  return (summary.leaders ?? []).map((teamLeaders) => ({
    teamId: teamIdFromSummaryTeam(teamLeaders.team),
    teamName: resolveSummaryTeamName(teamLeaders.team, teams),
    leaders: (teamLeaders.leaders ?? []).map((category) => {
      const leader = category.leaders?.[0];
      return {
        key: category.name,
        label: statLabelsZh[category.name] ?? category.displayName ?? category.name,
        player: leader?.athlete?.displayName ?? "待定",
        value: leader?.displayValue ?? "",
        summary: leader?.summary ?? "",
      };
    }),
  }));
}

function normalizeEventHistory(event, sourceTeam, teams) {
  const opponent = event.opponent ?? {};
  return {
    id: String(event.id ?? `${event.gameDate}-${opponent.id ?? "opponent"}`),
    date: displayDateTime(event.gameDate),
    sourceTeam: resolveSummaryTeamName(sourceTeam, teams),
    opponent: resolveSummaryTeamName(opponent, teams),
    atVs: event.atVs ?? "",
    score: event.score ?? "",
    result: resultLabelsZh[event.gameResult] ?? event.gameResult ?? "",
    competition: translateCompetitionName(event.competitionName ?? event.leagueName),
  };
}

function normalizeHeadToHead(summary, teams) {
  return (summary.headToHeadGames ?? [])
    .flatMap((group) => (group.events ?? []).map((event) => normalizeEventHistory(event, group.team, teams)))
    .slice(0, 8);
}

function normalizeRecentForm(summary, teams) {
  return (summary.lastFiveGames ?? []).map((group) => ({
    teamId: teamIdFromSummaryTeam(group.team),
    teamName: resolveSummaryTeamName(group.team, teams),
    events: (group.events ?? []).slice(0, 5).map((event) => normalizeEventHistory(event, group.team, teams)),
  }));
}

function normalizeMediaImage(image, source, headline = "") {
  if (!image?.url) {
    return null;
  }
  return {
    imageUrl: image.url,
    alt: image.alt ?? image.caption ?? image.name ?? headline ?? "世界杯比赛实况图",
    caption: image.caption ?? image.name ?? headline ?? "",
    credit: image.credit ?? "",
    source,
  };
}

function imageForArticle(article, match, teams) {
  const images = article?.images ?? [];
  const matchedImages = match && teams ? images.filter((image) => imageMatchesEitherTeam(image, match, teams)) : images;
  return (
    matchedImages.find((image) => image.url && image.width >= image.height) ??
    matchedImages.find((image) => image.url) ??
    images.find((image) => image.url && image.width >= image.height) ??
    images.find((image) => image.url) ??
    null
  );
}

function mediaTextForArticle(article) {
  return normalizeText([
    article?.headline,
    article?.description,
    article?.images?.map((image) => [image.name, image.caption, image.alt].filter(Boolean).join(" ")).join(" "),
  ].filter(Boolean).join(" "));
}

function articleMatchesTeams(article, match, teams) {
  const text = mediaTextForArticle(article);
  return textHasAlias(text, aliasesForTeam(teams[match.home])) && textHasAlias(text, aliasesForTeam(teams[match.away]));
}

function imageMatchesEitherTeam(image, match, teams) {
  const text = normalizeText([image?.name, image?.caption, image?.alt].filter(Boolean).join(" "));
  return textHasAlias(text, aliasesForTeam(teams[match.home])) || textHasAlias(text, aliasesForTeam(teams[match.away]));
}

function extractMatchMedia(summary, match, teams) {
  const articleImage = (summary.article?.images ?? []).find((image) => image.url && image.width >= image.height);
  const video = (summary.videos ?? []).find((item) => item.thumbnail);
  const newsArticle = (summary.news?.articles ?? []).find(
    (article) => articleMatchesTeams(article, match, teams) && (article.images ?? []).some((image) => image.url),
  );
  const newsImages = (newsArticle?.images ?? []).filter((image) => imageMatchesEitherTeam(image, match, teams));
  const newsImage = newsImages.find((image) => image.url && image.width >= image.height) ?? newsImages.find((image) => image.url);
  const newsMedia = normalizeMediaImage(newsImage, "ESPN news", newsArticle?.headline);

  return (
    normalizeMediaImage(articleImage, "ESPN article", summary.article?.headline) ??
    (video?.thumbnail
      ? {
          imageUrl: video.thumbnail,
          alt: video.description ?? video.headline ?? "世界杯视频缩略图",
          caption: video.headline ?? "",
          credit: "",
          source: "ESPN video",
          link: video.links?.web?.href ?? "",
        }
      : null) ??
    (newsMedia ? { ...newsMedia, link: newsArticle?.links?.web?.href ?? "" } : null)
  );
}

function normalizeVideo(video) {
  if (!video?.thumbnail && !video?.headline) {
    return null;
  }
  return {
    id: String(video.id ?? video.cerebroId ?? video.headline ?? ""),
    headline: video.headline ?? "世界杯视频",
    description: video.description ?? "",
    thumbnail: video.thumbnail ?? "",
    link: video.links?.web?.href ?? "",
    videoUrl:
      video.links?.source?.HD?.href ??
      video.links?.source?.full?.href ??
      video.links?.source?.href ??
      video.links?.mobile?.source?.href ??
      "",
    duration: video.duration ?? "",
    source: "ESPN video",
  };
}

function normalizeVideos(summary) {
  return (summary.videos ?? []).map(normalizeVideo).filter(Boolean).slice(0, 6);
}

function normalizeNewsArticle(article, match, teams, source = "ESPN news") {
  if (!article?.headline) {
    return null;
  }
  const image = imageForArticle(article, match, teams);
  return {
    id: String(article.id ?? article.nowId ?? article.headline),
    headline: article.headline,
    description: article.description ?? article.caption ?? article.linkText ?? "",
    imageUrl: image?.url ?? "",
    imageAlt: image?.alt ?? image?.caption ?? image?.name ?? article.headline,
    credit: image?.credit ?? "",
    link: article.links?.web?.href ?? article.links?.mobile?.href ?? "",
    publishedAt: article.published ?? article.originallyPosted ?? article.lastModified ?? "",
    updatedAt: article.lastModified ?? article.published ?? "",
    source,
    matchId: match?.id ?? "",
    matchLabel: match && teams ? `${teams[match.home]?.name ?? "主队"} vs ${teams[match.away]?.name ?? "客队"}` : "",
    stage: match?.stage ?? "",
    status: match?.status ?? "",
  };
}

function normalizeMatchNews(summary, match, teams) {
  const matchReport = normalizeNewsArticle(summary.article, match, teams, "ESPN article");
  const relatedNews = (summary.news?.articles ?? [])
    .map((article) => normalizeNewsArticle(article, articleMatchesTeams(article, match, teams) ? match : null, teams, "ESPN news"))
    .filter(Boolean);
  return [matchReport, ...relatedNews].filter(Boolean).slice(0, 10);
}

function normalizeMatchSummary(summary, match, teams) {
  const referee = (summary.gameInfo?.officials ?? []).find((official) => official.position?.name === "Referee");
  return {
    schemaVersion: MATCH_DETAIL_SCHEMA_VERSION,
    fetchedAt: new Date().toISOString(),
    source: "ESPN summary",
    status: summary.header?.competitions?.[0]?.status?.type?.description ?? match.status,
    lineups: normalizeLineups(summary, match, teams),
    stats: normalizeTeamBoxStats(summary, match),
    leaders: normalizeLeaders(summary, teams),
    headToHead: normalizeHeadToHead(summary, teams),
    recentForm: normalizeRecentForm(summary, teams),
    media: extractMatchMedia(summary, match, teams),
    videos: normalizeVideos(summary),
    news: normalizeMatchNews(summary, match, teams),
    gameInfo: {
      attendance: summary.gameInfo?.attendance ? Number(summary.gameInfo.attendance).toLocaleString("zh-CN") : "",
      referee: referee?.displayName ?? referee?.fullName ?? "",
      venue: summary.gameInfo?.venue?.fullName ?? match.venue,
    },
  };
}

function buildNewsFeed(matchDetails, matches, teams) {
  const matchById = new Map(matches.map((match) => [match.id, match]));
  const seen = new Set();
  return Object.entries(matchDetails)
    .flatMap(([matchId, detail]) => {
      const match = matchById.get(matchId);
      return (detail.news ?? []).map((item) => ({
        ...item,
        matchId: item.matchId || matchId,
        matchLabel: item.matchLabel || "",
        stage: item.stage || match?.stage || "",
        status: item.status || match?.status || "",
      }));
    })
    .filter((item) => {
      const key = item.id || `${item.headline}-${item.link}`;
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.publishedAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.publishedAt || 0).getTime();
      return bTime - aTime || a.headline.localeCompare(b.headline);
    })
    .slice(0, 36);
}

function buildDataDocs({ matches, teams, totalTeams, standings, matchDetails, predictions, polymarket, finishedAt }) {
  const details = Object.values(matchDetails);
  const detailsWithMedia = details.filter((detail) => detail.media?.imageUrl).length;
  const detailsWithVideo = details.filter((detail) => (detail.videos ?? []).length).length;
  const detailsWithNews = details.filter((detail) => (detail.news ?? []).length).length;
  const oddsRows = Object.values(predictions).flatMap((prediction) => prediction.odds ?? []);
  const polymarketRows = oddsRows.filter((row) => row.source === "polymarket").length;

  return {
    updatedAt: finishedAt.toISOString(),
    refreshMs: SYNC_INTERVAL_MS,
    timeZone: DISPLAY_TIME_ZONE,
    sources: [
      {
        name: "ESPN FIFA World Cup scoreboard",
        url: withParams(ESPN_SCOREBOARD_URL, { dates: ESPN_DATES, limit: "500" }),
        fields: ["赛程", "比分", "比赛状态", "场馆", "进球球员"],
      },
      {
        name: "ESPN FIFA World Cup standings",
        url: ESPN_STANDINGS_URL,
        fields: ["小组积分榜", "胜平负", "进失球", "积分"],
      },
      {
        name: "ESPN FIFA World Cup summary",
        url: ESPN_SUMMARY_URL,
        fields: ["阵容", "技术统计", "历史交锋", "近期战绩", "新闻", "实况照片", "视频"],
      },
      {
        name: "Polymarket Gamma",
        url: `${POLYMARKET_GAMMA_URL}/events?series_id=${POLYMARKET_SERIES_ID}`,
        fields: ["即时预测市场", "隐含概率"],
      },
      {
        name: "小红书直播入口",
        url: "https://www.xiaohongshu.com/livelist?channel_id=0&channel_type=web_live_list",
        fields: ["直播", "回看", "精彩瞬间入口"],
      },
    ],
    coverage: [
      { label: "赛程", value: `${matches.length} 场` },
      { label: "球队", value: `${totalTeams ?? Object.keys(teams).length} 队` },
      { label: "积分榜", value: `${Object.keys(standings).length} 个小组` },
      { label: "比赛详情", value: `${details.length} 场` },
      { label: "实况照片", value: `${detailsWithMedia} 场` },
      { label: "视频", value: `${detailsWithVideo} 场` },
      { label: "新闻", value: `${detailsWithNews} 场` },
      { label: "Polymarket", value: `${polymarketRows || polymarket.meta.matches || 0} 场` },
    ],
    updatePolicy: [
      "本地 watcher 每分钟拉取 ESPN 与 Polymarket 公共接口并写入 public/data/worldcup-live.json。",
      "已结束比赛会复用同 schema 的详情缓存；进行中和未开始比赛每轮刷新详情、媒体、新闻与赔率。",
      "新闻页与数据说明页完全读取本地 JSON，因此随同一个刷新节奏更新。",
    ],
  };
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let index = 0;
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await mapper(items[current], current);
    }
  });
  await Promise.all(workers);
  return results;
}

async function buildMatchDetails(matches, teams, previousDetails = {}) {
  const limitedMatches = matches.slice(0, ESPN_SUMMARY_LIMIT);
  const targets = limitedMatches.filter(
    (match) => match.status !== "已结束" || previousDetails[match.id]?.schemaVersion !== MATCH_DETAIL_SCHEMA_VERSION,
  );
  const details = { ...previousDetails };

  await mapWithConcurrency(targets, ESPN_SUMMARY_CONCURRENCY, async (match) => {
    try {
      const summary = await fetchJson(withParams(ESPN_SUMMARY_URL, { event: match.id }));
      details[match.id] = normalizeMatchSummary(summary, match, teams);
    } catch (error) {
      details[match.id] = {
        ...(details[match.id] ?? {}),
        schemaVersion: MATCH_DETAIL_SCHEMA_VERSION,
        source: "ESPN summary",
        lastSyncError: error.message,
        lastSyncErrorAt: new Date().toISOString(),
      };
    }
  });

  return {
    details,
    meta: {
      requested: targets.length,
      total: Object.keys(details).length,
      url: ESPN_SUMMARY_URL,
    },
  };
}

function americanToDecimal(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "-";
  }
  const decimal = number > 0 ? 1 + number / 100 : 1 + 100 / Math.abs(number);
  return decimal.toFixed(2);
}

function impliedProbability(decimal) {
  const number = Number(decimal);
  return Number.isFinite(number) && number > 0 ? 1 / number : 0;
}

function isFullTimePolymarketEvent(event) {
  return /^fifwc-[a-z0-9]+-[a-z0-9]+-[0-9]{4}-[0-9]{2}-[0-9]{2}$/i.test(event?.slug ?? "");
}

function isOpenFullTimePolymarketEvent(event) {
  return isFullTimePolymarketEvent(event) && event?.active !== false && event?.closed !== true;
}

function polymarketEventMatches(event, match, teams) {
  const title = normalizeText(event.title ?? event.question ?? event.slug);
  const homeAliases = aliasesForTeam(teams[match.home]);
  const awayAliases = aliasesForTeam(teams[match.away]);
  return textHasAlias(title, homeAliases) && textHasAlias(title, awayAliases);
}

function yesPriceForMarket(market) {
  const outcomes = parseMaybeJsonArray(market.outcomes).map(normalizeText);
  const prices = parseMaybeJsonArray(market.outcomePrices).map(Number);
  const yesIndex = outcomes.findIndex((outcome) => outcome === "yes");
  const price = prices[yesIndex];
  return Number.isFinite(price) ? price : null;
}

function marketSlot(market, teamsForMatch) {
  const text = normalizeText([market.question, market.title].filter(Boolean).join(" "));
  if (/\bdraw\b|\btie\b/.test(text)) {
    return "draw";
  }
  if (textHasAlias(text, teamsForMatch.homeAliases)) {
    return "home";
  }
  if (textHasAlias(text, teamsForMatch.awayAliases)) {
    return "away";
  }
  return null;
}

function applyMultiOutcomeMarket(market, teamsForMatch, values) {
  const outcomes = parseMaybeJsonArray(market.outcomes);
  const prices = parseMaybeJsonArray(market.outcomePrices).map(Number);
  if (outcomes.length < 3 || prices.length < outcomes.length) {
    return;
  }

  outcomes.forEach((outcome, index) => {
    const label = normalizeText(outcome);
    const price = prices[index];
    if (!Number.isFinite(price)) {
      return;
    }
    if (/\bdraw\b|\btie\b/.test(label)) {
      values.draw ??= price;
    } else if (textHasAlias(label, teamsForMatch.homeAliases)) {
      values.home ??= price;
    } else if (textHasAlias(label, teamsForMatch.awayAliases)) {
      values.away ??= price;
    }
  });
}

function formatPolymarketPrice(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  return `${(value * 100).toFixed(value > 0.1 ? 1 : 2)}%`;
}

function polymarketOddsFromEvent(event, match, teams) {
  const teamsForMatch = {
    homeAliases: aliasesForTeam(teams[match.home]),
    awayAliases: aliasesForTeam(teams[match.away]),
  };
  const values = { home: null, draw: null, away: null };

  for (const market of event.markets ?? []) {
    applyMultiOutcomeMarket(market, teamsForMatch, values);
    const slot = marketSlot(market, teamsForMatch);
    const yesPrice = yesPriceForMarket(market);
    if (slot && Number.isFinite(yesPrice)) {
      values[slot] ??= yesPrice;
    }
  }

  if (![values.home, values.draw, values.away].every(Number.isFinite)) {
    return null;
  }

  return {
    book: "Polymarket",
    source: "polymarket",
    home: formatPolymarketPrice(values.home),
    draw: formatPolymarketPrice(values.draw),
    away: formatPolymarketPrice(values.away),
    homeProbability: values.home,
    drawProbability: values.draw,
    awayProbability: values.away,
    spread: "全场赛果预测市场",
    eventSlug: event.slug,
    eventUrl: `https://polymarket.com/event/${event.slug}`,
    marketTitle: event.title,
  };
}

async function fetchPolymarketSearchEvents(matches, teams, primaryError) {
  const searchBaseUrl = `${POLYMARKET_GAMMA_URL}/public-search`;
  const results = await mapWithConcurrency(matches, POLYMARKET_SEARCH_CONCURRENCY, async (match) => {
    const home = teams[match.home]?.sourceName ?? teams[match.home]?.name ?? match.home;
    const away = teams[match.away]?.sourceName ?? teams[match.away]?.name ?? match.away;
    const query = `${home} vs ${away} World Cup 2026`;
    const url = withParams(searchBaseUrl, { q: query, limit: String(POLYMARKET_SEARCH_LIMIT) });

    try {
      const payload = await fetchJsonWithCurl(url);
      const events = (payload.events ?? payload.data ?? [])
        .filter(isOpenFullTimePolymarketEvent)
        .filter((event) => polymarketEventMatches(event, match, teams));
      if (!events.length && POLYMARKET_DEBUG) {
        console.log(`[polymarket] search miss ${match.id}: ${query}`);
      }
      return {
        event: events[0] ?? null,
        url,
      };
    } catch (error) {
      if (POLYMARKET_DEBUG) {
        console.log(`[polymarket] search error ${match.id}: ${error.message}`);
      }
      return {
        event: null,
        url,
        error: error.message,
      };
    }
  });

  const eventsBySlug = new Map();
  for (const result of results) {
    if (result?.event?.slug && !eventsBySlug.has(result.event.slug)) {
      eventsBySlug.set(result.event.slug, result.event);
    }
  }

  const failedSearches = results.filter((result) => result?.error).length;
  return {
    events: [...eventsBySlug.values()],
    meta: {
      status: "fallback_search",
      strategy: "public-search",
      primaryError: primaryError?.message,
      requestedUrl: searchBaseUrl,
      events: eventsBySlug.size,
      searchedMatches: matches.length,
      failedSearches,
      searchLimit: POLYMARKET_SEARCH_LIMIT,
    },
  };
}

async function fetchPolymarketEvents(matches, teams) {
  if (!POLYMARKET_ENABLED) {
    return { events: [], meta: { status: "disabled", matches: 0, events: 0 } };
  }

  const url = withParams(`${POLYMARKET_GAMMA_URL}/events`, {
    series_id: POLYMARKET_SERIES_ID,
    active: "true",
    closed: "false",
    limit: String(POLYMARKET_EVENTS_LIMIT),
  });
  try {
    const payload = await fetchJsonWithCurl(url);
    const events = (Array.isArray(payload) ? payload : payload.events ?? payload.data ?? []).filter(isOpenFullTimePolymarketEvent);

    return {
      events,
      meta: {
        status: "ok",
        strategy: "events",
        requestedUrl: url,
        events: events.length,
      },
    };
  } catch (error) {
    if (POLYMARKET_DEBUG) {
      console.log(`[polymarket] events endpoint failed: ${error.message}`);
    }
    return fetchPolymarketSearchEvents(matches, teams, error);
  }
}

async function buildPolymarketOdds(matches, teams) {
  const activeMatches = matches.filter((match) => match.status !== "已结束");
  try {
    const { events, meta } = await fetchPolymarketEvents(activeMatches, teams);
    const oddsByMatch = {};

    for (const match of activeMatches) {
      const event = events.find((candidate) => polymarketEventMatches(candidate, match, teams));
      if (!event) {
        if (POLYMARKET_DEBUG) {
          const home = teams[match.home]?.sourceName ?? match.home;
          const away = teams[match.away]?.sourceName ?? match.away;
          console.log(`[polymarket] no event ${match.id}: ${home} vs ${away}`);
        }
        continue;
      }
      const oddsRow = polymarketOddsFromEvent(event, match, teams);
      if (oddsRow) {
        oddsByMatch[match.id] = [oddsRow];
      } else if (POLYMARKET_DEBUG) {
        console.log(`[polymarket] no odds ${match.id}: ${event.title} (${event.slug})`);
        const teamsForMatch = {
          homeAliases: aliasesForTeam(teams[match.home]),
          awayAliases: aliasesForTeam(teams[match.away]),
        };
        console.log(`home aliases: ${teamsForMatch.homeAliases.join(", ")} | away aliases: ${teamsForMatch.awayAliases.join(", ")}`);
        console.log(
          event.markets
            .map((market) => `${marketSlot(market, teamsForMatch) ?? "-"}:${yesPriceForMarket(market) ?? "-"}:${market.question}`)
            .join(" | "),
        );
      }
    }

    return {
      oddsByMatch,
      meta: {
        ...meta,
        scannedMatches: activeMatches.length,
        matches: Object.keys(oddsByMatch).length,
      },
    };
  } catch (error) {
    return {
      oddsByMatch: {},
      meta: {
        status: "error",
        error: error.message,
        scannedMatches: activeMatches.length,
        matches: 0,
      },
    };
  }
}

function normalizeOdds(competition) {
  const odds = competition.odds?.[0];
  if (!odds?.moneyline) {
    return [];
  }
  return [
    {
      book: odds.provider?.displayName ?? odds.provider?.name ?? "ESPN Odds",
      source: "espn",
      home: americanToDecimal(odds.moneyline.home?.close?.odds ?? odds.moneyline.home?.open?.odds),
      draw: americanToDecimal(odds.moneyline.draw?.close?.odds ?? odds.drawOdds?.moneyLine),
      away: americanToDecimal(odds.moneyline.away?.close?.odds ?? odds.moneyline.away?.open?.odds),
      spread: odds.details ?? "",
    },
  ];
}

function predictionFromOdds(oddsRows) {
  const row = oddsRows[0];
  if (!row) {
    return null;
  }
  const home = impliedProbability(row.home);
  const draw = impliedProbability(row.draw);
  const away = impliedProbability(row.away);
  const total = home + draw + away;
  if (!total) {
    return null;
  }
  return {
    home: Number(((home / total) * 100).toFixed(1)),
    draw: Number(((draw / total) * 100).toFixed(1)),
    away: Number(((away / total) * 100).toFixed(1)),
  };
}

function predictionFromPolymarket(oddsRows) {
  const row = oddsRows[0];
  if (!row) {
    return null;
  }
  const home = Number(row.homeProbability);
  const draw = Number(row.drawProbability);
  const away = Number(row.awayProbability);
  const total = home + draw + away;
  if (![home, draw, away, total].every(Number.isFinite) || total <= 0) {
    return null;
  }
  return {
    home: Number(((home / total) * 100).toFixed(1)),
    draw: Number(((draw / total) * 100).toFixed(1)),
    away: Number(((away / total) * 100).toFixed(1)),
  };
}

function fallbackPrediction(match) {
  if (match.status === "已结束") {
    return {
      home: match.homeScore > match.awayScore ? 100 : 0,
      draw: match.homeScore === match.awayScore ? 100 : 0,
      away: match.awayScore > match.homeScore ? 100 : 0,
    };
  }
  return { home: 37.5, draw: 25, away: 37.5 };
}

function buildPredictions(scoreboardPayload, matches, polymarketOddsByMatch = {}) {
  const competitionById = new Map(
    (scoreboardPayload.events ?? []).map((event) => [String(event.id), event.competitions?.[0]]),
  );
  const predictions = {};

  for (const match of matches) {
    const competition = competitionById.get(String(match.id));
    const polymarketOdds = polymarketOddsByMatch[match.id] ?? [];
    const espnOdds = normalizeOdds(competition);
    const odds = polymarketOdds.length ? polymarketOdds : espnOdds;
    const fromOdds = polymarketOdds.length ? predictionFromPolymarket(polymarketOdds) : predictionFromOdds(espnOdds);
    predictions[match.id] = {
      ...(fromOdds ?? fallbackPrediction(match)),
      model: polymarketOdds.length
        ? "Polymarket 即时市场价格隐含概率"
        : fromOdds
          ? "ESPN / DraftKings moneyline 隐含概率"
          : "无赔率时的结果/均衡展示",
      trend: polymarketOdds.length ? "Polymarket live" : fromOdds ? "ESPN odds" : "无实时赔率",
      odds,
    };
  }

  return predictions;
}

async function loadPreviousPayload() {
  if (!existsSync(outputPath)) {
    return null;
  }
  try {
    return JSON.parse(await readFile(outputPath, "utf8"));
  } catch {
    return null;
  }
}

async function syncOnce() {
  const startedAt = new Date();
  const previousPayload = await loadPreviousPayload();
  const [scoreboardPayload, standingsPayload, teamsPayload] = await Promise.all([
    fetchJson(withParams(ESPN_SCOREBOARD_URL, { dates: ESPN_DATES, limit: "500" })),
    fetchJson(ESPN_STANDINGS_URL),
    fetchJson(ESPN_TEAMS_URL),
  ]);

  const teams = buildTeamsMap(teamsPayload, scoreboardPayload, standingsPayload);
  const matches = buildMatches(scoreboardPayload);
  const standings = buildStandings(standingsPayload, teams);
  const players = buildPlayers(matches, teams);
  const teamStats = buildTeamStats(standings, teams);
  const matchDetails = await buildMatchDetails(matches, teams, previousPayload?.matchDetails ?? {});
  const polymarket = await buildPolymarketOdds(matches, teams);
  const predictions = buildPredictions(scoreboardPayload, matches, polymarket.oddsByMatch);
  const news = buildNewsFeed(matchDetails.details, matches, teams);
  const oddsRows = Object.values(predictions).flatMap((prediction) => prediction.odds);
  const oddsCount = Object.values(predictions).filter((prediction) => prediction.odds.length).length;
  const polymarketCount = oddsRows.filter((row) => row.source === "polymarket").length;
  const espnOddsCount = oddsRows.filter((row) => row.source === "espn").length;
  const finishedAt = new Date();
  const dataDocs = buildDataDocs({
    matches,
    teams,
    totalTeams: teamsPayload.sports?.[0]?.leagues?.[0]?.teams?.length ?? Object.values(teams).length,
    standings,
    matchDetails: matchDetails.details,
    predictions,
    polymarket,
    finishedAt,
  });

  const payload = {
    meta: {
      source: "ESPN FIFA World Cup API",
      sourceName: "ESPN FIFA World Cup API",
      scoreboardUrl: withParams(ESPN_SCOREBOARD_URL, { dates: ESPN_DATES, limit: "500" }),
      standingsUrl: ESPN_STANDINGS_URL,
      teamsUrl: ESPN_TEAMS_URL,
      summaryUrl: ESPN_SUMMARY_URL,
      fetchedAt: finishedAt.toISOString(),
      startedAt: startedAt.toISOString(),
      refreshMs: SYNC_INTERVAL_MS,
      displayTimeZone: DISPLAY_TIME_ZONE,
      totalMatches: matches.length,
      totalTeams: teamsPayload.sports?.[0]?.leagues?.[0]?.teams?.length ?? Object.values(teams).length,
      odds: {
        status: polymarketCount ? "polymarket_live" : oddsCount ? "espn_draftkings" : "not_available",
        matches: oddsCount,
        polymarketMatches: polymarket.meta.matches ?? polymarketCount,
        espnMatches: espnOddsCount,
        polymarket: polymarket.meta,
      },
      details: matchDetails.meta,
      news: {
        articles: news.length,
      },
      note: "赛程、比分、状态、积分榜、球队、场馆、阵容、技术统计、历史交锋、近期战绩、新闻、实况照片和视频来自 ESPN API；Polymarket series 11433 提供可匹配比赛的即时预测市场价格。",
    },
    teams,
    matches,
    standings,
    players,
    teamStats,
    predictions,
    news,
    dataDocs,
    matchDetails: matchDetails.details,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(
    `[sync] wrote ${outputPath} at ${payload.meta.fetchedAt} ` +
      `(Polymarket ${payload.meta.odds.polymarketMatches}/${payload.meta.odds.polymarket.scannedMatches ?? 0}, ESPN ${payload.meta.odds.espnMatches})`,
  );
  return payload;
}

async function safeSyncOnce() {
  try {
    return await syncOnce();
  } catch (error) {
    const previous = await loadPreviousPayload();
    if (previous) {
      previous.meta = {
        ...previous.meta,
        lastSyncError: error.message,
        lastSyncErrorAt: new Date().toISOString(),
      };
      await writeFile(outputPath, `${JSON.stringify(previous, null, 2)}\n`);
      console.warn(`[sync] failed, kept previous data: ${error.message}`);
      return previous;
    }
    throw error;
  }
}

if (process.argv.includes("--watch")) {
  await safeSyncOnce();
  console.log(`[sync] watching ESPN + Polymarket every ${Math.round(SYNC_INTERVAL_MS / 1000)}s`);
  setInterval(safeSyncOnce, SYNC_INTERVAL_MS);
} else {
  await safeSyncOnce();
}
