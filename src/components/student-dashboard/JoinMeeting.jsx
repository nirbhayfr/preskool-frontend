/**
 * JoinMeeting.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Student-only page to find and join class meetings via Jitsi.
 *
 * Uses Jitsi Meet External API for full control:
 *   - No prejoin / lobby screen
 *   - No "open in app" mobile prompt
 *   - Custom toolbar: mic, camera, screenshare, raise hand, chat, leave
 *   - Mobile responsive
 *
 * API: GET /online-meetings/list/:classID/:sectionID
 */

import { useState, useEffect, useRef } from "react";

/* ─── API ────────────────────────────────────────────────────────────────── */
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

/* ─── Options ────────────────────────────────────────────────────────────── */
const CLASS_OPTIONS = [
  { value: "LKG", label: "LKG" },
  { value: "UKG", label: "UKG" },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `Class ${i + 1}`,
  })),
];

const SECTION_OPTIONS = [
  { value: "1", label: "Section A" },
  { value: "2", label: "Section B" },
  { value: "3", label: "Section C" },
];

/* ─── SVG Icon ───────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20, stroke = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  video:    ["M23 7l-7 5 7 5V7z", "M1 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"],
  videoOff: ["M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10", "M1 1l22 22"],
  mic:      ["M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v3", "M8 22h8"],
  micOff:   ["M1 1l22 22", "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6", "M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23", "M12 19v3", "M8 22h8"],
  chat:     "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  share:    ["M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", "M16 6l-4-4-4 4", "M12 2v13"],
  hand:     ["M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0", "M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2", "M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8", "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"],
  phone:    "M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 16.29 7.62 14.48 6.29 12.37A19.79 19.79 0 0 1 3.22 3.74 2 2 0 0 1 5.21 1.56L8 1.56a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.48",
  chevron:  "M6 9l6 6 6-6",
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  spin:     "M21 12a9 9 0 1 1-6.219-8.56",
  warn:     "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  send:     "M22 2L11 13M22 2L15 22 8 13 2 9z",
  close:    "M18 6L6 18M6 6l12 12",
  clock:    ["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"],
  join:     "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
};

/* ─── Spinner ────────────────────────────────────────────────────────────── */
const Spinner = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="animate-spin">
    <path d={ICONS.spin} />
  </svg>
);

/* ─── Select ─────────────────────────────────────────────────────────────── */
const Select = ({ label, value, onChange, options, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-background border border-border rounded-xl
          text-sm text-foreground px-3.5 py-2.5 pr-9 outline-none cursor-pointer
          focus:border-primary focus:ring-2 focus:ring-primary/15
          hover:border-border/80 transition-all duration-200">
        <option value="">{placeholder}</option>
        {options.map((o) => (
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
    dateStyle: "medium", timeStyle: "short",
  });
  return (
    <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border hover:border-primary/40 transition-colors duration-200">
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
        <Icon d={ICONS.video} size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">{meeting.Subject}</p>
        <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <Icon d={ICONS.clock} size={11} />
          <span className="text-[11px]">{dateStr}</span>
        </div>
      </div>
      <button onClick={() => onJoin(meeting)}
        className="flex-shrink-0 px-4 py-1.5 bg-primary text-primary-foreground
          text-xs font-semibold rounded-lg hover:opacity-90 active:scale-[.97]
          transition-all duration-150">
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

  const handleFind = async () => {
    setLoading(true); setError(""); setFetched(false); setMeetings([]);
    try {
      const data = await apiFetch(`/online-meetings/list/${classID}/${sectionID}`);
      setMeetings(Array.isArray(data) ? data : []);
      setFetched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <Select label="Class"   value={classID}   onChange={setClassID}   options={CLASS_OPTIONS}   placeholder="Select class"   />
        <Select label="Section" value={sectionID} onChange={setSectionID} options={SECTION_OPTIONS} placeholder="Select section" />
      </div>

      <button onClick={handleFind} disabled={!classID || !sectionID || loading}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-5
          bg-primary text-primary-foreground font-semibold text-sm rounded-xl
          hover:opacity-90 active:scale-[.98] transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed">
        {loading
          ? <><Spinner size={15} /> Searching…</>
          : <><Icon d={ICONS.search} size={15} /> Find Meetings</>
        }
      </button>

      {error && (
        <div className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl
          bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <Icon d={ICONS.warn} size={15} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {fetched && meetings.length === 0 && !error && (
        <div className="mt-6 flex flex-col items-center gap-2 py-10 text-muted-foreground">
          <Icon d={ICONS.video} size={36} className="opacity-15" />
          <p className="text-sm font-medium">No active meetings found</p>
          <p className="text-xs opacity-60">Ask your teacher to start a session.</p>
        </div>
      )}

      {meetings.length > 0 && (
        <div className="mt-5">
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
            {meetings.map((m) => (
              <MeetingCard key={m.MeetingID} meeting={m} onJoin={onEnterRoom} />
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
      <header className="bg-card border-b border-border">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
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

      <div className="bg-card border-b border-border">
        <div className="max-w-xl mx-auto px-6 py-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20
            flex items-center justify-center text-primary mx-auto mb-4">
            <Icon d={ICONS.join} size={26} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Join Your Class</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Select your class and section to find active sessions and join instantly.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
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
          <div className="p-6">
            <FindMeetingsPanel onEnterRoom={onEnterRoom} />
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Meetings powered by{" "}
          <a href="https://meet.jit.si" target="_blank" rel="noreferrer"
            className="text-primary underline underline-offset-2">Jitsi Meet</a>
        </p>
      </div>
    </div>
  );
}

/* ─── Chat Panel ─────────────────────────────────────────────────────────── */
function ChatPanel({ onClose, apiRef }) {
  const [msgs, setMsgs] = useState([
    {
      id: 1, sender: "System",
      text: "Welcome to the session!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      self: false,
    },
  ]);
  const [txt, setTxt] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  useEffect(() => {
    if (!apiRef?.current) return;
    const handler = ({ nick, message }) => {
      setMsgs((m) => [...m, {
        id: Date.now(), sender: nick || "Participant", text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        self: false,
      }]);
    };
    apiRef.current.addListener("incomingMessage", handler);
    return () => apiRef.current?.removeListener("incomingMessage", handler);
  }, [apiRef]);

  const send = () => {
    if (!txt.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    try { apiRef?.current?.executeCommand("sendChatMessage", txt.trim(), ""); } catch (_) {}
    setMsgs((m) => [...m, { id: Date.now(), sender: "You", text: txt.trim(), time, self: true }]);
    setTxt("");
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <p className="font-semibold text-sm text-foreground">Live Chat</p>
        <button onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted hover:bg-accent text-muted-foreground transition-colors">
          <Icon d={ICONS.close} size={13} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5">
        {msgs.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.self ? "items-end" : "items-start"}`}>
            {!m.self && (
              <span className="text-[11px] font-medium text-primary mb-0.5 px-1">{m.sender}</span>
            )}
            <div className={`max-w-[86%] px-3 py-2 text-sm leading-snug rounded-2xl
              ${m.self
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"}`}>
              {m.text}
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 px-1">{m.time}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="px-3 py-3 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 border border-border focus-within:border-primary transition-colors">
          <input value={txt} onChange={(e) => setTxt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          <button onClick={send}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all
              ${txt.trim() ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"}`}>
            <Icon d={ICONS.send} size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Confirm Modal ──────────────────────────────────────────────────────── */
function ConfirmModal({ subject, onStay, onLeave }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
      <div className="bg-card border border-border rounded-2xl p-7 max-w-sm w-full text-center shadow-2xl">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
          bg-destructive/10 border border-destructive/20 text-destructive">
          <Icon d={ICONS.phone} size={24} />
        </div>
        <p className="font-bold text-lg text-foreground mb-1">Leave session?</p>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          You'll be disconnected from{" "}
          <strong className="text-foreground">{subject}</strong>. You can rejoin anytime.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={onStay}
            className="py-2.5 rounded-xl bg-muted border border-border text-foreground
              text-sm font-semibold hover:bg-accent transition-colors">
            Stay
          </button>
          <button onClick={onLeave}
            className="py-2.5 rounded-xl bg-destructive text-white
              text-sm font-semibold hover:opacity-90 transition-opacity">
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Control Button ─────────────────────────────────────────────────────── */
const CtrlBtn = ({ icon, label, active = false, danger = false, onClick, badge = 0, activeColor = "" }) => (
  <button onClick={onClick} title={label}
    className="relative flex flex-col items-center gap-1 group focus:outline-none">
    <span className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-200
      ${danger
        ? "bg-destructive text-white hover:opacity-90"
        : active
          ? activeColor || "bg-primary/15 text-primary border border-primary/40 hover:bg-primary/25"
          : "bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
      }`}>
      <Icon d={icon} size={18} />
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full px-1 text-[9px] font-bold
          flex items-center justify-center bg-primary text-primary-foreground">
          {badge}
        </span>
      )}
    </span>
    <span className="text-[10px] text-muted-foreground group-hover:text-foreground hidden sm:block">{label}</span>
  </button>
);

/* ─── Meeting Room ───────────────────────────────────────────────────────── */
function MeetingRoom({ meetingData, onLeave }) {
  const containerRef = useRef(null);
  const apiRef       = useRef(null);

  const [mic,        setMic]        = useState(true);
  const [cam,        setCam]        = useState(true);
  const [sharing,    setSharing]    = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen,   setChatOpen]   = useState(false);
  const [confirm,    setConfirm]    = useState(false);
  const [unread,     setUnread]     = useState(0);
  const [secs,       setSecs]       = useState(0);
  const [apiReady,   setApiReady]   = useState(false);

  /* Timer */
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s) =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:` +
    `${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:` +
    `${String(s % 60).padStart(2, "0")}`;

  /* Load Jitsi External API */
  useEffect(() => {
    let domain   = "meet.jit.si";
    let roomName = meetingData.MeetingLink || "";

    try {
      const url = new URL(meetingData.MeetingLink);
      domain   = url.hostname;
      roomName = url.pathname.replace(/^\//, "");
    } catch (_) {}

    // Get student display name from localStorage
    let displayName = "Student";
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        displayName = u?.Name || u?.name || "Student";
      }
    } catch (_) {}

    const initJitsi = () => {
      if (!window.JitsiMeetExternalAPI || !containerRef.current) return;

      const api = new window.JitsiMeetExternalAPI(domain, {
        roomName,
        parentNode: containerRef.current,
        width:  "100%",
        height: "100%",
        userInfo: { displayName },
        configOverwrite: {
          // ── Remove prejoin & deep-link prompts ──────────────────────────
          prejoinPageEnabled:           false,
          prejoinConfig:                { enabled: false },
          disableDeepLinking:           true,   // removes "open in app" on mobile
          enableWelcomePage:            false,
          // ── Hide Jitsi toolbar (we use our own) ─────────────────────────
          toolbarButtons:               [],
          // ── Media defaults ──────────────────────────────────────────────
          startWithAudioMuted:          false,
          startWithVideoMuted:          false,
          startScreenSharing:           false,
          // ── Misc ────────────────────────────────────────────────────────
          disableThirdPartyRequests:    false,
          enableNoAudioDetection:       false,
          enableNoisyMicDetection:      false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS:              [],     // hide default toolbar
          MOBILE_APP_PROMO:             false,  // no "download app" on mobile
          SHOW_JITSI_WATERMARK:         false,
          SHOW_WATERMARK_FOR_GUESTS:    false,
          SHOW_BRAND_WATERMARK:         false,
          SHOW_POWERED_BY:              false,
          HIDE_INVITE_MORE_HEADER:      true,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        },
      });

      apiRef.current = api;

      api.addListener("videoConferenceJoined",       ()        => setApiReady(true));
      api.addListener("audioMuteStatusChanged",      ({ muted }) => setMic(!muted));
      api.addListener("videoMuteStatusChanged",      ({ muted }) => setCam(!muted));
      api.addListener("screenSharingStatusChanged",  ({ on })    => setSharing(on));
      api.addListener("raiseHandUpdated",            ({ handRaised: h }) => setHandRaised(h));
      api.addListener("incomingMessage",             ()        => {
        setChatOpen((open) => { if (!open) setUnread((u) => u + 1); return open; });
      });
      api.addListener("readyToClose", () => { api.dispose(); onLeave(); });
    };

    const scriptSrc = `https://${domain}/external_api.js`;

    if (window.JitsiMeetExternalAPI) {
      initJitsi();
    } else {
      const existing = document.querySelector(`script[src="${scriptSrc}"]`);
      if (existing) {
        existing.addEventListener("load", initJitsi);
      } else {
        const s = document.createElement("script");
        s.src = scriptSrc; s.async = true; s.onload = initJitsi;
        document.head.appendChild(s);
      }
    }

    return () => { try { apiRef.current?.dispose(); } catch (_) {} apiRef.current = null; };
  }, [meetingData]);

  /* Controls */
  const toggleMic   = () => apiRef.current?.executeCommand("toggleAudio");
  const toggleCam   = () => apiRef.current?.executeCommand("toggleVideo");
  const toggleShare = () => apiRef.current?.executeCommand("toggleShareScreen");
  const toggleHand  = () => apiRef.current?.executeCommand("toggleRaiseHand");
  const toggleChat  = () => setChatOpen((v) => { if (!v) setUnread(0); return !v; });

  /* Initials */
  let initials = "ST";
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      const name = u?.Name || u?.name || "Student";
      initials = name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
    }
  } catch (_) {}

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .blink { animation: blink 2s infinite; }
      `}</style>

      <div className="flex flex-col bg-background text-foreground" style={{ height: "100dvh" }}>

        {/* ── Top bar ── */}
        <header className="flex items-center justify-between px-4 py-2.5 bg-card border-b border-border flex-shrink-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Icon d={ICONS.video} size={13} stroke="white" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">{meetingData.Subject}</p>
              <p className="text-[11px] text-muted-foreground">
                Class {meetingData.ClassID} · Section {meetingData.SectionID}
              </p>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg
              bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive blink" />
              LIVE · {fmt(secs)}
            </span>
          </div>
          {/* Mobile timer */}
          <span className="flex sm:hidden items-center gap-1 text-destructive text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive blink" />
            {fmt(secs)}
          </span>
        </header>

        {/* ── Main body ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Jitsi */}
          <main className="flex-1 relative bg-black min-w-0">
            {!apiReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white gap-3 z-10">
                <Spinner size={32} />
                <p className="text-sm opacity-60">Connecting to session…</p>
              </div>
            )}
            <div ref={containerRef} className="w-full h-full" />
          </main>

          {/* Chat — desktop side panel */}
          {chatOpen && (
            <aside className="hidden sm:flex w-72 flex-col border-l border-border flex-shrink-0 overflow-hidden">
              <ChatPanel onClose={() => setChatOpen(false)} apiRef={apiRef} />
            </aside>
          )}
        </div>

        {/* Chat — mobile bottom sheet */}
        {chatOpen && (
          <div className="sm:hidden flex flex-col border-t border-border flex-shrink-0" style={{ height: "45vh" }}>
            <ChatPanel onClose={() => setChatOpen(false)} apiRef={apiRef} />
          </div>
        )}

        {/* ── Controls ── */}
        <footer className="flex items-center justify-between px-3 sm:px-5 py-3 bg-card border-t border-border flex-shrink-0">

          {/* User info — desktop */}
          <div className="hidden sm:flex items-center gap-2 min-w-[110px]">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center
              text-primary-foreground text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">You</p>
              <p className="text-[10px] text-muted-foreground">Student</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1">
            <CtrlBtn
              icon={mic ? ICONS.mic : ICONS.micOff}
              label={mic ? "Mute" : "Unmute"}
              active={mic}
              onClick={toggleMic}
            />
            <CtrlBtn
              icon={cam ? ICONS.video : ICONS.videoOff}
              label={cam ? "Stop Cam" : "Start Cam"}
              active={cam}
              onClick={toggleCam}
            />
            <CtrlBtn
              icon={ICONS.share}
              label="Share"
              active={sharing}
              activeColor="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
              onClick={toggleShare}
            />
            <CtrlBtn
              icon={ICONS.hand}
              label={handRaised ? "Lower" : "Raise"}
              active={handRaised}
              activeColor="bg-amber-500/15 text-amber-600 border border-amber-500/30"
              onClick={toggleHand}
            />
            <CtrlBtn
              icon={ICONS.chat}
              label="Chat"
              active={chatOpen}
              onClick={toggleChat}
              badge={!chatOpen ? unread : 0}
            />
            {/* Leave */}
            <button onClick={() => setConfirm(true)} title="Leave"
              className="relative flex flex-col items-center gap-1 group focus:outline-none">
              <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center
                bg-destructive text-white hover:opacity-90 transition-opacity">
                <Icon d={ICONS.phone} size={18} />
              </span>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground hidden sm:block">
                Leave
              </span>
            </button>
          </div>

          {/* Right spacer — desktop */}
          <div className="hidden sm:block min-w-[110px]" />
        </footer>
      </div>

      {confirm && (
        <ConfirmModal
          subject={meetingData.Subject}
          onStay={() => setConfirm(false)}
          onLeave={() => {
            setConfirm(false);
            try { apiRef.current?.dispose(); } catch (_) {}
            onLeave();
          }}
        />
      )}
    </>
  );
}

/* ─── Root Export ────────────────────────────────────────────────────────── */
export default function StudentMeetingPage() {
  const [room, setRoom] = useState(null);

  if (room) {
    return <MeetingRoom meetingData={room} onLeave={() => setRoom(null)} />;
  }
  return <LandingPage onEnterRoom={(meetingData) => setRoom(meetingData)} />;
}
