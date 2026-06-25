import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarBlank,
  CaretDown,
  Clock,
  CloudSun,
  Database,
  House,
  Info,
  ListBullets,
  MagnifyingGlass,
  MapPin,
  Medal,
  Newspaper,
  PlayCircle,
  Shield,
  SlidersHorizontal,
  SoccerBall,
  Star,
  Table,
  Target,
  Trophy,
  User,
  X,
} from "@phosphor-icons/react";

const teams = {
  germany: { name: "德国", code: "GER", flag: "de", form: "胜 胜 平 胜 负" },
  brazil: { name: "巴西", code: "BRA", flag: "br", form: "胜 平 胜 胜 胜" },
  switzerland: { name: "瑞士", code: "SUI", flag: "ch", form: "负 胜 平 平 胜" },
  hungary: { name: "匈牙利", code: "HUN", flag: "hu", form: "负 负 胜 平 负" },
  spain: { name: "西班牙", code: "ESP", flag: "es", form: "胜 胜 胜 平 胜" },
  croatia: { name: "克罗地亚", code: "CRO", flag: "hr", form: "平 胜 负 胜 平" },
  italy: { name: "意大利", code: "ITA", flag: "it", form: "胜 平 胜 负 胜" },
  albania: { name: "阿尔巴尼亚", code: "ALB", flag: "al", form: "负 胜 负 平 负" },
  argentina: { name: "阿根廷", code: "ARG", flag: "ar", form: "胜 胜 胜 胜 平" },
  france: { name: "法国", code: "FRA", flag: "fr", form: "胜 平 胜 胜 负" },
  england: { name: "英格兰", code: "ENG", flag: "gb", form: "胜 胜 平 胜 胜" },
  serbia: { name: "塞尔维亚", code: "SRB", flag: "rs", form: "负 平 胜 负 平" },
  denmark: { name: "丹麦", code: "DEN", flag: "dk", form: "平 胜 平 负 胜" },
  netherlands: { name: "荷兰", code: "NED", flag: "nl", form: "胜 负 胜 胜 平" },
  poland: { name: "波兰", code: "POL", flag: "pl", form: "负 胜 负 平 胜" },
  portugal: { name: "葡萄牙", code: "POR", flag: "pt", form: "胜 胜 负 胜 胜" },
};

const matches = [
  {
    id: "a01",
    date: "06-14",
    isoDate: "2026-06-14",
    day: "周日",
    time: "03:00",
    stage: "小组赛",
    group: "A组",
    home: "germany",
    away: "switzerland",
    score: "5 - 1",
    status: "已结束",
    venue: "安联球场",
    city: "慕尼黑",
    weather: "多云 21°C，湿度 56%，风速 11km/h",
  },
  {
    id: "a02",
    date: "06-14",
    isoDate: "2026-06-14",
    day: "周日",
    time: "21:00",
    stage: "小组赛",
    group: "A组",
    home: "hungary",
    away: "switzerland",
    score: "1 - 3",
    status: "已结束",
    venue: "科隆球场",
    city: "科隆",
    weather: "晴 24°C，湿度 48%，风速 8km/h",
  },
  {
    id: "a03",
    date: "06-15",
    isoDate: "2026-06-15",
    day: "周一",
    time: "03:00",
    stage: "小组赛",
    group: "A组",
    home: "germany",
    away: "brazil",
    score: "-",
    status: "未开始",
    venue: "西格纳尔球场",
    city: "多特蒙德",
    weather: "多云 21°C，湿度 56%，风速 11km/h",
  },
  {
    id: "b01",
    date: "06-15",
    isoDate: "2026-06-15",
    day: "周一",
    time: "21:00",
    stage: "小组赛",
    group: "B组",
    home: "spain",
    away: "croatia",
    score: "-",
    status: "未开始",
    venue: "柏林奥林匹克体育场",
    city: "柏林",
    weather: "小雨 18°C，湿度 64%，风速 13km/h",
  },
  {
    id: "b02",
    date: "06-16",
    isoDate: "2026-06-16",
    day: "周二",
    time: "00:00",
    stage: "小组赛",
    group: "B组",
    home: "italy",
    away: "albania",
    score: "-",
    status: "未开始",
    venue: "威斯特法伦球场",
    city: "多特蒙德",
    weather: "晴 22°C，湿度 51%，风速 9km/h",
  },
  {
    id: "c01",
    date: "06-16",
    isoDate: "2026-06-16",
    day: "周二",
    time: "03:00",
    stage: "小组赛",
    group: "C组",
    home: "argentina",
    away: "france",
    score: "-",
    status: "未开始",
    venue: "卢赛尔体育场",
    city: "卢赛尔",
    weather: "晴 27°C，湿度 43%，风速 7km/h",
  },
  {
    id: "c02",
    date: "06-16",
    isoDate: "2026-06-16",
    day: "周二",
    time: "21:00",
    stage: "小组赛",
    group: "C组",
    home: "england",
    away: "serbia",
    score: "-",
    status: "未开始",
    venue: "费尔廷斯竞技场",
    city: "盖尔森基兴",
    weather: "阴 19°C，湿度 59%，风速 12km/h",
  },
  {
    id: "c03",
    date: "06-17",
    isoDate: "2026-06-17",
    day: "周三",
    time: "00:00",
    stage: "小组赛",
    group: "C组",
    home: "denmark",
    away: "netherlands",
    score: "-",
    status: "未开始",
    venue: "斯图加特竞技场",
    city: "斯图加特",
    weather: "晴 23°C，湿度 46%，风速 10km/h",
  },
  {
    id: "d01",
    date: "06-17",
    isoDate: "2026-06-17",
    day: "周三",
    time: "03:00",
    stage: "小组赛",
    group: "D组",
    home: "poland",
    away: "portugal",
    score: "-",
    status: "未开始",
    venue: "大众汽车竞技场",
    city: "沃尔夫斯堡",
    weather: "晴 20°C，湿度 50%，风速 14km/h",
  },
  {
    id: "d02",
    date: "06-17",
    isoDate: "2026-06-17",
    day: "周三",
    time: "21:00",
    stage: "小组赛",
    group: "D组",
    home: "portugal",
    away: "netherlands",
    score: "-",
    status: "未开始",
    venue: "汉堡人民公园球场",
    city: "汉堡",
    weather: "阴 19°C，湿度 61%，风速 10km/h",
  },
  {
    id: "k01",
    date: "07-05",
    isoDate: "2026-07-05",
    day: "周日",
    time: "03:00",
    stage: "淘汰赛",
    group: "1/8决赛",
    home: "brazil",
    away: "argentina",
    score: "-",
    status: "未开始",
    venue: "都会人寿体育场",
    city: "纽约",
    weather: "晴 26°C，湿度 44%，风速 9km/h",
  },
  {
    id: "k02",
    date: "07-06",
    isoDate: "2026-07-06",
    day: "周一",
    time: "03:00",
    stage: "淘汰赛",
    group: "1/8决赛",
    home: "france",
    away: "england",
    score: "-",
    status: "未开始",
    venue: "AT&T 体育场",
    city: "达拉斯",
    weather: "多云 28°C，湿度 57%，风速 16km/h",
  },
];

const predictionByMatch = {
  a03: {
    home: 41.2,
    draw: 24.6,
    away: 34.2,
    model: "基于历史数据与模拟预测",
    trend: "+2.1%",
    odds: [
      { book: "Bet365", home: "2.40", draw: "3.40", away: "2.75" },
      { book: "Pinnacle", home: "2.42", draw: "3.38", away: "2.70" },
      { book: "威廉希尔", home: "2.38", draw: "3.30", away: "2.80" },
      { book: "立博", home: "2.45", draw: "3.45", away: "2.65" },
    ],
  },
  c01: {
    home: 36.8,
    draw: 28.1,
    away: 35.1,
    model: "Elo + 近期状态混合模型",
    trend: "-0.4%",
    odds: [
      { book: "Bet365", home: "2.62", draw: "3.25", away: "2.58" },
      { book: "Pinnacle", home: "2.68", draw: "3.20", away: "2.52" },
      { book: "威廉希尔", home: "2.60", draw: "3.30", away: "2.55" },
      { book: "立博", home: "2.70", draw: "3.18", away: "2.50" },
    ],
  },
  default: {
    home: 44.5,
    draw: 25.0,
    away: 30.5,
    model: "基于历史数据与赛前阵容预测",
    trend: "+1.3%",
    odds: [
      { book: "Bet365", home: "2.10", draw: "3.55", away: "3.10" },
      { book: "Pinnacle", home: "2.14", draw: "3.48", away: "3.05" },
      { book: "威廉希尔", home: "2.08", draw: "3.60", away: "3.20" },
      { book: "立博", home: "2.12", draw: "3.50", away: "3.08" },
    ],
  },
};

const standings = {
  "A组": [
    { team: "germany", played: 1, win: 1, draw: 0, loss: 0, gf: 5, ga: 1, gd: "+4", pts: 3 },
    { team: "switzerland", played: 1, win: 1, draw: 0, loss: 0, gf: 3, ga: 1, gd: "+2", pts: 3 },
    { team: "brazil", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "hungary", played: 1, win: 0, draw: 0, loss: 1, gf: 1, ga: 3, gd: "-2", pts: 0 },
  ],
  "B组": [
    { team: "spain", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "croatia", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "italy", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "albania", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
  ],
  "C组": [
    { team: "argentina", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "france", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "england", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "serbia", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
  ],
  "D组": [
    { team: "portugal", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "netherlands", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "denmark", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
    { team: "poland", played: 0, win: 0, draw: 0, loss: 0, gf: 0, ga: 0, gd: "0", pts: 0 },
  ],
};

const players = [
  { name: "哈里·凯恩", country: "england", team: "英格兰", goals: 3, assists: 0, rating: 8.5, shots: 11 },
  { name: "贾马尔·穆西亚拉", country: "germany", team: "德国", goals: 2, assists: 1, rating: 8.3, shots: 8 },
  { name: "布卡约·萨卡", country: "england", team: "英格兰", goals: 2, assists: 0, rating: 8.0, shots: 7 },
  { name: "科迪·加克波", country: "netherlands", team: "荷兰", goals: 2, assists: 0, rating: 7.9, shots: 6 },
  { name: "莱昂内尔·梅西", country: "argentina", team: "阿根廷", goals: 1, assists: 2, rating: 8.4, shots: 5 },
  { name: "基利安·姆巴佩", country: "france", team: "法国", goals: 1, assists: 1, rating: 8.2, shots: 9 },
];

const teamStats = [
  { team: "germany", possession: 61, xg: 2.84, shots: 18, pass: 91, press: 7.8 },
  { team: "brazil", possession: 58, xg: 2.36, shots: 16, pass: 88, press: 8.2 },
  { team: "argentina", possession: 55, xg: 2.08, shots: 13, pass: 87, press: 7.4 },
  { team: "france", possession: 53, xg: 1.96, shots: 14, pass: 85, press: 8.0 },
  { team: "england", possession: 57, xg: 1.88, shots: 12, pass: 89, press: 7.2 },
  { team: "spain", possession: 64, xg: 2.14, shots: 15, pass: 92, press: 8.5 },
];

const navSections = [
  { key: "home", label: "首页", icon: House },
  { key: "schedule", label: "赛程", icon: CalendarBlank },
  { key: "bracket", label: "对阵图", icon: ListBullets },
  { key: "standings", label: "积分榜", icon: Trophy },
  { key: "teams", label: "球队数据", icon: Shield },
  { key: "players", label: "球员榜", icon: User },
];

const moreLinks = [
  { key: "news", label: "新闻", icon: Newspaper },
  { key: "docs", label: "数据说明", icon: Info },
];

const xiaohongshuLiveUrl =
  import.meta.env.VITE_XIAOHONGSHU_LIVE_URL ??
  "https://www.xiaohongshu.com/livelist?channel_id=0&channel_type=web_live_list";
const weekdayZh = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const fallbackMeta = {
  sourceName: "本地兜底样例数据",
  fetchedAt: "",
  refreshMs: 300000,
  totalMatches: 48,
  totalTeams: Object.keys(teams).length,
  odds: { status: "fallback" },
  note: "真实数据加载失败时使用的本地兜底数据。",
};

const DataContext = createContext({
  meta: fallbackMeta,
  teams,
  matches,
  standings,
  players,
  teamStats,
  predictions: predictionByMatch,
  matchDetails: {},
  news: [],
  dataDocs: null,
});

function usePortalData() {
  return useContext(DataContext);
}

function teamOrFallback(teamsMap, teamKey) {
  return teamsMap[teamKey] ?? {
    name: "待定",
    code: "TBD",
    flag: "",
    flagUrl: "",
    form: "待定",
    placeholder: true,
  };
}

function Flag({ teamKey, size = "md" }) {
  const { teams: teamsMap } = usePortalData();
  const team = teamOrFallback(teamsMap, teamKey);
  const src = team.flagUrl || (team.flag ? `https://flagcdn.com/w40/${team.flag}.png` : "");

  if (!src) {
    return <span className={`flag flag-${size} flag-placeholder`}>{team.code?.slice(0, 2) ?? "?"}</span>;
  }

  return (
    <img
      className={`flag flag-${size}`}
      src={src}
      srcSet={team.flagUrl ? undefined : `https://flagcdn.com/w80/${team.flag}.png 2x`}
      alt={`${team.name} 国旗`}
    />
  );
}

function TeamName({ teamKey, compact = false }) {
  const { teams: teamsMap } = usePortalData();
  const team = teamOrFallback(teamsMap, teamKey);
  return (
    <span className="team-name">
      <Flag teamKey={teamKey} size={compact ? "sm" : "md"} />
      <span>{team.name}</span>
    </span>
  );
}

function StatusPill({ status }) {
  const tone = status === "已结束" ? "done" : status === "进行中" ? "live" : "upcoming";
  return <span className={`status-pill ${tone}`}>{status}</span>;
}

function Tag({ children, tone = "neutral" }) {
  return <span className={`tag ${tone}`}>{children}</span>;
}

function SegmentedControl({ options, value, onChange, ariaLabel }) {
  return (
    <div className="segmented" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={option === value ? "active" : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function SelectControl({ icon: Icon, label, value, onChange, options }) {
  return (
    <label className="select-control">
      {Icon ? <Icon size={15} weight="regular" /> : null}
      <span className="select-label">{label}</span>
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <CaretDown size={13} weight="bold" />
    </label>
  );
}

function Sidebar({ activePage, onPageChange }) {
  const { meta } = usePortalData();
  const fetchedLabel = meta.fetchedAt ? new Date(meta.fetchedAt).toLocaleString("zh-CN", { hour12: false }) : "未同步";

  return (
    <aside className="sidebar" aria-label="世界杯数据门户导航">
      <div className="brand">
        <span className="brand-mark">
          <SoccerBall size={20} weight="bold" />
        </span>
        <span>世界杯数据门户</span>
      </div>

      <nav className="nav-group">
        {navSections.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`nav-item ${activePage === key ? "active" : ""}`}
            onClick={() => onPageChange(key)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="nav-label">更多</div>
      <nav className="nav-group">
        {moreLinks.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`nav-item muted ${activePage === key ? "active" : ""}`}
            onClick={() => onPageChange(key)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>数据更新：{fetchedLabel}</p>
        <p>{meta.sourceName}</p>
      </div>
    </aside>
  );
}

function PageHeader({
  activePage,
  query,
  onQueryChange,
  view,
  onViewChange,
  stageFilter,
  setStageFilter,
  groupFilter,
  setGroupFilter,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  oddsFilter,
  setOddsFilter,
  onResetFilters,
}) {
  const titleMap = {
    home: "首页",
    schedule: "赛程",
    bracket: "对阵图",
    standings: "积分榜",
    teams: "球队数据",
    players: "球员榜",
    details: "比赛详情",
    odds: "预测/赔率",
    news: "新闻",
    docs: "数据说明",
  };
  const { matches: dataMatches } = usePortalData();
  const groupOptions = ["全部", ...Array.from(new Set(dataMatches.map((match) => match.group).filter(Boolean)))];
  const stageOptions = ["全部", ...Array.from(new Set(dataMatches.map((match) => match.stage).filter(Boolean)))];
  const dateOptions = ["全部", ...Array.from(new Set(dataMatches.map((match) => match.isoDate).filter(Boolean)))];
  const showScheduleFilters = activePage === "schedule";

  return (
    <header className="page-header">
      <div className="title-line">
        <div>
          <h1>
            <CalendarBlank size={25} weight="regular" />
            {titleMap[activePage] ?? "赛程"}
          </h1>
        </div>
        <label className="search-box">
          <MagnifyingGlass size={16} />
          <span className="sr-only">搜索球队或球员</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索球队或球员"
          />
          <kbd>⌘ K</kbd>
        </label>
      </div>

      {showScheduleFilters ? (
        <div className="schedule-filter-panel">
          <div className="filter-primary-row">
            <SegmentedControl
              ariaLabel="赛程视图"
              options={["全部", "小组赛", "淘汰赛"]}
              value={view}
              onChange={onViewChange}
            />
            <button type="button" className="filter-button" onClick={onResetFilters}>
              重置筛选
            </button>
          </div>
          <div className="filter-grid">
            <SelectControl
              icon={SlidersHorizontal}
              label="阶段"
              value={stageFilter}
              onChange={setStageFilter}
              options={stageOptions}
            />
            <SelectControl
              icon={Table}
              label="组别"
              value={groupFilter}
              onChange={setGroupFilter}
              options={groupOptions}
            />
            <SelectControl
              icon={Clock}
              label="状态"
              value={statusFilter}
              onChange={setStatusFilter}
              options={["全部", "未开始", "进行中", "已结束"]}
            />
            <SelectControl
              icon={CalendarBlank}
              label="日期"
              value={dateFilter}
              onChange={setDateFilter}
              options={dateOptions}
            />
            <SelectControl
              icon={Target}
              label="赔率"
              value={oddsFilter}
              onChange={setOddsFilter}
              options={["全部", "有 Polymarket", "有赔率", "无赔率"]}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function ScheduleTable({ rows, selectedId, onSelect, favorites, onToggleFavorite }) {
  const { meta, predictions } = usePortalData();

  return (
    <section className="database-section schedule-section" aria-label="赛程数据库">
      <div className="section-head standalone schedule-head">
        <div>
          <h2>全部赛程</h2>
          <p>展示当前筛选条件下的全部比赛，不再截断前 10 行。</p>
        </div>
        <Tag tone="neutral">显示 {rows.length}</Tag>
      </div>
      <div className="table-scroll">
        <table className="data-table schedule-table">
          <thead>
            <tr>
              <th className="star-col"></th>
              <th>日期</th>
              <th>时间</th>
              <th>阶段</th>
              <th>组别</th>
              <th>对阵</th>
              <th>比分</th>
              <th>状态</th>
              <th>赔率</th>
              <th>场馆</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((match) => {
              const favorite = favorites.has(match.id);
              const oddsRows = predictions[match.id]?.odds ?? [];
              const hasPolymarket = oddsRows.some((row) => row.source === "polymarket");
              const oddsLabel = hasPolymarket ? "Polymarket" : oddsRows.length ? "ESPN" : "无";
              return (
                <tr
                  key={match.id}
                  className={selectedId === match.id ? "selected" : ""}
                  onClick={() => onSelect(match.id)}
                >
                  <td className="star-col">
                    <button
                      type="button"
                      className={`icon-button favorite-button ${favorite ? "active" : ""}`}
                      aria-label={favorite ? "取消收藏比赛" : "收藏比赛"}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleFavorite(match.id);
                      }}
                    >
                      <Star size={16} weight={favorite ? "fill" : "regular"} />
                    </button>
                  </td>
                  <td>{match.date} {match.day}</td>
                  <td>{match.time}</td>
                  <td><Tag tone="green">{match.stage}</Tag></td>
                  <td><Tag tone={match.group.includes("A") ? "purple" : match.group.includes("B") ? "blue" : "orange"}>{match.group}</Tag></td>
                  <td>
                    <div className="matchup">
                      <TeamName teamKey={match.home} compact />
                      <span className="versus">vs</span>
                      <TeamName teamKey={match.away} compact />
                    </div>
                  </td>
                  <td className="score-cell">{match.score}</td>
                  <td><StatusPill status={match.status} /></td>
                  <td><Tag tone={hasPolymarket ? "blue" : oddsRows.length ? "neutral" : "orange"}>{oddsLabel}</Tag></td>
                  <td className="venue-cell">{match.venue}</td>
                </tr>
              );
            })}
            {!rows.length ? (
              <tr>
                <td colSpan="10" className="empty-row">没有符合当前筛选条件的比赛</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span>共 {rows.length} / {meta.totalMatches ?? rows.length} 场比赛</span>
        <span>{favorites.size} 场已收藏</span>
      </div>
    </section>
  );
}

function KnockoutBracket({ selectedId, onSelect }) {
  const { matches: dataMatches } = usePortalData();
  const mainStages = ["32强", "16强", "四分之一决赛", "半决赛", "决赛"];
  const knockoutMatches = dataMatches
    .filter((match) => match.stage !== "小组赛")
    .sort((a, b) => a.sortTime - b.sortTime || Number(a.id) - Number(b.id));
  const thirdPlaceMatch = knockoutMatches.find((match) => match.stage === "三四名决赛");
  const stageGroups = mainStages.map((stage, stageIndex) => {
    const span = 2 ** (stageIndex + 1);
    return {
      stage,
      stageIndex,
      span,
      rows: knockoutMatches.filter((match) => match.stage === stage),
    };
  });

  function renderBracketNode(match, className = "", style = {}) {
    return (
      <button
        type="button"
        className={`bracket-match ${className} ${selectedId === match.id ? "selected" : ""}`}
        key={match.id}
        style={style}
        onClick={() => onSelect(match.id)}
      >
        <span className="bracket-match-meta">
          <span>{match.date} {match.time}</span>
          <StatusPill status={match.status} />
        </span>
        <span className="bracket-team-row">
          <TeamName teamKey={match.home} compact />
          <strong>{match.homeScore ?? ""}</strong>
        </span>
        <span className="bracket-team-row">
          <TeamName teamKey={match.away} compact />
          <strong>{match.awayScore ?? ""}</strong>
        </span>
        <span className="bracket-match-foot">{match.venue}</span>
      </button>
    );
  }

  return (
    <section className="database-section bracket-section" aria-label="淘汰赛对阵图">
      <div className="section-head standalone">
        <div>
          <h2>淘汰赛对阵图</h2>
          <p>结构图展示 32 强到决赛的晋级路径，节点间连线表达胜者流向。</p>
        </div>
        <Tag tone="blue">{knockoutMatches.length} 场</Tag>
      </div>
      <div className="bracket-scroll" role="list">
        <div className="bracket-diagram">
          <div className="bracket-diagram-head">
            {stageGroups.map(({ stage, rows }) => (
              <div className="bracket-column-head" key={stage}>
                <strong>{stage}</strong>
                <span>{rows.length} 场</span>
              </div>
            ))}
          </div>
          <div className="bracket-main-grid">
            {stageGroups.flatMap(({ stage, stageIndex, span, rows }) =>
              rows.map((match, index) =>
                renderBracketNode(
                  match,
                  `diagram-node round-${stageIndex} ${stage === "决赛" ? "final-node" : ""} ${index % 2 === 0 ? "pair-top" : "pair-bottom"}`,
                  {
                    gridColumn: stageIndex + 1,
                    gridRow: `${1 + index * span} / span ${span}`,
                    "--round-span": span,
                  },
                ),
              ),
            )}
          </div>
          {thirdPlaceMatch ? (
            <div className="third-place-lane">
              <div className="bracket-column-head">
                <strong>三四名决赛</strong>
                <span>1 场</span>
              </div>
              {renderBracketNode(thirdPlaceMatch, "third-place-node")}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function StandingsPanel({ standingsGroup, setStandingsGroup, expanded = false, onOpenFull }) {
  const { standings: standingsMap, teams: teamsMap } = usePortalData();
  const [standingsQuery, setStandingsQuery] = useState("");
  const groupOptions = Object.keys(standingsMap);
  const selectionOptions = expanded ? ["全部", ...groupOptions] : groupOptions;
  const activeGroup = expanded
    ? standingsGroup === "全部" || standingsMap[standingsGroup]
      ? standingsGroup
      : "全部"
    : standingsMap[standingsGroup]
      ? standingsGroup
      : groupOptions[0];
  const lowerQuery = standingsQuery.trim().toLowerCase();
  const groupsToRender = (activeGroup === "全部" ? groupOptions : [activeGroup])
    .map((group) => {
      const rows = (standingsMap[group] ?? []).filter((row) => {
        const team = teamOrFallback(teamsMap, row.team);
        return (
          !lowerQuery ||
          team.name.includes(standingsQuery) ||
          team.code.toLowerCase().includes(lowerQuery) ||
          row.teamName?.toLowerCase().includes(lowerQuery)
        );
      });
      return { group, rows };
    })
    .filter(({ rows }) => rows.length || lowerQuery);
  const totalRows = groupsToRender.reduce((sum, group) => sum + group.rows.length, 0);

  return (
    <section className={`panel-section ${expanded ? "expanded-panel" : ""}`} aria-label="积分榜">
      <div className="section-head">
        <div>
          <h2>{expanded ? "完整积分榜" : "积分榜"}</h2>
          {expanded ? <p>按小组与球队名称筛选，所有小组完整展示。</p> : null}
        </div>
        <Tag tone="neutral">{totalRows} 队</Tag>
      </div>
      <div className={`standings-toolbar ${expanded ? "expanded" : ""}`}>
        <SelectControl
          label="小组"
          value={activeGroup}
          onChange={setStandingsGroup}
          options={selectionOptions}
        />
        {expanded ? (
          <label className="mini-search">
            <MagnifyingGlass size={15} />
            <span className="sr-only">搜索积分榜球队</span>
            <input
              value={standingsQuery}
              onChange={(event) => setStandingsQuery(event.target.value)}
              placeholder="搜索球队或代码"
            />
          </label>
        ) : null}
      </div>
      <div className="standings-groups">
        {groupsToRender.map(({ group, rows }) => (
          <div className="standings-group-block" key={group}>
            {expanded || activeGroup === "全部" ? (
              <div className="standings-group-title">
                <strong>{group}</strong>
                <span>{rows.length} 队</span>
              </div>
            ) : null}
            <div className="table-scroll">
              <table className="data-table compact-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>球队</th>
                    <th>场次</th>
                    <th>胜</th>
                    <th>平</th>
                    <th>负</th>
                    <th>进球</th>
                    <th>失球</th>
                    <th>净胜球</th>
                    <th>积分</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={`${group}-${row.team}`}>
                      <td className="rank-cell">{index + 1}</td>
                      <td><TeamName teamKey={row.team} compact /></td>
                      <td>{row.played}</td>
                      <td>{row.win}</td>
                      <td>{row.draw}</td>
                      <td>{row.loss}</td>
                      <td>{row.gf}</td>
                      <td>{row.ga}</td>
                      <td>{row.gd}</td>
                      <td className="bold-cell">{row.pts}</td>
                    </tr>
                  ))}
                  {!rows.length ? (
                    <tr>
                      <td colSpan="10" className="empty-row">没有符合当前筛选条件的球队</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      {!expanded && onOpenFull ? (
        <button type="button" className="text-link" onClick={onOpenFull}>
          查看完整积分榜
          <ArrowRight size={14} />
        </button>
      ) : null}
    </section>
  );
}

function PlayerBoard({ metric, onMetricChange, expanded = false, query = "" }) {
  const { players: playerRows } = usePortalData();
  const metricMap = {
    射手榜: "goals",
    助攻榜: "assists",
    评分榜: "rating",
  };
  const key = metricMap[metric];
  const rows = playerRows
    .filter((player) => player.name.includes(query) || player.team.includes(query) || !query)
    .sort((a, b) => b[key] - a[key]);

  return (
    <section className={`panel-section ${expanded ? "expanded-panel" : ""}`} aria-label="球员榜">
      <div className="section-head">
        <div>
          <h2>球员榜</h2>
        </div>
        <SegmentedControl
          ariaLabel="球员榜类型"
          options={["射手榜", "助攻榜", "评分榜"]}
          value={metric}
          onChange={onMetricChange}
        />
      </div>
      <table className="data-table compact-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>球员</th>
            <th>球队</th>
            <th>进球</th>
            <th>助攻</th>
            {expanded ? <th>评分</th> : null}
            {expanded ? <th>射门</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((player, index) => (
            <tr key={player.name}>
              <td className="rank-cell">{index + 1}</td>
              <td>{player.name}</td>
              <td><TeamName teamKey={player.country} compact /></td>
              <td className="bold-cell">{player.goals}</td>
              <td>{player.assists}</td>
              {expanded ? <td>{player.rating}</td> : null}
              {expanded ? <td>{player.shots}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="text-link">
        查看完整球员榜
        <ArrowRight size={14} />
      </button>
    </section>
  );
}

function TeamDataPanel({ query = "" }) {
  const { teams: teamsMap, teamStats: liveTeamStats } = usePortalData();
  const rows = liveTeamStats.filter((item) => {
    const team = teamOrFallback(teamsMap, item.team);
    return team.name.includes(query) || team.code.toLowerCase().includes(query.toLowerCase()) || !query;
  });

  return (
    <section className="database-section expanded-panel" aria-label="球队数据">
      <div className="section-head standalone">
        <div>
          <h2>球队数据</h2>
          <p>基于实时积分表与比赛结果汇总的球队表现</p>
        </div>
        <Tag tone="blue">关键指标</Tag>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>球队</th>
            <th>小组</th>
            <th>场次</th>
            <th>进球</th>
            <th>失球</th>
            <th>净胜球</th>
            <th>积分</th>
            <th>近期状态</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.team}>
              <td><TeamName teamKey={row.team} /></td>
              <td>{row.group}</td>
              <td>{row.played}</td>
              <td>{row.goalsFor}</td>
              <td>{row.goalsAgainst}</td>
              <td>{row.goalDifference}</td>
              <td className="bold-cell">{row.points}</td>
              <td className="muted-text">{row.form}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function OddsSourceCell({ row }) {
  if (row.eventUrl) {
    return (
      <a className="source-link" href={row.eventUrl} target="_blank" rel="noreferrer">
        {row.book}
      </a>
    );
  }
  return row.book;
}

function DetailEmpty({ title, body }) {
  return (
    <div className="detail-empty">
      <Database size={18} />
      <strong>{title}</strong>
      <span>{body}</span>
    </div>
  );
}

function PlayerList({ title, players }) {
  return (
    <div className="player-list-block">
      <div className="player-list-title">
        <strong>{title}</strong>
        <span>{players.length} 人</span>
      </div>
      {players.length ? (
        <div className="player-list">
          {players.map((player) => (
            <div className="player-row" key={`${player.id}-${player.jersey}-${player.name}`}>
              <span className="shirt-number">{player.jersey || "-"}</span>
              <div>
                <strong>{player.shortName || player.name}</strong>
                <small>{player.position || "位置待定"}</small>
              </div>
              {player.goals !== "0" ? <Tag tone="green">{player.goals} 球</Tag> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="subtle-note">官方暂未公布</p>
      )}
    </div>
  );
}

function TeamLineup({ lineup }) {
  const statusText = lineup.status === "official" ? `阵型 ${lineup.formation}` : lineup.status === "squad" ? "大名单已公布" : "首发待公布";
  return (
    <div className="lineup-team">
      <div className="lineup-team-head">
        <TeamName teamKey={lineup.team} compact />
        <Tag tone={lineup.status === "official" ? "blue" : "neutral"}>{statusText}</Tag>
      </div>
      <PlayerList title="首发" players={lineup.starters ?? []} />
      <PlayerList title="替补" players={(lineup.substitutes ?? []).slice(0, 9)} />
    </div>
  );
}

function LineupsDetail({ detail }) {
  if (!detail?.lineups) {
    return <DetailEmpty title="暂无阵容数据" body="ESPN summary 暂未返回该场阵容或大名单。" />;
  }
  return (
    <section className="detail-section">
      <h3>阵容</h3>
      <div className="lineups-grid">
        <TeamLineup lineup={detail.lineups.home} />
        <TeamLineup lineup={detail.lineups.away} />
      </div>
    </section>
  );
}

function StatsDetail({ detail, homeName, awayName }) {
  const rows = detail?.stats ?? [];
  const leaders = detail?.leaders ?? [];
  if (!rows.length && !leaders.length) {
    return <DetailEmpty title="暂无技术统计" body="该场比赛的 boxscore 统计还未由 ESPN 发布。" />;
  }
  return (
    <section className="detail-section">
      <h3>技术统计</h3>
      {rows.length ? (
        <div className="stats-compare-list">
          <div className="stats-compare-head">
            <span>{homeName}</span>
            <span>指标</span>
            <span>{awayName}</span>
          </div>
          {rows.slice(0, 14).map((row) => (
            <div className="stats-row" key={row.key}>
              <strong>{row.home}</strong>
              <span>{row.label}</span>
              <strong>{row.away}</strong>
            </div>
          ))}
        </div>
      ) : null}
      {leaders.length ? (
        <div className="leaders-grid">
          {leaders.map((team) => (
            <div className="leader-card" key={team.teamId || team.teamName}>
              <strong>{team.teamName}</strong>
              {(team.leaders ?? []).slice(0, 4).map((leader) => (
                <div className="leader-row" key={leader.key}>
                  <span>{leader.label}</span>
                  <b>{leader.player}</b>
                  <small>{leader.value} {leader.summary}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function FormEventList({ events }) {
  return (
    <div className="history-list">
      {events.map((event) => (
        <div className="history-row" key={event.id}>
          <div>
            <strong>{event.opponent}</strong>
            <span>{event.competition}</span>
          </div>
          <b>{event.score || "-"}</b>
          <Tag tone={event.result === "胜" ? "green" : event.result === "负" ? "orange" : "neutral"}>{event.result || "赛果"}</Tag>
        </div>
      ))}
    </div>
  );
}

function HistoryDetail({ detail }) {
  const headToHead = detail?.headToHead ?? [];
  const recentForm = detail?.recentForm ?? [];
  if (!headToHead.length && !recentForm.length) {
    return <DetailEmpty title="暂无历史数据" body="ESPN summary 暂未返回两队历史交锋或近期战绩。" />;
  }
  return (
    <section className="detail-section">
      <h3>历史交锋</h3>
      {headToHead.length ? (
        <div className="history-block">
          <div className="history-title">
            <strong>两队交锋</strong>
            <span>{headToHead.length} 场</span>
          </div>
          <FormEventList events={headToHead} />
        </div>
      ) : (
        <DetailEmpty title="暂无直接交锋" body="接口未返回两队过往直接交锋，下面展示双方近 5 场。" />
      )}
      <div className="recent-form-grid">
        {recentForm.map((team) => (
          <div className="history-block" key={team.teamId || team.teamName}>
            <div className="history-title">
              <strong>{team.teamName} 近况</strong>
              <span>{team.events.length} 场</span>
            </div>
            <FormEventList events={team.events} />
          </div>
        ))}
      </div>
    </section>
  );
}

function OddsMatrix({ selectedMatch }) {
  const { teams: teamsMap, predictions } = usePortalData();
  const prediction = predictions[selectedMatch.id] ?? predictionByMatch.default;
  const home = teamOrFallback(teamsMap, selectedMatch.home).name;
  const away = teamOrFallback(teamsMap, selectedMatch.away).name;

  return (
    <section className="database-section expanded-panel" aria-label="预测/赔率">
      <div className="section-head standalone">
        <div>
          <h2>预测/赔率</h2>
          <p>{home} vs {away} 的胜率预测、Polymarket 即时价格与 ESPN 备用赔率</p>
        </div>
        <Tag tone="orange">模型预测</Tag>
      </div>
      <div className="prediction-wide">
        <div className="probability-card">
          <div className="prediction-grid">
            <div>
              <span>{home}</span>
              <strong>{prediction.home}%</strong>
            </div>
            <div>
              <span>平局</span>
              <strong>{prediction.draw}%</strong>
            </div>
            <div>
              <span>{away}</span>
              <strong>{prediction.away}%</strong>
            </div>
          </div>
          <div className="prob-bars">
            <span style={{ width: `${prediction.home}%` }} className="home-bar" />
            <span style={{ width: `${prediction.draw}%` }} className="draw-bar" />
            <span style={{ width: `${prediction.away}%` }} className="away-bar" />
          </div>
          <p>{prediction.model}，主胜走势 {prediction.trend}</p>
        </div>
        {prediction.odds.length ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>公司</th>
                <th>{home}胜</th>
                <th>平局</th>
                <th>{away}胜</th>
                <th>盘口</th>
              </tr>
            </thead>
            <tbody>
              {prediction.odds.map((row) => (
                <tr key={row.book}>
                  <td><OddsSourceCell row={row} /></td>
                  <td>{row.home}</td>
                  <td>{row.draw}</td>
                  <td>{row.away}</td>
                  <td className="muted-text">{row.spread || "h2h"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-odds">
            <Target size={22} />
            <strong>暂未接入实时赔率</strong>
            <span>Polymarket 未匹配到该场全场赛果市场，ESPN 也未返回可用 moneyline。</span>
          </div>
        )}
      </div>
    </section>
  );
}

function DetailPanel({ match, detailTab, setDetailTab, onClose }) {
  const { teams: teamsMap, predictions, matchDetails } = usePortalData();
  const home = teamOrFallback(teamsMap, match.home);
  const away = teamOrFallback(teamsMap, match.away);
  const prediction = predictions[match.id] ?? predictionByMatch.default;
  const detail = matchDetails[match.id];

  return (
    <aside className="detail-panel" aria-label="比赛详情">
      <div className="detail-top">
        <div>
          <h2>比赛详情</h2>
          <p>{match.stage} {match.group} 第1轮</p>
        </div>
        <button type="button" className="icon-button" aria-label="关闭比赛详情" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="match-hero">
        <div className="team-stack">
          <Flag teamKey={match.home} size="lg" />
          <strong>{home.name}</strong>
        </div>
        <div className="vs-block">
          <span>VS</span>
          <small>{match.isoDate} {match.time}</small>
        </div>
        <div className="team-stack">
          <Flag teamKey={match.away} size="lg" />
          <strong>{away.name}</strong>
        </div>
      </div>

      <div className="meta-list">
        <div>
          <MapPin size={15} />
          <span>{match.venue}，{match.city}</span>
        </div>
        <div>
          <CloudSun size={15} />
          <span>{match.weather}</span>
        </div>
      </div>

      <SegmentedControl
        ariaLabel="比赛详情标签"
        options={["概况", "阵容", "统计", "历史交锋"]}
        value={detailTab}
        onChange={setDetailTab}
      />

      {detailTab === "概况" ? (
        <>
          <section className="detail-section">
            <h3>
              胜率预测
              <Info size={14} />
            </h3>
            <div className="probability-card">
              <div className="prediction-grid">
                <div>
                  <span>{home.name}</span>
                  <strong>{prediction.home}%</strong>
                </div>
                <div>
                  <span>平局</span>
                  <strong>{prediction.draw}%</strong>
                </div>
                <div>
                  <span>{away.name}</span>
                  <strong>{prediction.away}%</strong>
                </div>
              </div>
              <div className="prob-bars">
                <span style={{ width: `${prediction.home}%` }} className="home-bar" />
                <span style={{ width: `${prediction.draw}%` }} className="draw-bar" />
                <span style={{ width: `${prediction.away}%` }} className="away-bar" />
              </div>
              <p>{prediction.model}</p>
            </div>
          </section>

          <section className="detail-section">
            <h3>
              即时赔率
              <Info size={14} />
            </h3>
            {prediction.odds.length ? (
              <>
                <table className="data-table odds-table">
                  <thead>
                    <tr>
                      <th>公司</th>
                      <th>{home.name}胜</th>
                      <th>平局</th>
                      <th>{away.name}胜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prediction.odds.map((row) => (
                      <tr key={row.book}>
                        <td><OddsSourceCell row={row} /></td>
                        <td>{row.home}</td>
                        <td>{row.draw}</td>
                        <td>{row.away}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="text-link">
                  查看更多赔率
                  <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <div className="empty-odds compact">
                <strong>暂无实时赔率</strong>
                <span>Polymarket 与 ESPN 当前都没有可用赛果赔率。</span>
              </div>
            )}
          </section>

          <section className="detail-section match-info">
            <h3>比赛信息</h3>
            <dl>
              <div><dt>比赛编号</dt><dd>{match.id.toUpperCase()}</dd></div>
              <div><dt>赛事</dt><dd>2026 国际足联世界杯</dd></div>
              <div><dt>阶段</dt><dd>{match.stage}</dd></div>
              <div><dt>组别</dt><dd>{match.group}</dd></div>
              <div><dt>开球时间</dt><dd>{match.isoDate} {match.day} {match.time}</dd></div>
              <div><dt>场馆</dt><dd>{match.venue}</dd></div>
            </dl>
          </section>
        </>
      ) : null}
      {detailTab === "阵容" ? <LineupsDetail detail={detail} /> : null}
      {detailTab === "统计" ? <StatsDetail detail={detail} homeName={home.name} awayName={away.name} /> : null}
      {detailTab === "历史交锋" ? <HistoryDetail detail={detail} /> : null}
    </aside>
  );
}

function fallbackTeamStats() {
  return teamStats.map((row) => {
    const standingRow = Object.entries(standings)
      .flatMap(([group, rows]) => rows.map((item) => ({ group, ...item })))
      .find((item) => item.team === row.team);
    return {
      team: row.team,
      group: standingRow?.group ?? teams[row.team]?.group ?? "",
      played: standingRow?.played ?? 0,
      goalsFor: standingRow?.gf ?? 0,
      goalsAgainst: standingRow?.ga ?? 0,
      goalDifference: standingRow?.gd ?? "0",
      points: standingRow?.pts ?? 0,
      form: teams[row.team]?.form ?? "待更新",
    };
  });
}

function formatMetaTime(value) {
  if (!value) {
    return "等待同步";
  }
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

function currentIsoDate(timeZone = "Asia/Shanghai") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function displayIsoDateLabel(isoDate, todayIso) {
  if (!isoDate) {
    return "待定比赛日";
  }
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekday = weekdayZh[date.getUTCDay()];
  const compactDate = `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
  return isoDate === todayIso ? `今日 ${compactDate} ${weekday}` : `${compactDate} ${weekday}`;
}

function strongestPrediction(prediction, homeName, awayName) {
  const rows = [
    { label: homeName, value: prediction?.home ?? 0 },
    { label: "平局", value: prediction?.draw ?? 0 },
    { label: awayName, value: prediction?.away ?? 0 },
  ];
  return rows.sort((a, b) => b.value - a.value)[0];
}

function MatchVisual({ match, media, compact = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = media?.imageUrl && !imageFailed;

  return (
    <div className={`match-visual ${compact ? "compact" : ""} ${hasImage ? "" : "fallback"}`}>
      {hasImage ? (
        <img src={media.imageUrl} alt={media.alt || "世界杯比赛实况图"} onError={() => setImageFailed(true)} />
      ) : (
        <div className="match-visual-flags" aria-label="比赛队徽视觉">
          <Flag teamKey={match.home} size={compact ? "md" : "lg"} />
          <span>vs</span>
          <Flag teamKey={match.away} size={compact ? "md" : "lg"} />
        </div>
      )}
      {!compact && media?.caption ? <span className="match-visual-caption">{media.caption}</span> : null}
    </div>
  );
}

function MatchMediaStage({ match, detail }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [activeMode, setActiveMode] = useState("照片");
  const media = detail?.media;
  const videos = detail?.videos ?? [];
  const firstVideo = videos[0];
  const showVideo = activeMode === "视频" && firstVideo;
  const hasImage = media?.imageUrl && !imageFailed;

  useEffect(() => {
    setActiveMode("照片");
    setImageFailed(false);
  }, [match.id]);

  return (
    <div className={`match-media-stage ${showVideo ? "video-mode" : ""}`}>
      <div className="media-mode-tabs" aria-label="实况素材类型">
        {["照片", "视频"].map((mode) => (
          <button
            key={mode}
            type="button"
            className={activeMode === mode ? "active" : ""}
            onClick={() => setActiveMode(mode)}
          >
            {mode}
            <span>{mode === "照片" ? (hasImage ? 1 : 0) : videos.length}</span>
          </button>
        ))}
      </div>

      {showVideo ? (
        <div className="match-video-frame">
          {firstVideo.videoUrl ? (
            <video controls poster={firstVideo.thumbnail || media?.imageUrl || ""} src={firstVideo.videoUrl} />
          ) : firstVideo.thumbnail ? (
            <img src={firstVideo.thumbnail} alt={firstVideo.headline} />
          ) : (
            <div className="match-visual fallback">
              <div className="match-visual-flags">
                <Flag teamKey={match.home} size="lg" />
                <span>vs</span>
                <Flag teamKey={match.away} size="lg" />
              </div>
            </div>
          )}
          <a className="video-overlay-link" href={firstVideo.link || firstVideo.videoUrl || xiaohongshuLiveUrl} target="_blank" rel="noreferrer">
            <PlayCircle size={18} weight="fill" />
            {firstVideo.headline || "打开视频"}
          </a>
        </div>
      ) : (
        <MatchVisual match={match} media={media} />
      )}

      {videos.length ? (
        <div className="video-strip" aria-label="比赛视频列表">
          {videos.slice(0, 3).map((video) => (
            <a key={video.id || video.headline} href={video.link || video.videoUrl || xiaohongshuLiveUrl} target="_blank" rel="noreferrer">
              {video.thumbnail ? <img src={video.thumbnail} alt={video.headline} /> : <PlayCircle size={20} weight="fill" />}
              <span>{video.headline}</span>
            </a>
          ))}
        </div>
      ) : (
        <div className="media-empty-note">该场暂未返回可靠视频，照片缺失时使用双方队徽备用。</div>
      )}
    </div>
  );
}

function TodayMatchRow({ match, media, prediction, onSelect, selected }) {
  const { teams: teamsMap } = usePortalData();
  const home = teamOrFallback(teamsMap, match.home);
  const away = teamOrFallback(teamsMap, match.away);
  const market = strongestPrediction(prediction, home.name, away.name);

  return (
    <button type="button" className={`today-match-row ${selected ? "selected" : ""}`} onClick={() => onSelect(match.id)}>
      <MatchVisual match={match} media={media} compact />
      <span className="today-match-main">
        <span className="today-match-meta">
          <b>{match.time}</b>
          <StatusPill status={match.status} />
        </span>
        <span className="today-match-teams">
          <TeamName teamKey={match.home} compact />
          <span className="versus">vs</span>
          <TeamName teamKey={match.away} compact />
        </span>
        <span className="today-match-sub">
          {match.score !== "-" ? match.score : `${match.stage} · ${match.group}`} · {match.venue}
        </span>
      </span>
      <span className="today-match-odds">
        <span>{market.label}</span>
        <strong>{market.value}%</strong>
      </span>
    </button>
  );
}

function DataStatus({ status }) {
  const { meta } = usePortalData();
  const refreshMinutes = Math.round((meta.refreshMs ?? 300000) / 60000);
  const oddsText = meta.odds?.polymarketMatches
    ? `Polymarket ${meta.odds.polymarketMatches} 场`
    : meta.odds?.status === "espn_draftkings"
      ? `ESPN 备用 ${meta.odds.matches ?? 0} 场`
      : "赔率暂不可用";

  return (
    <div className="data-status" role="status">
      <Database size={14} />
      <span>{status === "error" ? "读取失败，使用兜底数据" : "真实数据已接入"}</span>
      <span>更新：{formatMetaTime(meta.fetchedAt)}</span>
      <span>前端每 {refreshMinutes} 分钟刷新</span>
      <span>{oddsText}</span>
    </div>
  );
}

function HomeSummary({ onPageChange, onFocusMatch, onOpenMatchDetail, focusedMatchId }) {
  const { meta, matches: dataMatches, teams: teamsMap, predictions, matchDetails } = usePortalData();
  const todayIso = currentIsoDate(meta.displayTimeZone ?? "Asia/Shanghai");
  const matchesByTime = [...dataMatches].sort((a, b) => a.sortTime - b.sortTime || Number(a.id) - Number(b.id));
  const todayMatches = matchesByTime.filter((match) => match.isoDate === todayIso);
  const fallbackDate =
    matchesByTime.find((match) => match.isoDate >= todayIso && match.status !== "已结束")?.isoDate ??
    matchesByTime.find((match) => match.isoDate >= todayIso)?.isoDate ??
    matchesByTime[0]?.isoDate;
  const displayDate = todayMatches.length ? todayIso : fallbackDate;
  const displayMatches = matchesByTime.filter((match) => match.isoDate === displayDate);
  const liveMatches = displayMatches.filter((match) => match.status === "进行中");
  const finishedMatches = displayMatches.filter((match) => match.status === "已结束");
  const upcomingMatches = displayMatches.filter((match) => match.status === "未开始");
  const matchHasMedia = (match) => Boolean(matchDetails[match.id]?.media?.imageUrl);
  const selectedTodayMatch = displayMatches.find((match) => match.id === focusedMatchId);
  const featuredMatch =
    selectedTodayMatch ??
    liveMatches.find(matchHasMedia) ??
    displayMatches.find(matchHasMedia) ??
    liveMatches[0] ??
    displayMatches.find((match) => match.status !== "已结束") ??
    displayMatches[0] ??
    matchesByTime[0];
  const featuredHome = featuredMatch ? teamOrFallback(teamsMap, featuredMatch.home) : null;
  const featuredAway = featuredMatch ? teamOrFallback(teamsMap, featuredMatch.away) : null;
  const featuredPrediction = featuredMatch ? predictions[featuredMatch.id] ?? predictionByMatch.default : null;
  const featuredMarket = featuredMatch && featuredHome && featuredAway
    ? strongestPrediction(featuredPrediction, featuredHome.name, featuredAway.name)
    : null;
  const featuredMedia = featuredMatch ? matchDetails[featuredMatch.id]?.media : null;
  const featuredDetail = featuredMatch ? matchDetails[featuredMatch.id] : null;
  const xhsButtonText = liveMatches.length ? "去小红书看直播" : finishedMatches.length ? "去小红书看回放" : "预约小红书直播";

  return (
    <section className="database-section expanded-panel">
      <div className="home-summary">
        <div>
          <div className="breadcrumb">世界杯数据门户</div>
          <h2>今日世界杯看板</h2>
          <p>
            聚合 {displayIsoDateLabel(displayDate, todayIso)} 的比赛、实况图、比分状态、市场倾向和直播入口。赛程、比分、阵容、统计与媒体图来自定时同步数据，Polymarket 提供可匹配比赛的即时价格。
          </p>
        </div>
        <div className="summary-actions">
          <a className="primary-button" href={xiaohongshuLiveUrl} target="_blank" rel="noreferrer">
            <PlayCircle size={15} weight="fill" />
            {xhsButtonText}
          </a>
          <button type="button" className="primary-button" onClick={() => onPageChange("schedule")}>
            打开赛程
          </button>
          <button type="button" className="ghost-button" onClick={() => onPageChange("odds")}>
            查看预测/赔率
          </button>
        </div>
      </div>
      <div className="summary-grid">
        {[
          [String(displayMatches.length), todayMatches.length ? "今日比赛" : "下一比赛日", CalendarBlank],
          [String(liveMatches.length), "进行中", PlayCircle],
          [String(finishedMatches.length), "已结束", Table],
          [meta.odds?.polymarketMatches ? String(meta.odds.polymarketMatches) : String(meta.odds?.matches ?? "待更新"), "赔率场次", Target],
        ].map(([value, label, Icon]) => (
          <div className="summary-tile" key={label}>
            <Icon size={18} />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      {featuredMatch && featuredHome && featuredAway ? (
        <div className="home-live-board">
          <article className="today-feature" aria-label="今日焦点比赛">
            <MatchMediaStage match={featuredMatch} detail={featuredDetail} />
            <div className="today-feature-body">
              <div className="today-feature-kicker">
                <Tag tone={featuredMatch.status === "进行中" ? "green" : "blue"}>{featuredMatch.status === "进行中" ? "正在进行" : "今日焦点"}</Tag>
                <span>{featuredMatch.stage} · {featuredMatch.group}</span>
              </div>
              <h3>
                {featuredHome.name}
                <span>vs</span>
                {featuredAway.name}
              </h3>
              <div className="today-score-line">
                <strong>{featuredMatch.score}</strong>
                <span>{featuredMatch.time} · {featuredMatch.venue}</span>
              </div>
              <div className="today-signal-grid">
                <div>
                  <span>市场倾向</span>
                  <strong>{featuredMarket?.label ?? "待更新"} {featuredMarket?.value ?? "-"}%</strong>
                </div>
                <div>
                  <span>实况素材</span>
                  <strong>
                    {featuredMedia?.source ?? "队徽备用"}
                    {(featuredDetail?.videos ?? []).length ? ` / 视频 ${(featuredDetail?.videos ?? []).length}` : ""}
                  </strong>
                </div>
                <div>
                  <span>直播入口</span>
                  <strong>小红书世界杯</strong>
                </div>
              </div>
              <div className="today-feature-actions">
                <a className="primary-button" href={xiaohongshuLiveUrl} target="_blank" rel="noreferrer">
                  <PlayCircle size={15} weight="fill" />
                  {xhsButtonText}
                </a>
                <button type="button" className="ghost-button" onClick={() => onOpenMatchDetail(featuredMatch.id)}>
                  打开比赛详情
                </button>
              </div>
            </div>
          </article>

          <section className="today-panel" aria-label="当日比赛列表">
            <div className="section-head standalone">
              <div>
                <h2>{todayMatches.length ? "当日赛程" : "下一比赛日赛程"}</h2>
                <p>{displayIsoDateLabel(displayDate, todayIso)} · {liveMatches.length} 场进行中 · {upcomingMatches.length} 场未开始</p>
              </div>
              <Tag tone="neutral">{displayMatches.length} 场</Tag>
            </div>
            <div className="today-match-list">
              {displayMatches.map((match) => (
                <TodayMatchRow
                  key={match.id}
                  match={match}
                  media={matchDetails[match.id]?.media}
                  prediction={predictions[match.id] ?? predictionByMatch.default}
                  onSelect={onFocusMatch}
                  selected={match.id === featuredMatch.id}
                />
              ))}
            </div>
          </section>
        </div>
      ) : null}
      <div className="home-info-grid">
        <section className="home-info-block">
          <div className="info-icon"><PlayCircle size={18} weight="fill" /></div>
          <h3>小红书直播入口</h3>
          <p>进入小红书直播列表或 App 顶部“世界杯”频道，查看直播、回放和精彩片段。</p>
          <a className="text-link" href={xiaohongshuLiveUrl} target="_blank" rel="noreferrer">
            打开直播入口
            <ArrowRight size={14} />
          </a>
        </section>
        <section className="home-info-block">
          <div className="info-icon"><Database size={18} /></div>
          <h3>数据刷新</h3>
          <p>本地同步脚本每 {Math.round((meta.refreshMs ?? 60000) / 1000)} 秒拉取赛程、详情、媒体图和赔率。</p>
          <span className="home-info-note">最新：{formatMetaTime(meta.fetchedAt)}</span>
        </section>
        <section className="home-info-block">
          <div className="info-icon"><Newspaper size={18} /></div>
          <h3>内容更丰富</h3>
          <p>首页优先展示 ESPN 比赛头图或视频缩略图，缺失时自动使用双方队徽视觉。</p>
          <span className="home-info-note">详情覆盖 {meta.details?.total ?? Object.keys(matchDetails).length} 场</span>
        </section>
      </div>
    </section>
  );
}

function NewsPanel({ query = "", onSelectMatch }) {
  const { news, meta } = usePortalData();
  const lowerQuery = query.trim().toLowerCase();
  const rows = (news ?? []).filter((item) => {
    if (!lowerQuery) {
      return true;
    }
    return (
      item.headline?.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.matchLabel?.includes(query)
    );
  });

  return (
    <section className="database-section expanded-panel">
      <div className="section-head standalone news-page-head">
        <div>
          <h2>实时新闻</h2>
          <p>来自 ESPN summary/news，随本地数据同步一起更新。最新同步：{formatMetaTime(meta.fetchedAt)}</p>
        </div>
        <Tag tone="blue">{rows.length} 条</Tag>
      </div>
      <div className="news-grid">
        {rows.map((item) => (
          <article className="news-card" key={item.id || item.headline}>
            {item.imageUrl ? <img src={item.imageUrl} alt={item.imageAlt || item.headline} /> : null}
            <div className="news-card-body">
              <div className="news-card-meta">
                <Tag tone={item.source === "ESPN article" ? "green" : "neutral"}>{item.source}</Tag>
                <span>{item.matchLabel || item.stage || "世界杯"}</span>
              </div>
              <h3>{item.headline}</h3>
              {item.description ? <p>{item.description}</p> : null}
              <div className="news-card-actions">
                {item.link ? (
                  <a className="text-link" href={item.link} target="_blank" rel="noreferrer">
                    打开原文
                    <ArrowRight size={14} />
                  </a>
                ) : null}
                {item.matchId ? (
                  <button type="button" className="text-link as-button" onClick={() => onSelectMatch(item.matchId)}>
                    查看比赛
                    <ArrowRight size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
        {!rows.length ? (
          <div className="detail-empty">
            <Newspaper size={18} />
            <strong>暂无新闻</strong>
            <span>当前筛选下没有新闻，等待下一轮数据同步。</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function DataDocsPanel() {
  const { dataDocs, meta } = usePortalData();
  const docs = dataDocs ?? {
    updatedAt: meta.fetchedAt,
    refreshMs: meta.refreshMs,
    timeZone: meta.displayTimeZone,
    sources: [],
    coverage: [],
    updatePolicy: [],
  };

  return (
    <section className="database-section expanded-panel">
      <div className="section-head standalone news-page-head">
        <div>
          <h2>数据说明</h2>
          <p>数据口径、来源覆盖和刷新策略，随本地 JSON 一起更新。更新时间：{formatMetaTime(docs.updatedAt)}</p>
        </div>
        <Tag tone="neutral">{Math.round((docs.refreshMs ?? 60000) / 1000)} 秒刷新</Tag>
      </div>

      <div className="docs-coverage-grid">
        {(docs.coverage ?? []).map((item) => (
          <div className="docs-metric" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="docs-layout">
        <section className="docs-block">
          <h3>数据来源</h3>
          <div className="source-list">
            {(docs.sources ?? []).map((source) => (
              <a className="source-item" key={source.name} href={source.url} target="_blank" rel="noreferrer">
                <span>
                  <strong>{source.name}</strong>
                  <small>{(source.fields ?? []).join(" / ")}</small>
                </span>
                <ArrowRight size={14} />
              </a>
            ))}
          </div>
        </section>
        <section className="docs-block">
          <h3>刷新策略</h3>
          <div className="policy-list">
            {(docs.updatePolicy ?? []).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export function App() {
  const [activePage, setActivePage] = useState("home");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("全部");
  const [stageFilter, setStageFilter] = useState("全部");
  const [groupFilter, setGroupFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [dateFilter, setDateFilter] = useState("全部");
  const [oddsFilter, setOddsFilter] = useState("全部");
  const [selectedMatchId, setSelectedMatchId] = useState("a03");
  const [homeFocusedMatchId, setHomeFocusedMatchId] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [detailVisible, setDetailVisible] = useState(true);
  const [detailTab, setDetailTab] = useState("概况");
  const [standingsGroup, setStandingsGroup] = useState("全部");
  const [playerMetric, setPlayerMetric] = useState("射手榜");
  const [liveData, setLiveData] = useState(null);
  const [dataStatus, setDataStatus] = useState("loading");

  const dataTeams = liveData?.teams ?? teams;
  const dataMatches = liveData?.matches ?? matches;
  const dataStandings = liveData?.standings ?? standings;
  const dataPlayers = liveData?.players?.length ? liveData.players : players;
  const dataTeamStats = liveData?.teamStats?.length ? liveData.teamStats : fallbackTeamStats();
  const dataPredictions = liveData?.predictions ?? predictionByMatch;
  const dataMatchDetails = liveData?.matchDetails ?? {};
  const dataNews = liveData?.news ?? [];
  const dataDocs = liveData?.dataDocs ?? null;
  const dataMeta = liveData?.meta ?? fallbackMeta;

  const portalData = useMemo(
    () => ({
      meta: dataMeta,
      teams: dataTeams,
      matches: dataMatches,
      standings: dataStandings,
      players: dataPlayers,
      teamStats: dataTeamStats,
      predictions: dataPredictions,
      matchDetails: dataMatchDetails,
      news: dataNews,
      dataDocs,
    }),
    [dataDocs, dataMatchDetails, dataMeta, dataMatches, dataNews, dataPlayers, dataPredictions, dataStandings, dataTeamStats, dataTeams],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadLiveData() {
      try {
        const response = await fetch(`/data/worldcup-live.json?ts=${Date.now()}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`数据请求失败：${response.status}`);
        }
        const payload = await response.json();
        if (!cancelled) {
          setLiveData(payload);
          setDataStatus("ready");
        }
      } catch (error) {
        console.warn(error);
        if (!cancelled) {
          setDataStatus("error");
        }
      }
    }

    loadLiveData();
    const timer = window.setInterval(loadLiveData, dataMeta.refreshMs ?? 300000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [dataMeta.refreshMs]);

  useEffect(() => {
    if (!dataMatches.length) {
      return;
    }
    if (dataMatches.some((match) => match.id === selectedMatchId)) {
      return;
    }
    const nextMatch = dataMatches.find((match) => match.status !== "已结束") ?? dataMatches[0];
    setSelectedMatchId(nextMatch.id);
  }, [dataMatches, selectedMatchId]);

  const selectedMatch = dataMatches.find((match) => match.id === selectedMatchId) ?? dataMatches[0];

  const filteredMatches = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return dataMatches.filter((match) => {
      const home = teamOrFallback(dataTeams, match.home);
      const away = teamOrFallback(dataTeams, match.away);
      const matchesView = view === "全部" || (view === "淘汰赛" ? match.stage !== "小组赛" : match.stage === view);
      const matchesStage = stageFilter === "全部" || match.stage === stageFilter;
      const matchesGroup = groupFilter === "全部" || match.group === groupFilter;
      const matchesStatus = statusFilter === "全部" || match.status === statusFilter;
      const matchesDate = dateFilter === "全部" || match.isoDate === dateFilter;
      const oddsRows = dataPredictions[match.id]?.odds ?? [];
      const hasPolymarket = oddsRows.some((row) => row.source === "polymarket");
      const hasOdds = oddsRows.length > 0;
      const matchesOdds =
        oddsFilter === "全部" ||
        (oddsFilter === "有 Polymarket" && hasPolymarket) ||
        (oddsFilter === "有赔率" && hasOdds) ||
        (oddsFilter === "无赔率" && !hasOdds);
      const matchesQuery =
        !lowerQuery ||
        home.name.includes(query) ||
        away.name.includes(query) ||
        home.code.toLowerCase().includes(lowerQuery) ||
        away.code.toLowerCase().includes(lowerQuery) ||
        match.venue.includes(query);

      return matchesView && matchesStage && matchesGroup && matchesStatus && matchesDate && matchesOdds && matchesQuery;
    });
  }, [dataMatches, dataPredictions, dataTeams, dateFilter, groupFilter, oddsFilter, query, stageFilter, statusFilter, view]);

  function resetScheduleFilters() {
    setView("全部");
    setStageFilter("全部");
    setGroupFilter("全部");
    setStatusFilter("全部");
    setDateFilter("全部");
    setOddsFilter("全部");
  }

  function toggleFavorite(matchId) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(matchId)) {
        next.delete(matchId);
      } else {
        next.add(matchId);
      }
      return next;
    });
  }

  function selectMatch(matchId) {
    setSelectedMatchId(matchId);
    setDetailVisible(true);
  }

  function focusHomeMatch(matchId) {
    setHomeFocusedMatchId(matchId);
  }

  function renderPrimaryContent() {
    if (activePage === "home") {
      return (
        <HomeSummary
          onPageChange={setActivePage}
          onFocusMatch={focusHomeMatch}
          onOpenMatchDetail={selectMatch}
          focusedMatchId={homeFocusedMatchId}
        />
      );
    }

    if (activePage === "news") {
      return <NewsPanel query={query} onSelectMatch={selectMatch} />;
    }

    if (activePage === "docs") {
      return <DataDocsPanel />;
    }

    if (activePage === "standings") {
      return <StandingsPanel standingsGroup={standingsGroup} setStandingsGroup={setStandingsGroup} expanded />;
    }

    if (activePage === "bracket") {
      return <KnockoutBracket selectedId={selectedMatchId} onSelect={selectMatch} />;
    }

    if (activePage === "teams") {
      return <TeamDataPanel query={query} />;
    }

    if (activePage === "players") {
      return <PlayerBoard metric={playerMetric} onMetricChange={setPlayerMetric} expanded query={query} />;
    }

    if (activePage === "odds") {
      return <OddsMatrix selectedMatch={selectedMatch} />;
    }

    return (
      <>
        {!detailVisible ? (
          <button type="button" className="open-detail" onClick={() => setDetailVisible(true)}>
            打开比赛详情
            <ArrowRight size={15} />
          </button>
        ) : null}
        <ScheduleTable
          rows={filteredMatches}
          selectedId={selectedMatchId}
          onSelect={selectMatch}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
        <div className="lower-grid">
          <StandingsPanel
            standingsGroup={standingsGroup}
            setStandingsGroup={setStandingsGroup}
            onOpenFull={() => setActivePage("standings")}
          />
          <PlayerBoard metric={playerMetric} onMetricChange={setPlayerMetric} query={query} />
        </div>
      </>
    );
  }

  return (
    <DataContext.Provider value={portalData}>
      <main className={`app-shell ${detailVisible ? "" : "detail-hidden"}`}>
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <section className="workspace">
          <PageHeader
            activePage={activePage}
            query={query}
            onQueryChange={setQuery}
            view={view}
            onViewChange={setView}
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            groupFilter={groupFilter}
            setGroupFilter={setGroupFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            oddsFilter={oddsFilter}
            setOddsFilter={setOddsFilter}
            onResetFilters={resetScheduleFilters}
          />
          <DataStatus status={dataStatus} />
          {renderPrimaryContent()}
        </section>
        {detailVisible ? (
          <DetailPanel
            match={selectedMatch}
            detailTab={detailTab}
            setDetailTab={setDetailTab}
            onClose={() => setDetailVisible(false)}
          />
        ) : null}
      </main>
    </DataContext.Provider>
  );
}
