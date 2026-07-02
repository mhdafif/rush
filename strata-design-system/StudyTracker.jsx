import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Flame,
  Lock,
  RotateCcw,
  Search,
  Trophy,
} from "lucide-react";

// ---------------------------------------------------------------------------
// STRATA — Field Research Console
// Design tokens mirrored from design-system.md / tokens.ts
// ---------------------------------------------------------------------------
const COLOR = {
  ink: "#0B0F14",
  panel: "#121822",
  panelSoft: "#1A2230",
  line: "#232C3A",
  textPrimary: "#CFD8E3",
  textMuted: "#76869C",
  amber: "#F5A623",
  amberSoft: "#3A2B12",
  teal: "#2DD4BF",
  emerald: "#34D399",
  rose: "#F43F5E",
  paper: "#ECE4D3",
};

const FONT = {
  display: "'Fraunces', Georgia, serif",
  body: "'Inter', system-ui, sans-serif",
  data: "'IBM Plex Mono', ui-monospace, monospace",
};

const STORAGE_KEY = "strata-tracker-progress-v1";

// ---------------------------------------------------------------------------
// Content — a real senior-track frontend curriculum, not placeholder copy
// ---------------------------------------------------------------------------
const TOPICS = [
  {
    id: "js-ts",
    title: "JavaScript & TypeScript Mastery",
    subtopics: [
      { id: "js-1", title: "Generics & conditional types", xp: 30 },
      { id: "js-2", title: "Event loop, microtasks & macrotasks", xp: 25 },
      { id: "js-3", title: "Closures & memory leak patterns", xp: 25 },
      { id: "js-4", title: "Structural typing & variance", xp: 30 },
    ],
  },
  {
    id: "react-arch",
    title: "React Architecture",
    subtopics: [
      { id: "ra-1", title: "Reconciliation & fiber internals", xp: 35 },
      {
        id: "ra-2",
        title: "State colocation vs. global state trade-offs",
        xp: 30,
      },
      { id: "ra-3", title: "Compound component patterns", xp: 25 },
      { id: "ra-4", title: "Render profiling & memoization", xp: 30 },
    ],
  },
  {
    id: "sys-design",
    title: "System Design for Frontend",
    subtopics: [
      { id: "sd-1", title: "Micro-frontends vs. monolith trade-offs", xp: 35 },
      {
        id: "sd-2",
        title: "Cache invalidation & stale-while-revalidate",
        xp: 30,
      },
      { id: "sd-3", title: "API contract versioning", xp: 25 },
    ],
  },
  {
    id: "perf",
    title: "Performance Engineering",
    subtopics: [
      { id: "pf-1", title: "Core Web Vitals deep dive", xp: 30 },
      { id: "pf-2", title: "Bundle splitting & lazy loading", xp: 25 },
      {
        id: "pf-3",
        title: "Rendering strategies: CSR / SSR / SSG / ISR",
        xp: 35,
      },
    ],
  },
  {
    id: "testing",
    title: "Testing & Reliability",
    subtopics: [
      { id: "ts-1", title: "Testing pyramid for frontend", xp: 25 },
      { id: "ts-2", title: "Diagnosing race conditions & flaky tests", xp: 35 },
      { id: "ts-3", title: "Contract & integration testing", xp: 25 },
    ],
  },
  {
    id: "leadership",
    title: "Leadership & Influence",
    subtopics: [
      { id: "ld-1", title: "Writing RFCs that get approved", xp: 30 },
      { id: "ld-2", title: "Code review as mentorship", xp: 25 },
      { id: "ld-3", title: "Driving cross-team technical decisions", xp: 35 },
    ],
  },
];

const ALL_SUBTOPICS = TOPICS.flatMap((t) =>
  t.subtopics.map((s) => ({ ...s, topicId: t.id }))
);
const MAX_XP = ALL_SUBTOPICS.reduce((sum, s) => sum + s.xp, 0);

const RANKS = [
  { name: "Recruit", min: 0 },
  { name: "Operator", min: 100 },
  { name: "Specialist", min: 220 },
  { name: "Senior Engineer", min: 350 },
  { name: "Principal", min: 470 },
  { name: "Architect", min: MAX_XP },
];

const ACHIEVEMENTS = [
  {
    id: "first-objective",
    title: "First Entry",
    description: "Log your first completed objective.",
    check: (s) => Object.values(s).some((v) => v === "complete"),
  },
  {
    id: "topic-cleared",
    title: "Mission Complete",
    description: "Clear every objective in one topic.",
    check: (s) =>
      TOPICS.some((t) => t.subtopics.every((sub) => s[sub.id] === "complete")),
  },
  {
    id: "halfway",
    title: "Halfway Point",
    description: "Reach 50% overall progress.",
    check: (s) =>
      ALL_SUBTOPICS.filter((sub) => s[sub.id] === "complete").length /
        ALL_SUBTOPICS.length >=
      0.5,
  },
  {
    id: "streak-3",
    title: "On a Roll",
    description: "Reach a 3-day study streak.",
    check: (_s, streak) => streak >= 3,
  },
  {
    id: "leadership-cleared",
    title: "Senior Mindset",
    description: "Clear the Leadership & Influence topic.",
    check: (s) =>
      TOPICS.find((t) => t.id === "leadership").subtopics.every(
        (sub) => s[sub.id] === "complete"
      ),
  },
  {
    id: "all-cleared",
    title: "Field Architect",
    description: "Clear every topic in the plan.",
    check: (s) => ALL_SUBTOPICS.every((sub) => s[sub.id] === "complete"),
  },
];

const STATUS_CYCLE = {
  "not-started": "in-progress",
  "in-progress": "complete",
  complete: "not-started",
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

// ---------------------------------------------------------------------------
// Stylesheet — injected once. Real CSS so :hover / :focus-visible / prefers-
// reduced-motion are handled natively instead of via JS hover-state hacks.
// ---------------------------------------------------------------------------
const STYLES = `
  .strata-root { background:${COLOR.ink}; color:${COLOR.textPrimary}; font-family:${FONT.body}; }
  .strata-mono { font-family:${FONT.data}; letter-spacing:0.02em; }
  .strata-display { font-family:${FONT.display}; }
  .strata-card { background:${COLOR.panel}; border:1px solid ${COLOR.line}; border-radius:10px; }
  .strata-row { background:transparent; border:none; cursor:pointer; text-align:left; transition:background 200ms ease-out; }
  .strata-row:hover { background:${COLOR.panelSoft}; }
  .strata-input { background:${COLOR.panel}; border:1px solid ${COLOR.line}; color:${COLOR.textPrimary}; }
  .strata-input::placeholder { color:${COLOR.textMuted}; }
  *:focus-visible { outline:2px solid ${COLOR.amber}; outline-offset:2px; }
  .strata-patch { border:1px solid ${COLOR.line}; background:${COLOR.panelSoft}; opacity:0.5; border-radius:10px; transition:all 200ms ease-out; }
  .strata-patch.unlocked { border-color:${COLOR.amber}; background:${COLOR.amberSoft}; opacity:1; }
  .strata-stamp { animation: strata-stamp-kf 260ms cubic-bezier(0.34,1.56,0.64,1); }
  @keyframes strata-stamp-kf { 0% { transform:scale(0.85); opacity:0.4; } 60% { transform:scale(1.12); } 100% { transform:scale(1); opacity:1; } }
  @media (prefers-reduced-motion: reduce) {
    .strata-stamp { animation:none !important; }
    .strata-row, .strata-patch { transition:none !important; }
  }
`;

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById("strata-fonts")) return;
    const link = document.createElement("link");
    link.id = "strata-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------
function StatusGlyph({ status }) {
  if (status === "complete")
    return <CheckCircle2 size={18} color={COLOR.emerald} strokeWidth={2} />;
  if (status === "in-progress")
    return (
      <Circle
        size={18}
        color={COLOR.amber}
        fill={COLOR.amber}
        fillOpacity={0.25}
        strokeWidth={2}
      />
    );
  return <Circle size={18} color={COLOR.line} strokeWidth={2} />;
}

function StatBlock({ label, value, color, mono = true }) {
  return (
    <div style={{ flex: "1 1 0", minWidth: 110 }}>
      <div
        className="strata-mono"
        style={{
          fontSize: 11,
          color: COLOR.textMuted,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        className={mono ? "strata-mono" : ""}
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: color || COLOR.textPrimary,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function StudyTracker() {
  useGoogleFonts();

  const [statusMap, setStatusMap] = useState(null); // null = loading
  const [streak, setStreak] = useState(0);
  const [lastStudied, setLastStudied] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set([TOPICS[0].id]));
  const [query, setQuery] = useState("");
  const [justCompleted, setJustCompleted] = useState(null);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | error
  const stampTimer = useRef(null);

  // ---- load persisted progress -------------------------------------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (cancelled) return;
        const data = result ? JSON.parse(result.value) : null;
        setStatusMap(data?.statusMap ?? {});
        setStreak(data?.streak ?? 0);
        setLastStudied(data?.lastStudied ?? null);
      } catch {
        // Key not found yet, or storage unavailable — start fresh rather than blocking the UI.
        if (!cancelled) {
          setStatusMap({});
          setStreak(0);
          setLastStudied(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- persist on change ---------------------------------------------------
  useEffect(() => {
    if (statusMap === null) return; // still loading, nothing to persist yet
    let cancelled = false;
    setSaveState("saving");
    (async () => {
      try {
        await window.storage.set(
          STORAGE_KEY,
          JSON.stringify({ statusMap, streak, lastStudied })
        );
        if (!cancelled) setSaveState("idle");
      } catch {
        if (!cancelled) setSaveState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [statusMap, streak, lastStudied]);

  // ---- derived stats ---------------------------------------------------
  const completedIds = useMemo(
    () =>
      statusMap
        ? ALL_SUBTOPICS.filter((s) => statusMap[s.id] === "complete")
        : [],
    [statusMap]
  );
  const totalXp = useMemo(
    () => completedIds.reduce((sum, s) => sum + s.xp, 0),
    [completedIds]
  );
  const progressPct = ALL_SUBTOPICS.length
    ? Math.round((completedIds.length / ALL_SUBTOPICS.length) * 100)
    : 0;
  const topicsCleared = TOPICS.filter((t) =>
    t.subtopics.every((s) => statusMap?.[s.id] === "complete")
  ).length;
  const rank = [...RANKS].reverse().find((r) => totalXp >= r.min) ?? RANKS[0];
  const nextRank = RANKS[RANKS.findIndex((r) => r.name === rank.name) + 1];

  const unlockedAchievements = useMemo(() => {
    if (!statusMap) return new Set();
    const ids = ACHIEVEMENTS.filter((a) => a.check(statusMap, streak)).map(
      (a) => a.id
    );
    return new Set(ids);
  }, [statusMap, streak]);

  // ---- search filtering ---------------------------------------------------
  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOPICS;
    return TOPICS.map((t) => {
      const topicMatches = t.title.toLowerCase().includes(q);
      const subMatches = t.subtopics.filter((s) =>
        s.title.toLowerCase().includes(q)
      );
      if (topicMatches) return t;
      if (subMatches.length) return { ...t, subtopics: subMatches };
      return null;
    }).filter(Boolean);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) return;
    setExpanded(new Set(filteredTopics.map((t) => t.id)));
  }, [query, filteredTopics]);

  // ---- actions ---------------------------------------------------
  const toggleTopic = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const cycleStatus = useCallback((subId) => {
    setStatusMap((prev) => {
      const current = prev[subId] ?? "not-started";
      const nextStatus = STATUS_CYCLE[current];
      if (nextStatus === "complete") {
        setJustCompleted(subId);
        clearTimeout(stampTimer.current);
        stampTimer.current = setTimeout(() => setJustCompleted(null), 280);
      }
      return { ...prev, [subId]: nextStatus };
    });

    setLastStudied((prevDate) => {
      const today = todayKey();
      if (prevDate === today) return prevDate; // already logged today, no change
      setStreak((prevStreak) =>
        prevDate && daysBetween(prevDate, today) === 1 ? prevStreak + 1 : 1
      );
      return today;
    });
  }, []);

  const resetProgress = useCallback(async () => {
    if (
      !window.confirm(
        "Reset all progress? This clears every checked objective, your streak, and XP."
      )
    )
      return;
    setStatusMap({});
    setStreak(0);
    setLastStudied(null);
    try {
      await window.storage.delete(STORAGE_KEY);
    } catch {
      // nothing persisted yet — fine to ignore
    }
  }, []);

  if (statusMap === null) {
    return (
      <div
        className="strata-root"
        style={{ padding: 40, fontSize: 13, color: COLOR.textMuted }}
      >
        <style>{STYLES}</style>
        Loading field console…
      </div>
    );
  }

  return (
    <div
      className="strata-root"
      style={{ minHeight: "100%", padding: "24px 16px 40px" }}
    >
      <style>{STYLES}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              className="strata-mono"
              style={{
                fontSize: 11,
                color: COLOR.amber,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Field Research Console
            </div>
            <div
              className="strata-display"
              style={{ fontSize: 28, fontWeight: 600 }}
            >
              STRATA
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              className="strata-mono"
              style={{
                fontSize: 11,
                color: COLOR.textMuted,
                textTransform: "uppercase",
              }}
            >
              Current rank
            </div>
            <div
              className="strata-mono"
              style={{ fontSize: 16, fontWeight: 600, color: COLOR.amber }}
            >
              {rank.name}
              {nextRank && (
                <span style={{ color: COLOR.textMuted, fontWeight: 400 }}>
                  {" "}
                  · {totalXp}/{nextRank.min} XP
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Telemetry */}
        <div
          className="strata-card"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <StatBlock
            label="Progress"
            value={`${progressPct}%`}
            color={COLOR.amber}
          />
          <StatBlock
            label="Topics cleared"
            value={`${topicsCleared}/${TOPICS.length}`}
            color={COLOR.teal}
          />
          <StatBlock
            label="Streak"
            value={
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                <Flame
                  size={18}
                  color={COLOR.rose}
                  fill={streak > 0 ? COLOR.rose : "transparent"}
                />
                {streak}d
              </span>
            }
            color={COLOR.rose}
            mono={false}
          />
          <StatBlock label="Total XP" value={totalXp} color={COLOR.emerald} />
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Search
            size={16}
            color={COLOR.textMuted}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            className="strata-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics or objectives…"
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              borderRadius: 10,
              fontSize: 14,
              fontFamily: FONT.body,
            }}
          />
        </div>

        {/* Checklist */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {filteredTopics.length === 0 && (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: COLOR.textMuted,
                fontSize: 13,
              }}
            >
              No topics or objectives match “{query}”.
            </div>
          )}
          {filteredTopics.map((topic) => {
            const subs = topic.subtopics;
            const doneCount = subs.filter(
              (s) => statusMap[s.id] === "complete"
            ).length;
            const topicStatus =
              doneCount === subs.length
                ? "complete"
                : doneCount > 0
                  ? "in-progress"
                  : "not-started";
            const isOpen = expanded.has(topic.id);
            return (
              <div
                key={topic.id}
                className="strata-card"
                style={{ overflow: "hidden" }}
              >
                <button
                  className="strata-row"
                  onClick={() => toggleTopic(topic.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                  }}
                  aria-expanded={isOpen}
                >
                  <StatusGlyph status={topicStatus} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
                    {topic.title}
                  </span>
                  <span
                    className="strata-mono"
                    style={{ fontSize: 12, color: COLOR.textMuted }}
                  >
                    {doneCount}/{subs.length}
                  </span>
                  {isOpen ? (
                    <ChevronDown size={16} color={COLOR.textMuted} />
                  ) : (
                    <ChevronRight size={16} color={COLOR.textMuted} />
                  )}
                </button>

                {isOpen && (
                  <div style={{ borderTop: `1px solid ${COLOR.line}` }}>
                    {subs.map((sub, i) => {
                      const status = statusMap[sub.id] ?? "not-started";
                      return (
                        <button
                          key={sub.id}
                          className="strata-row"
                          onClick={() => cycleStatus(sub.id)}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 14px 10px 30px",
                          }}
                        >
                          <span
                            className="strata-mono"
                            style={{
                              fontSize: 11,
                              color: COLOR.textMuted,
                              width: 18,
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={
                              justCompleted === sub.id ? "strata-stamp" : ""
                            }
                            style={{ display: "flex" }}
                          >
                            <StatusGlyph status={status} />
                          </span>
                          <span
                            style={{
                              flex: 1,
                              fontSize: 13.5,
                              textAlign: "left",
                              color:
                                status === "complete"
                                  ? COLOR.textMuted
                                  : COLOR.textPrimary,
                              textDecoration:
                                status === "complete" ? "line-through" : "none",
                            }}
                          >
                            {sub.title}
                          </span>
                          <span
                            className="strata-mono"
                            style={{
                              fontSize: 11,
                              color:
                                status === "complete"
                                  ? COLOR.emerald
                                  : COLOR.textMuted,
                            }}
                          >
                            +{sub.xp} XP
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div style={{ marginBottom: 8 }}>
          <div
            className="strata-mono"
            style={{
              fontSize: 11,
              color: COLOR.textMuted,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Field commendations
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {ACHIEVEMENTS.map((a) => {
              const unlocked = unlockedAchievements.has(a.id);
              return (
                <div
                  key={a.id}
                  className={`strata-patch${unlocked ? " unlocked" : ""}`}
                  style={{ padding: 12, display: "flex", gap: 10 }}
                >
                  {unlocked ? (
                    <Trophy size={18} color={COLOR.amber} />
                  ) : (
                    <Lock size={18} color={COLOR.textMuted} />
                  )}
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: unlocked ? COLOR.amber : COLOR.textMuted,
                      }}
                    >
                      {a.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: COLOR.textMuted,
                        marginTop: 2,
                      }}
                    >
                      {a.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer / reset */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 24,
            paddingTop: 16,
            borderTop: `1px solid ${COLOR.line}`,
          }}
        >
          <span
            className="strata-mono"
            style={{ fontSize: 11, color: COLOR.textMuted }}
          >
            {saveState === "saving"
              ? "Syncing…"
              : saveState === "error"
                ? "Sync failed — progress kept locally this session"
                : "Synced"}
          </span>
          <button
            onClick={resetProgress}
            className="strata-mono"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: `1px solid ${COLOR.line}`,
              color: COLOR.textMuted,
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={12} /> Reset progress
          </button>
        </div>
      </div>
    </div>
  );
}
