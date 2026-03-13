const getUserFromToken = () => {
  try {
    const encryptedUser = localStorage.getItem('user')

    if (encryptedUser) {
      const user = decryptData(encryptedUser)

      return {
        id: user?.UserID ?? null,
        name: user?.Username ?? 'User',
        role: (user?.Role ?? 'Student').toLowerCase(),
        linkedId: user?.LinkedID ?? null,
      }
    }

    const token = localStorage.getItem('token')
    if (!token) return null

    const payload = JSON.parse(atob(token.split('.')[1]))

    return {
      id: payload.id ?? payload.UserID ?? payload.userId ?? payload.teacherId ?? null,
      name: payload.name ?? payload.Name ?? payload.username ?? 'User',
      role: (payload.role ?? payload.Role ?? 'Student').toLowerCase(),
    }
  } catch {
    return null
  }
}

import api from '@/api/api'
import { decryptData } from '@/utils/crypto'
import { useState, useEffect, useRef, useCallback } from 'react'

// ─── SVG Icon ─────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 18, cls = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cls}
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)

const ICONS = {
  video:
    'M23 7l-7 5 7 5V7z M1 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  videoOff:
    'M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10 M1 1l22 22',
  mic: 'M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v3 M8 22h8',
  micOff:
    'M1 1l22 22 M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6 M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23 M12 19v3 M8 22h8',
  screen:
    'M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3 M8 21h8 M12 17v4 M22 3l-5 5 M17 3h5v5',
  screenOff: 'M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16 M1 1l22 22',
  hand: 'M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2 M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2 M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8 M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  people: [
    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
    'M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'M23 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  send: 'M22 2L11 13 M22 2L15 22 8 13 2 9z',
  close: 'M18 6L6 18 M6 6l12 12',
  phone:
    'M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07C9.44 16.29 7.62 14.48 6.29 12.37A19.79 19.79 0 0 1 3.22 3.74 2 2 0 0 1 5.21 1.56L8 1.56a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L9 9.48',
  copy: 'M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z',
  check: 'M20 6L9 17l-5-5',
  warn: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
  spin: 'M21 12a9 9 0 1 1-6.219-8.56',
  clock:
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z',
  plus: 'M12 5v14 M5 12h14',
  join: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M15 12H3',
}

// ─── UI atoms ─────────────────────────────────────────────────────────────────
const Field = ({ label, id, error, icon, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label
        htmlFor={id}
        className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
      >
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Ic d={icon} size={15} />
        </span>
      )}
      <input
        id={id}
        className={`w-full bg-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all
          focus:border-primary focus:ring-2 focus:ring-primary/15
          ${icon ? 'pl-9 pr-3.5 py-2.5' : 'px-3.5 py-2.5'}
          ${error ? 'border-destructive' : 'border-border'}`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-[11px] text-destructive flex items-center gap-1">
        <Ic d={ICONS.warn} size={11} />
        {error}
      </p>
    )}
  </div>
)

const Btn = ({
  children,
  loading,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const sz =
    size === 'sm'
      ? 'px-4 py-2 text-xs'
      : size === 'lg'
        ? 'px-6 py-3 text-sm'
        : 'px-5 py-2.5 text-sm'
  const v = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-muted text-foreground border border-border hover:bg-accent',
    destructive: 'bg-destructive text-white hover:opacity-90',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed active:scale-[.98] ${sz} ${v[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <Ic d={ICONS.spin} size={14} cls="animate-spin" />
          Please wait…
        </>
      ) : (
        children
      )}
    </button>
  )
}

const Badge = ({ children, variant = 'primary' }) => {
  const v = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${v[variant]}`}
    >
      {children}
    </span>
  )
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onEnterRoom }) {
  const [cForm, setCForm] = useState({ ClassID: '', SectionID: '', Subject: '' })
  const [cErrors, setCErrors] = useState({})
  const [cLoad, setCLoad] = useState(false)
  const [cResult, setCResult] = useState(null)
  const [cErr, setCErr] = useState('')
  const [copied, setCopied] = useState(false)

  const [jForm, setJForm] = useState({ ClassID: '', SectionID: '' })
  const [meetings, setMeetings] = useState([])
  const [jLoad, setJLoad] = useState(false)
  const [jFetched, setJFetched] = useState(false)
  const [jErr, setJErr] = useState('')

  const setC = (k) => (e) => setCForm((f) => ({ ...f, [k]: e.target.value }))
  const setJ = (k) => (e) => setJForm((f) => ({ ...f, [k]: e.target.value }))

  const validateCreate = () => {
    const e = {}
    if (!cForm.ClassID) e.ClassID = 'Required'
    if (!cForm.SectionID) e.SectionID = 'Required'
    if (!cForm.Subject.trim()) e.Subject = 'Required'
    setCErrors(e)
    return !Object.keys(e).length
  }

  const handleCreate = async () => {
    if (!validateCreate()) return
    const user = getUserFromToken()
    if (!user?.id) {
      setCErr('Could not read TeacherID from token. Please log in again.')
      return
    }
    const teacherId = user.linkedId || user.id
    setCLoad(true)
    setCErr('')
    setCResult(null)
    try {
      const { data } = await api.post('/online-meetings/schedule', {
        ClassID: Number(cForm.ClassID),
        SectionID: Number(cForm.SectionID),
        Subject: cForm.Subject.trim(),
        TeacherID: Number(teacherId),
      })
      if (!data.success) throw new Error(data.message || 'Failed to create')
      setCResult(data.data)
    } catch (err) {
      setCErr(err.message)
    } finally {
      setCLoad(false)
    }
  }

  const handleFetch = async () => {
    if (!jForm.ClassID || !jForm.SectionID) return
    setJLoad(true)
    setJErr('')
    setJFetched(false)
    try {
      const { data } = await api.get(
        `/online-meetings/list/${jForm.ClassID}/${jForm.SectionID}`
      )
      if (!data.success) throw new Error(data.message || 'Failed to fetch')
      setMeetings(data.data)
      setJFetched(true)
    } catch (err) {
      setJErr(err.message)
    } finally {
      setJLoad(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(cResult.MeetingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Ic d={ICONS.video} size={16} />
            </div>
            <span className="font-bold text-foreground text-lg">ClassMeet</span>
          </div>
          <Badge>Powered by Jitsi</Badge>
        </div>
      </header>

      {/* Sub-hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Online Class Portal</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Teachers create a session, students find and join — all in one place.
          </p>
        </div>
      </div>

      {/* Two panels */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── CREATE ── */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 pt-6 pb-5 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <Ic d={ICONS.plus} size={20} />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Create a Meeting</h2>
                <p className="text-xs text-muted-foreground">
                  For teachers — schedule a new class session
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {!cResult ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Class ID"
                      id="c-cid"
                      type="number"
                      placeholder="e.g. 10"
                      value={cForm.ClassID}
                      onChange={setC('ClassID')}
                      error={cErrors.ClassID}
                      icon={ICONS.book}
                    />
                    <Field
                      label="Section ID"
                      id="c-sid"
                      type="number"
                      placeholder="e.g. 3"
                      value={cForm.SectionID}
                      onChange={setC('SectionID')}
                      error={cErrors.SectionID}
                      icon={ICONS.book}
                    />
                  </div>
                  <Field
                    label="Subject"
                    id="c-sub"
                    placeholder="e.g. Mathematics"
                    value={cForm.Subject}
                    onChange={setC('Subject')}
                    error={cErrors.Subject}
                    icon={ICONS.book}
                  />
                  {cErr && (
                    <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      <Ic d={ICONS.warn} size={15} cls="flex-shrink-0 mt-0.5" />
                      {cErr}
                    </div>
                  )}
                  <Btn
                    loading={cLoad}
                    onClick={handleCreate}
                    className="w-full py-3 mt-1"
                    size="lg"
                  >
                    <Ic d={ICONS.plus} size={16} /> Create Meeting
                  </Btn>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    <Ic d={ICONS.check} size={16} cls="flex-shrink-0" /> Meeting created
                    successfully!
                  </div>
                  <div className="bg-muted rounded-xl border border-border divide-y divide-border overflow-hidden">
                    {[
                      ['Subject', cResult.Subject],
                      ['Class', `Class ${cResult.ClassID}`],
                      ['Section', `Section ${cResult.SectionID}`],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between px-4 py-2.5"
                      >
                        <span className="text-xs text-muted-foreground">{k}</span>
                        <span className="text-xs font-semibold text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Meeting Link
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 min-w-0 text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg px-2.5 py-2 truncate">
                        {cResult.MeetingLink}
                      </code>
                      <button
                        onClick={copyLink}
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                        title="Copy"
                      >
                        <Ic d={copied ? ICONS.check : ICONS.copy} size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 mt-1">
                    <Btn
                      variant="secondary"
                      onClick={() => {
                        setCResult(null)
                        setCForm({ ClassID: '', SectionID: '', Subject: '' })
                      }}
                    >
                      New Meeting
                    </Btn>
                    <Btn
                      onClick={() =>
                        onEnterRoom(
                          cResult,
                          getUserFromToken() || {
                            id: null,
                            name: 'Teacher',
                            role: 'teacher',
                          }
                        )
                      }
                    >
                      <Ic d={ICONS.join} size={15} /> Join Now
                    </Btn>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── JOIN ── */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 pt-6 pb-5 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <Ic d={ICONS.join} size={20} />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Join a Meeting</h2>
                <p className="text-xs text-muted-foreground">
                  For students — find and enter your class session
                </p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Class ID"
                  id="j-cid"
                  type="number"
                  placeholder="e.g. 10"
                  value={jForm.ClassID}
                  onChange={setJ('ClassID')}
                  icon={ICONS.book}
                />
                <Field
                  label="Section ID"
                  id="j-sid"
                  type="number"
                  placeholder="e.g. 3"
                  value={jForm.SectionID}
                  onChange={setJ('SectionID')}
                  icon={ICONS.book}
                />
              </div>
              <Btn
                loading={jLoad}
                onClick={handleFetch}
                disabled={!jForm.ClassID || !jForm.SectionID}
                className="w-full py-3"
                size="lg"
              >
                <Ic d={ICONS.video} size={16} /> Find Meetings
              </Btn>
              {jErr && (
                <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <Ic d={ICONS.warn} size={15} cls="flex-shrink-0 mt-0.5" />
                  {jErr}
                </div>
              )}
              {jFetched && meetings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
                  <Ic d={ICONS.video} size={32} cls="opacity-20" />
                  <p className="text-sm">No active meetings found.</p>
                  <p className="text-xs opacity-60">
                    Ask your teacher to start a session.
                  </p>
                </div>
              )}
              {meetings.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Available Sessions
                    </span>
                    <Badge>{meetings.length} found</Badge>
                  </div>
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-0.5">
                    {meetings.map((m) => (
                      <div
                        key={m.MeetingID}
                        className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                          <Ic d={ICONS.video} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {m.Subject}
                          </p>
                          <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                            <Ic d={ICONS.clock} size={11} />
                            <span className="text-[11px]">
                              {new Date(m.MeetingDate).toLocaleString([], {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>
                        </div>
                        <Btn
                          size="sm"
                          onClick={() =>
                            onEnterRoom(
                              m,
                              getUserFromToken() || {
                                id: null,
                                name: 'Student',
                                role: 'student',
                              }
                            )
                          }
                          className="flex-shrink-0"
                        >
                          Join
                        </Btn>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">
          Meetings are powered by{' '}
          <a
            href="https://meet.jit.si"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Jitsi Meet
          </a>{' '}
          — no downloads required.
        </p>
      </div>
    </div>
  )
}

// ─── Chat Panel — wired to Jitsi real messaging ──────────────────────────────
function ChatPanel({ apiRef, currentUser, messages, onNewMsg, onClose }) {
  const [txt, setTxt] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const text = txt.trim()
    if (!text || sending) return
    setSending(true)
    try {
      // Broadcasts to ALL participants via Jitsi XMPP
      apiRef.current?.executeCommand('sendChatMessage', text)
      // Jitsi does NOT echo your own message via incomingMessage, so add manually
      onNewMsg({
        id: Date.now(),
        sender: currentUser.name,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: true,
      })
      setTxt('')
    } catch (e) {
      console.error('Chat send error:', e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="flex flex-col h-full bg-card"
      style={{ animation: 'slideIn .2s ease' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div>
          <p className="font-semibold text-sm text-foreground">In-Session Chat</p>
          <p className="text-xs text-muted-foreground">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted hover:bg-accent text-muted-foreground transition-colors"
        >
          <Ic d={ICONS.close} size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <Ic d={ICONS.chat} size={28} cls="opacity-20" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs opacity-60">Say hello to everyone!</p>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.self ? 'items-end' : 'items-start'}`}
          >
            {!m.self && (
              <span className="text-[11px] font-semibold text-primary mb-0.5 px-1">
                {m.sender}
              </span>
            )}
            {m.isSystem ? (
              <div className="text-[11px] text-muted-foreground italic px-3 py-1.5 bg-muted/50 rounded-xl border border-border">
                {m.text}
              </div>
            ) : (
              <div
                className={`max-w-[86%] px-3 py-2 text-sm leading-snug break-words
                ${m.self ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm' : 'bg-muted text-foreground rounded-2xl rounded-bl-sm'}`}
              >
                {m.text}
              </div>
            )}
            <span className="text-[10px] text-muted-foreground mt-0.5 px-1">
              {m.time}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="px-3 py-3 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 border border-border focus-within:border-primary transition-colors">
          <input
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Message everyone…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={send}
            disabled={!txt.trim() || sending}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all
              ${txt.trim() && !sending ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-border text-muted-foreground opacity-50 cursor-not-allowed'}`}
          >
            <Ic d={ICONS.send} size={13} />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
          Messages are visible to all participants
        </p>
      </div>
    </div>
  )
}

// ─── Participants Panel ───────────────────────────────────────────────────────
function ParticipantsPanel({ participants, onClose }) {
  return (
    <div
      className="flex flex-col h-full bg-card"
      style={{ animation: 'slideIn .2s ease' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div>
          <p className="font-semibold text-sm text-foreground">Participants</p>
          <p className="text-xs text-muted-foreground">{participants.length} in call</p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted hover:bg-accent text-muted-foreground transition-colors"
        >
          <Ic d={ICONS.close} size={13} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <Ic d={ICONS.people} size={32} cls="opacity-20" />
            <p className="text-sm text-center">
              Waiting for participants…
              <br />
              <span className="text-xs opacity-60">List updates as people join.</span>
            </p>
          </div>
        ) : (
          participants.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                {p.displayName?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {p.displayName ?? 'Unknown'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {p.isLocal && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      You
                    </span>
                  )}
                  {p.isModerator && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                      Host
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center ${p.isAudioMuted ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}
                >
                  <Ic d={p.isAudioMuted ? ICONS.micOff : ICONS.mic} size={12} />
                </span>
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center ${p.isVideoMuted ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}
                >
                  <Ic d={p.isVideoMuted ? ICONS.videoOff : ICONS.video} size={12} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Control Button ───────────────────────────────────────────────────────────
function CtrlBtn({
  icon,
  label,
  active = true,
  danger = false,
  onClick,
  badge = 0,
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="relative flex flex-col items-center gap-1 group focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span
        className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
        ${
          danger
            ? 'bg-destructive text-white hover:opacity-90'
            : active
              ? 'bg-primary/15 text-primary border border-primary/40 hover:bg-primary/25'
              : 'bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        <Ic d={icon} size={18} />
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] rounded-full px-[3px] text-[9px] font-bold flex items-center justify-center bg-primary text-primary-foreground leading-none">
            {badge}
          </span>
        )}
      </span>
      <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </button>
  )
}

// ─── Meeting Room (Jitsi IFrame API wired controls) ───────────────────────────
function MeetingRoom({ meetingData, currentUser, onLeave }) {
  const containerRef = useRef(null) // div that Jitsi mounts into
  const apiRef = useRef(null) // JitsiMeetExternalAPI instance
  const panelRef = useRef(null) // mirrors panel state for use inside event closures

  // Mirror of real Jitsi state — updated by API events
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [shareOn, setShareOn] = useState(false)
  const [handUp, setHandUp] = useState(false)
  const [ready, setReady] = useState(false) // API loaded
  const [secs, setSecs] = useState(0)
  const [panel, setPanel] = useState(null) // 'chat' | 'people' | null
  const [unread, setUnread] = useState(0)
  const [confirm, setConfirm] = useState(false)
  const [participants, setParticipants] = useState([])
  // Shared chat messages — populated by Jitsi incomingMessage + local sends
  const [chatMessages, setChatMessages] = useState([
    {
      id: 0,
      sender: 'System',
      text: 'Session started — messages are shared with everyone.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: false,
      isSystem: true,
    },
  ])

  // Extract room name from the full Jitsi link
  // e.g. https://meet.jit.si/Math_Class10_Sec3_abc → "Math_Class10_Sec3_abc"
  const roomName = meetingData.MeetingName ?? meetingData.MeetingLink?.split('/').pop()

  // ── Load Jitsi IFrame API script then init ──────────────────────────────────
  useEffect(() => {
    let api = null

    const initJitsi = () => {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) return

      api = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: containerRef.current,
        width: '100%',
        height: '100%',
        userInfo: {
          displayName: currentUser.name,
        },
        configOverwrite: {
          prejoinPageEnabled: false, // skip pre-join screen
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          enableWelcomePage: false,
          toolbarButtons: [], // hide ALL of Jitsi's toolbar
          // ─── Disable Jitsi's built-in chat entirely ───
          // We use our own sidebar chat wired via incomingMessage / sendChatMessage
          disableChat: true,
          hideConferenceSubject: true,
          hideConferenceTimer: true,
          disableInviteFunctions: true,
          enableNoisyMicDetection: false,
          disablePolls: true,
          disableReactions: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          DEFAULT_BACKGROUND: '#0d0d1a',
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          HIDE_INVITE_MORE_HEADER: true,
          CHAT_ENABLED: false, // prevents Jitsi chat panel from showing
        },
      })

      apiRef.current = api

      // ── Event listeners that sync our UI state with real Jitsi state ────────

      api.on('videoConferenceJoined', () => {
        setReady(true)
        refreshParticipants(api)

        // Belt-and-suspenders: inject CSS into the Jitsi iframe to hide
        // any native chat widget / notification that might still appear
        try {
          const iframe = containerRef.current?.querySelector('iframe')
          if (iframe?.contentDocument) {
            const style = iframe.contentDocument.createElement('style')
            style.textContent = `
              /* Hide Jitsi's native chat panel & floating chat button */
              [class*="chat-panel"],
              [class*="ChatPanel"],
              [data-testid="chat-panel"],
              [class*="message-input"],
              [class*="MessageInput"],
              #chatconversations,
              .chatRoom,
              .chat-room,
              .chat-container,
              [class*="new-messages-button"],
              [class*="unread-messages"] { display: none !important; }
            `
            iframe.contentDocument.head.appendChild(style)
          }
        } catch {
          // cross-origin restriction — config flags above are sufficient
        }
      })

      // Mic: fired when local audio mute state changes
      api.on('audioMuteStatusChanged', ({ muted }) => {
        setMicOn(!muted)
      })

      // Camera: fired when local video mute state changes
      api.on('videoMuteStatusChanged', ({ muted }) => {
        setCamOn(!muted)
      })

      // Screen share
      api.on('screenSharingStatusChanged', ({ on }) => {
        setShareOn(on)
      })

      // Raise hand — Jitsi fires this for local user too
      api.on('raiseHandUpdated', ({ handRaised, id }) => {
        // id === undefined means it's the local participant on older Jitsi versions
        const localId = api.getParticipantsInfo()?.find((p) => p.isLocal)?.participantId
        if (!id || id === localId) setHandUp(handRaised)
      })

      // Participant list changes
      api.on('participantJoined', () => refreshParticipants(api))
      api.on('participantLeft', () => refreshParticipants(api))
      api.on('displayNameChange', () => refreshParticipants(api))
      api.on('audioMuteStatusChanged', () => refreshParticipants(api))
      api.on('videoMuteStatusChanged', () => refreshParticipants(api))

      // Incoming chat messages from other participants
      api.on('incomingMessage', ({ from, nick, message, privateMessage }) => {
        if (privateMessage) return // skip private messages
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            sender: nick || from || 'Participant',
            text: message,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            self: false,
          },
        ])
        // bump unread badge if chat panel is closed
        if (panelRef.current !== 'chat') setUnread((u) => u + 1)
      })

      // Meeting ended from inside Jitsi (e.g. host ends for all)
      api.on('readyToClose', () => {
        onLeave()
      })
    }

    // If already loaded (hot reload etc.)
    if (window.JitsiMeetExternalAPI) {
      initJitsi()
    } else {
      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.async = true
      script.onload = initJitsi
      document.head.appendChild(script)
    }

    return () => {
      if (api) {
        try {
          api.dispose()
        } catch {}
      }
    }
  }, [roomName])

  // ── Live timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (s) =>
    `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const refreshParticipants = (api) => {
    try {
      const info = api.getParticipantsInfo() ?? []
      setParticipants(
        info.map((p) => ({
          id: p.participantId,
          displayName: p.displayName,
          isLocal: p.isLocal ?? false,
          isModerator: p.role === 'moderator',
          isAudioMuted: p.isAudioMuted ?? false,
          isVideoMuted: p.isVideoMuted ?? false,
        }))
      )
    } catch {}
  }

  // ── Control handlers — call real Jitsi API commands ─────────────────────────

  const toggleMic = () => {
    apiRef.current?.executeCommand('toggleAudio')
    // state is updated by audioMuteStatusChanged event above
  }

  const toggleCam = () => {
    apiRef.current?.executeCommand('toggleVideo')
    // state is updated by videoMuteStatusChanged event above
  }

  const toggleScreenShare = () => {
    apiRef.current?.executeCommand('toggleShareScreen')
    // state is updated by screenSharingStatusChanged event above
  }

  const toggleHand = () => {
    apiRef.current?.executeCommand('toggleRaiseHand')
    // state is updated by raiseHandUpdated event above
  }

  const addChatMessage = (msg) => setChatMessages((prev) => [...prev, msg])

  const openPanel = (p) => {
    const next = panelRef.current === p ? null : p
    panelRef.current = next
    if (p === 'chat') setUnread(0)
    setPanel(next)
  }

  const hangUp = () => {
    apiRef.current?.executeCommand('hangup')
    onLeave()
  }

  const initials = currentUser.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
        @keyframes blink   { 0%,100% { opacity:1; } 50% { opacity:.35; } }
      `}</style>

      <div
        className="flex flex-col bg-background text-foreground"
        style={{ height: '100vh' }}
      >
        {/* ── Top bar ── */}
        <header className="flex items-center justify-between px-5 py-2.5 bg-card border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Ic d={ICONS.video} size={14} />
              </div>
              <span className="font-bold text-foreground text-sm hidden sm:block">
                ClassMeet
              </span>
            </div>
            <div className="w-px h-5 bg-border hidden sm:block" />
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">
                {meetingData.Subject}
              </p>
              <p className="text-xs text-muted-foreground">
                Class {meetingData.ClassID} · Section {meetingData.SectionID}
              </p>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium">
              <span
                className="w-1.5 h-1.5 rounded-full bg-destructive"
                style={{ animation: 'blink 2s infinite' }}
              />
              LIVE · {fmt(secs)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!ready && (
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Ic d={ICONS.spin} size={13} cls="animate-spin" /> Connecting…
              </span>
            )}
            <span className="hidden md:block text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
              {meetingData.MeetingName}
            </span>
          </div>
        </header>

        {/* ── Body: Jitsi + side panel ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Jitsi mounts here — NOT an iframe src, the API injects the iframe */}
          <main ref={containerRef} className="flex-1 bg-black min-w-0" />

          {/* Side panel */}
          {panel === 'chat' && (
            <aside className="w-72 flex flex-col border-l border-border flex-shrink-0 overflow-hidden">
              <ChatPanel
                apiRef={apiRef}
                currentUser={currentUser}
                messages={chatMessages}
                onNewMsg={addChatMessage}
                onClose={() => openPanel('chat')}
              />
            </aside>
          )}
          {panel === 'people' && (
            <aside className="w-72 flex flex-col border-l border-border flex-shrink-0 overflow-hidden">
              <ParticipantsPanel
                participants={participants}
                onClose={() => setPanel(null)}
              />
            </aside>
          )}
        </div>

        {/* ── Controls bar ── */}
        <footer className="flex items-center justify-between px-5 py-3 bg-card border-t border-border flex-shrink-0">
          {/* Self info */}
          <div className="hidden sm:flex items-center gap-2 w-40">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Microphone — toggles real Jitsi audio */}
            <CtrlBtn
              icon={micOn ? ICONS.mic : ICONS.micOff}
              label={micOn ? 'Mute' : 'Unmute'}
              active={micOn}
              disabled={!ready}
              onClick={toggleMic}
            />

            {/* Camera — toggles real Jitsi video */}
            <CtrlBtn
              icon={camOn ? ICONS.video : ICONS.videoOff}
              label={camOn ? 'Stop Video' : 'Start Video'}
              active={camOn}
              disabled={!ready}
              onClick={toggleCam}
            />

            {/* Screen Share — toggles real Jitsi screen share */}
            <CtrlBtn
              icon={shareOn ? ICONS.screen : ICONS.screenOff}
              label={shareOn ? 'Stop Share' : 'Share Screen'}
              active={shareOn}
              disabled={!ready}
              onClick={toggleScreenShare}
            />

            {/* Raise Hand — toggles real Jitsi raise hand */}
            <CtrlBtn
              icon={ICONS.hand}
              label={handUp ? 'Lower Hand' : 'Raise Hand'}
              active={handUp}
              disabled={!ready}
              onClick={toggleHand}
            />

            {/* Leave */}
            <button
              onClick={() => setConfirm(true)}
              className="flex flex-col items-center gap-1 group focus:outline-none"
              title="Leave"
            >
              <span className="w-12 h-11 rounded-xl flex items-center justify-center bg-destructive text-white hover:opacity-90 transition-opacity">
                <Ic d={ICONS.phone} size={19} />
              </span>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground">
                Leave
              </span>
            </button>
          </div>

          {/* Right: chat & participants */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 w-40 justify-end">
            <CtrlBtn
              icon={ICONS.chat}
              label="Chat"
              active={panel === 'chat'}
              onClick={() => openPanel('chat')}
              badge={panel !== 'chat' ? unread : 0}
            />
            <CtrlBtn
              icon={ICONS.people}
              label="People"
              active={panel === 'people'}
              onClick={() => openPanel('people')}
              badge={participants.length > 0 ? participants.length : 0}
            />
          </div>
        </footer>

        {/* Leave confirmation */}
        {confirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          >
            <div className="bg-card border border-border rounded-2xl p-7 max-w-sm w-full mx-4 text-center shadow-2xl">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-destructive/10 border border-destructive/25 text-destructive">
                <Ic d={ICONS.phone} size={26} />
              </div>
              <p className="font-semibold text-lg text-foreground mb-1">Leave session?</p>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                You'll be disconnected from{' '}
                <strong className="text-foreground">{meetingData.Subject}</strong>.
              </p>
              <div className="flex gap-2.5">
                <Btn
                  variant="secondary"
                  onClick={() => setConfirm(false)}
                  className="flex-1"
                >
                  Stay
                </Btn>
                <Btn variant="destructive" onClick={hangUp} className="flex-1">
                  Leave
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MeetingPage() {
  const [room, setRoom] = useState(null)

  if (room) {
    return (
      <MeetingRoom
        meetingData={room.meetingData}
        currentUser={room.currentUser}
        onLeave={() => setRoom(null)}
      />
    )
  }

  return (
    <LandingPage
      onEnterRoom={(meetingData, currentUser) => setRoom({ meetingData, currentUser })}
    />
  )
}
