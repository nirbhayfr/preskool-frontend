/**
 * StudentMeetingPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Student-only page to find and join class meetings via Jitsi.
 *
 * API Base: https://erp-backend-2ybf.onrender.com/api
 * Auth:     Bearer token auto-read from localStorage('token')
 * Endpoint: GET /api/meetings/:classID/:sectionID
 *
 * Usage:
 *   import StudentMeetingPage from './StudentMeetingPage'
 *   <StudentMeetingPage />
 */

import { useState, useEffect, useRef } from "react";

/* ─── API Config ─────────────────────────────────────────────────────────── */
const API_BASE = "https://erp-backend-2ybf.onrender.com/api";

const apiFetch = async (url) => {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${url}`, { headers });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Request failed");
  return data.data;
};

/* ─── Class & Section Options ────────────────────────────────────────────── */
const CLASS_OPTIONS = [
  { value: "LKG", label: "LKG" },
  { value: "UKG", label: "UKG" },
  { value: "1",  label: "Class 1" },
  { value: "2",  label: "Class 2" },
  { value: "3",  label: "Class 3" },
  { value: "4",  label: "Class 4" },
  { value: "5",  label: "Class 5" },
  { value: "6",  label: "Class 6" },
  { value: "7",  label: "Class 7" },
  { value: "8",  label: "Class 8" },
  { value: "9",  label: "Class 9" },
  { value: "10", label: "Class 10" },
  { value: "11", label: "Class 11" },
  { value: "12", label: "Class 12" },
];

const SECTION_OPTIONS = [
  { value: "A", label: "Section A" },
  { value: "B", label: "Section B" },
  { value: "C", label: "Section C" },
];

const Icon = ({ d, size = 18, stroke = "currentColor", className = "" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={stroke} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    {Array.isArray(d)
      ? d.map((path, i) => <path key={i} d={path} />)
      : <path d={d} />}   {/* ← FIXED: was p, now d */}
  </svg>
);

/* ─── Icon Paths ─────────────────────────────────────────────────────────── */
const ICONS = {
  video:   ["M23 7l-7 5 7 5V7z", "M1 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"],
  join:    "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
  clock:   ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  warn:    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  phone:   "M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 16.29 7.62 14.48 6.29 12.37A19.79 19.79 0 0 1 3.22 3.74 2 2 0 0 1 5.21 1.56L8 1.56a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.48",
  chevron: "M6 9l6 6 6-6",
  search:  "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  spin:    "M21 12a9 9 0 1 1-6.219-8.56",
};

/* ─── Spinner ────────────────────────────────────────────────────────────── */
const Spinner = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="animate-spin">
    <path d={ICONS.spin} />
  </svg>
);

/* ─── Select Dropdown ────────────────────────────────────────────────────── */
const Select = ({ label, value, onChange, options, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-background border border-border rounded-xl
          text-sm text-foreground px-3.5 py-2.5 pr-9 outline-none cursor-pointer
          focus:border-primary focus:ring-2 focus:ring-primary/15
          hover:border-border/80 transition-all duration-200"
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
        <Icon d={ICONS.chevron} size={14} />
      </span>
    </div>
  </div>
);

/* ─── Meeting Card ───────────────────────────────────────────────────────── */
const MeetingCard = ({ meeting, onJoin }) => {
  const dateStr = new Date(meeting.MeetingDate).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border hover:border-primary/40 transition-colors duration-200">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
        <Icon d={ICONS.video} size={16} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">{meeting.Subject}</p>
        <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground">
          {/* Live pulse dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <Icon d={ICONS.clock} size={11} />
          <span className="text-[11px]">{dateStr}</span>
        </div>
      </div>

      {/* Join button */}
      <button
        onClick={() => onJoin(meeting)}
        className="flex-shrink-0 px-4 py-1.5 bg-primary text-primary-foreground
          text-xs font-semibold rounded-lg hover:opacity-90 active:scale-[.97]
          transition-all duration-150"
      >
        Join
      </button>
    </div>
  );
};

/* ─── Find Meetings Panel ────────────────────────────────────────────────── */
function FindMeetingsPanel({ onEnterRoom }) {
  const [classID,   setClassID]   = useState("");
  const [sectionID, setSectionID] = useState("");
  const [meetings,  setMeetings]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [fetched,   setFetched]   = useState(false);
  const [error,     setError]     = useState("");

  const canSearch = classID && sectionID;

  const handleFind = async () => {
    setLoading(true);
    setError("");
    setFetched(false);
    setMeetings([]);
    try {
      const data = await apiFetch(`/meetings/${classID}/${sectionID}`);
      setMeetings(Array.isArray(data) ? data : []);
      setFetched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && canSearch && !loading) handleFind();
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Class"
          value={classID}
          onChange={setClassID}
          options={CLASS_OPTIONS}
          placeholder="Select class"
        />
        <Select
          label="Section"
          value={sectionID}
          onChange={setSectionID}
          options={SECTION_OPTIONS}
          placeholder="Select section"
        />
      </div>

      {/* Find Button */}
      <button
        onClick={handleFind}
        disabled={!canSearch || loading}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-5
          bg-primary text-primary-foreground font-semibold text-sm rounded-xl
          hover:opacity-90 active:scale-[.98] transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Spinner size={15} /> Searching…</>
        ) : (
          <><Icon d={ICONS.search} size={15} stroke="currentColor" /> Find Meetings</>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl
          bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <Icon d={ICONS.warn} size={15} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {fetched && meetings.length === 0 && !error && (
        <div className="mt-6 flex flex-col items-center gap-2 py-10 text-muted-foreground">
          <Icon d={ICONS.video} size={36} className="opacity-15" />
          <p className="text-sm font-medium">No active meetings found</p>
          <p className="text-xs opacity-60">Ask your teacher to start a session.</p>
        </div>
      )}

      {/* Meetings list */}
      {meetings.length > 0 && (
        <div className="mt-5">
          {/* Section header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Available Sessions
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
              bg-primary/10 text-primary border border-primary/20">
              {meetings.length} found
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-0.5">
            {meetings.map(m => (
              <MeetingCard
                key={m.MeetingID}
                meeting={m}
                onJoin={(meeting) => onEnterRoom(meeting)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Landing Page ───────────────────────────────────────────────────────── */
function LandingPage({ onEnterRoom }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Icon d={ICONS.video} size={15} stroke="white" />
            </div>
            <span className="font-bold text-foreground text-base">ClassMeet</span>
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full
            bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
            Student Portal
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-xl mx-auto px-6 py-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20
            flex items-center justify-center text-primary mx-auto mb-4">
            <Icon d={ICONS.join} size={26} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Join Your Class</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Select your class and section to find active sessions and join instantly — no downloads needed.
          </p>
        </div>
      </div>

      {/* Main card */}
      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="px-6 pt-6 pb-5 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20
              flex items-center justify-center text-primary flex-shrink-0">
              <Icon d={ICONS.search} size={18} />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">Find a Meeting</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select your class and section to search for sessions
              </p>
            </div>
          </div>

          {/* Card body */}
          <div className="p-6">
            <FindMeetingsPanel onEnterRoom={onEnterRoom} />
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Meetings powered by{" "}
          <a
            href="https://meet.jit.si"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Jitsi Meet
          </a>
        </p>
      </div>
    </div>
  );
}

/* ─── Confirm Leave Modal ────────────────────────────────────────────────── */
function ConfirmModal({ subject, onStay, onLeave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div className="bg-card border border-border rounded-2xl p-7 max-w-sm w-full text-center shadow-2xl">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
          bg-destructive/10 border border-destructive/20 text-destructive">
          <Icon d={ICONS.phone} size={24} />
        </div>
        <p className="font-bold text-lg text-foreground mb-1">Leave session?</p>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          You'll be disconnected from{" "}
          <strong className="text-foreground">{subject}</strong>.
          You can rejoin anytime.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onStay}
            className="py-2.5 rounded-xl bg-muted border border-border text-foreground
              text-sm font-semibold hover:bg-accent transition-colors"
          >
            Stay
          </button>
          <button
            onClick={onLeave}
            className="py-2.5 rounded-xl bg-destructive text-white
              text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Meeting Room ───────────────────────────────────────────────────────── */
function MeetingRoom({ meetingData, onLeave }) {
  const [secs,    setSecs]    = useState(0);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:` +
    `${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:` +
    `${String(s % 60).padStart(2, "0")}`;

  const jitsiSrc =
    `${meetingData.MeetingLink}` +
    `#config.toolbarButtons=[]` +
    `&config.prejoinPageEnabled=false` +
    `&userInfo.displayName=Student`;

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
        .blink { animation: blink 2s infinite; }
      `}</style>

      <div className="flex flex-col bg-background text-foreground" style={{ height: "100vh" }}>
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-2.5 bg-card border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Icon d={ICONS.video} size={13} stroke="white" />
              </div>
              <span className="font-bold text-foreground text-sm hidden sm:block">ClassMeet</span>
            </div>
            <div className="w-px h-5 bg-border hidden sm:block" />
            {/* Meeting info */}
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">{meetingData.Subject}</p>
              <p className="text-xs text-muted-foreground">
                Class {meetingData.ClassID} · Section {meetingData.SectionID}
              </p>
            </div>
            {/* Live badge */}
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg
              bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive blink" />
              LIVE · {fmt(secs)}
            </span>
          </div>

          {/* Leave button */}
          <button
            onClick={() => setConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive
              text-white text-sm font-semibold hover:opacity-90 active:scale-[.98]
              transition-all duration-150"
          >
            <Icon d={ICONS.phone} size={14} stroke="white" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </header>

        {/* Jitsi iframe */}
        <main className="flex-1 relative bg-black min-w-0">
          <iframe
            src={jitsiSrc}
            allow="camera; microphone; display-capture; fullscreen"
            allowFullScreen
            className="w-full h-full border-none"
            title="Jitsi Meeting"
          />
        </main>
      </div>

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          subject={meetingData.Subject}
          onStay={() => setConfirm(false)}
          onLeave={() => { setConfirm(false); onLeave(); }}
        />
      )}
    </>
  );
}

/* ─── Root Export ────────────────────────────────────────────────────────── */
export default function StudentMeetingPage() {
  const [room, setRoom] = useState(null); // meetingData object

  if (room) {
    return (
      <MeetingRoom
        meetingData={room}
        onLeave={() => setRoom(null)}
      />
    );
  }

  return (
    <LandingPage
      onEnterRoom={(meetingData) => setRoom(meetingData)}
    />
  );
}
