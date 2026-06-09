import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const T = {
  bg: "#f0f4ff", bg1: "#ffffff", bg2: "#f7f9ff", bg3: "#eef1fb",
  border: "#e2e8ff", border2: "#c8d2f5",
  text: "#1a1f3a", text2: "#4a5080", text3: "#8890b8",
  purple: "#6c5ce7", purpleL: "#a29bfe",
  pink: "#fd79a8", green: "#00b894", amber: "#fdcb6e",
  red: "#e17055", blue: "#0984e3", teal: "#00cec9",
};

const SECTIONS = [
  { id: 1, title: "Beginner", emoji: "🌱", color: "#00b894" },
  { id: 2, title: "Intermediate", emoji: "🚀", color: "#6c5ce7" },
  { id: 3, title: "Advanced", emoji: "⚡", color: "#fd79a8" },
];

const DEMO_STUDENTS = [
  { id: 1, name: "Aisha N.", av: "AN", col: "#6c5ce7", prog: 78, grade: "A", active: "2h ago" },
  { id: 2, name: "Damir S.", av: "DS", col: "#00b894", prog: 62, grade: "B+", active: "1h ago" },
  { id: 3, name: "Zarina B.", av: "ZB", col: "#fd79a8", prog: 91, grade: "A+", active: "5m ago" },
  { id: 4, name: "Ruslan A.", av: "RA", col: "#0984e3", prog: 44, grade: "C+", active: "3d ago" },
  { id: 5, name: "Madina O.", av: "MO", col: "#fdcb6e", prog: 28, grade: "D", active: "1w ago" },
];

let CHAT_MSGS = [
  { id: 1, author: "Instructor", av: "IN", col: T.purple, msg: "Welcome everyone! 🎉 Ask anything here anytime!", self: false, time: "09:00" },
  { id: 2, author: "Zarina B.", av: "ZB", col: T.pink, msg: "Thank you! Really enjoying the course 😊", self: false, time: "09:12" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Av({ name, color, size = 34 }) {
  const ini = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 800, color, flexShrink: 0 }}>
      {ini}
    </div>
  );
}

function Bar({ val, color, h = 6 }) {
  return (
    <div style={{ height: h, background: T.bg3, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, val || 0)}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
    </div>
  );
}

function Chip({ label, color }) {
  return <span style={{ background: color + "18", color, border: `1.5px solid ${color}33`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{label}</span>;
}

function Card({ children, style, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: T.bg1, border: `1.5px solid ${hov && onClick ? T.border2 : T.border}`, borderRadius: 18, padding: "20px 22px", boxShadow: hov && onClick ? "0 8px 32px rgba(108,92,231,0.15)" : "0 4px 24px rgba(108,92,231,0.08)", transition: "all 0.2s", cursor: onClick ? "pointer" : "default", transform: hov && onClick ? "translateY(-2px)" : "none", ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, color = T.purple, outline, small, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: outline ? "transparent" : color, border: `2px solid ${color}`, borderRadius: small ? 8 : 12, padding: small ? "5px 12px" : "10px 20px", color: outline ? color : "#fff", fontWeight: 700, fontSize: small ? 12 : 14, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.15s", fontFamily: "'Nunito', sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}>
      {children}
    </button>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#1a1f3a55", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.bg1, borderRadius: 24, width: "min(560px,95vw)", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(108,92,231,0.2)" }}>
        {title && (
          <div style={{ padding: "20px 24px", borderBottom: `1.5px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: T.text }}>{title}</div>
            <button onClick={onClose} style={{ background: T.bg3, border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, color: T.text3 }}>✕</button>
          </div>
        )}
        <div style={{ padding: 24, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── VIDEO MODAL ──────────────────────────────────────────────────────────────
function VideoModal({ lesson, onClose, onComplete }) {
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const iv = useRef(null);
  const toggle = () => {
    if (playing) { clearInterval(iv.current); setPlaying(false); }
    else {
      setPlaying(true);
      iv.current = setInterval(() => setProg(p => {
        if (p >= 100) { clearInterval(iv.current); setPlaying(false); onComplete && onComplete(); return 100; }
        return p + 0.4;
      }), 300);
    }
  };
  useEffect(() => () => clearInterval(iv.current), []);
  return (
    <Modal onClose={onClose} title={lesson.title}>
      <div style={{ background: "linear-gradient(135deg,#1a1f3a,#2d3561)", borderRadius: 14, aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 52 }}>🎬</div>
        <div style={{ color: "#ffffff88", fontSize: 13 }}>{lesson.title}</div>
      </div>
      <div style={{ height: 6, background: T.bg3, borderRadius: 99, cursor: "pointer", marginBottom: 14 }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProg(((e.clientX - r.left) / r.width) * 100); }}>
        <div style={{ height: "100%", width: `${prog}%`, background: `linear-gradient(90deg,${T.purple},${T.pink})`, borderRadius: 99 }} />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={toggle} style={{ background: `linear-gradient(135deg,${T.purple},${T.pink})`, border: "none", borderRadius: "50%", width: 42, height: 42, color: "#fff", fontSize: 14, cursor: "pointer" }}>
          {playing ? "⏸" : "▶"}
        </button>
        <span style={{ color: T.text2, fontSize: 13 }}>{lesson.duration || "00:00"}</span>
        <button onClick={onClose} style={{ marginLeft: "auto", background: T.bg3, border: `1.5px solid ${T.border}`, borderRadius: 10, color: T.text2, padding: "7px 16px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}>Close</button>
      </div>
    </Modal>
  );
}

// ─── QUIZ MODAL ───────────────────────────────────────────────────────────────
function QuizModal({ lesson, onClose, onComplete }) {
  const qs = lesson.questions || [];
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  if (qs.length === 0) return <Modal onClose={onClose} title="Quiz"><div style={{ textAlign: "center", padding: 20, color: T.text3 }}>No questions added yet!</div></Modal>;
  const q = qs[cur];
  const opts = Array.isArray(q.options) ? q.options : JSON.parse(q.options || "[]");
  const score = Math.round(Object.entries(answers).filter(([i, a]) => qs[i]?.correct_index === a).length / qs.length * 100);
  if (done) {
    onComplete && onComplete(score);
    return (
      <Modal onClose={onClose} title={lesson.title}>
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>{score >= 70 ? "🎉" : "📚"}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: score >= 70 ? T.green : T.amber, marginBottom: 8 }}>{score}%</div>
          <div style={{ color: T.text2, marginBottom: 24 }}>{score >= 70 ? "Passed! Great work!" : "Keep studying!"}</div>
          <Btn onClick={onClose}>Done</Btn>
        </div>
      </Modal>
    );
  }
  const pick = (i) => {
    if (answers[cur] !== undefined) return;
    setAnswers(a => ({ ...a, [cur]: i }));
    setTimeout(() => { if (cur < qs.length - 1) setCur(c => c + 1); else setDone(true); }, 700);
  };
  return (
    <Modal onClose={onClose} title={lesson.title}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <Chip label={`Q ${cur + 1} / ${qs.length}`} color={T.purple} />
      </div>
      <Bar val={(cur / qs.length) * 100} color={T.purple} h={8} />
      <div style={{ color: T.text, fontSize: 17, fontWeight: 700, margin: "18px 0 14px", lineHeight: 1.5 }}>{q.question}</div>
      {opts.map((opt, i) => {
        const sel = answers[cur] === i;
        const correct = answers[cur] !== undefined && i === q.correct_index;
        const wrong = sel && i !== q.correct_index;
        return (
          <button key={i} onClick={() => pick(i)} style={{ width: "100%", background: correct ? T.green + "18" : wrong ? T.red + "18" : sel ? T.purple + "18" : T.bg2, border: `2px solid ${correct ? T.green : wrong ? T.red : sel ? T.purple : T.border}`, borderRadius: 12, padding: "12px 16px", color: correct ? T.green : wrong ? T.red : sel ? T.purple : T.text2, textAlign: "left", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 8, fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}>
            <span style={{ opacity: 0.5, marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>{opt}
          </button>
        );
      })}
    </Modal>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
function UploadModal({ lesson, onClose, onComplete }) {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef();
  const addF = (fs) => setFiles(p => [...p, ...[...fs].map(f => ({ file: f, name: f.name, size: (f.size / 1024).toFixed(0) + " KB" }))]);
  const submit = async () => {
    setUploading(true);
    try {
      const form = new FormData();
      files.forEach(f => form.append("files", f.file));
      await api.post(`/upload/${lesson.id}`, form, { headers: { "Content-Type": "multipart/form-data" } });
      setDone(true); onComplete && onComplete();
    } catch { alert("Upload failed."); }
    finally { setUploading(false); }
  };
  return (
    <Modal onClose={onClose} title={lesson.title}>
      {done ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
          <div style={{ color: T.green, fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Submitted!</div>
          <Btn onClick={onClose}>Close</Btn>
        </div>
      ) : (
        <>
          {lesson.deadline && <div style={{ color: T.amber, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>⏰ Due: {lesson.deadline}</div>}
          <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); addF(e.dataTransfer.files); }}
            onClick={() => ref.current.click()}
            style={{ border: `2px dashed ${drag ? T.purple : T.border2}`, borderRadius: 16, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: drag ? T.purple + "08" : T.bg2, marginBottom: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📎</div>
            <div style={{ color: T.text2, fontSize: 14 }}>Drop files or <span style={{ color: T.purple, fontWeight: 700 }}>browse</span></div>
            <input ref={ref} type="file" multiple style={{ display: "none" }} onChange={e => addF(e.target.files)} />
          </div>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", background: T.bg2, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 14px", marginBottom: 6 }}>
              <span style={{ color: T.text2, fontSize: 13 }}>📄 {f.name}</span>
              <span style={{ color: T.text3, fontSize: 12 }}>{f.size}</span>
            </div>
          ))}
          {files.length > 0 && <Btn onClick={submit} color={T.green} disabled={uploading}>{uploading ? "Uploading..." : `Submit ${files.length} file(s) ↑`}</Btn>}
        </>
      )}
    </Modal>
  );
}

// ─── MODULES TAB ──────────────────────────────────────────────────────────────
function ModulesTab({ isInstructor }) {
  const [modules, setModules] = useState([]);
  const [openMod, setOpenMod] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  // Instructor add states
  const [addingMod, setAddingMod] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [modForm, setModForm] = useState({});
  const [lesForm, setLesForm] = useState({});

  useEffect(() => { api.get("/modules").then(r => { setModules(r.data); setLoading(false); }); }, []);

  const openModule = async (mod) => {
    setOpenMod(mod);
    const r = await api.get(`/modules/${mod.id}/lessons`);
    setLessons(r.data);
  };

  const markDone = async (lessonId, score) => {
    await api.post(`/modules/progress/${lessonId}`, { score });
    setLessons(ls => ls.map(l => l.id === lessonId ? { ...l, done: true, score } : l));
  };

  const saveModule = async () => {
    if (!modForm.title) return;
    const r = await api.post("/modules", { title: modForm.title, description: modForm.desc, color: modForm.color || T.purple, icon: modForm.emoji || "M", status: "published" });
    setModules(m => [...m, { ...r.data, progress: 0, lesson_count: 0 }]);
    setModForm({}); setAddingMod(false);
  };

  const saveLesson = async () => {
    if (!lesForm.title || !openMod) return;
    const r = await api.post(`/modules/${openMod.id}/lessons`, { title: lesForm.title, type: lesForm.type || "video", video_url: lesForm.url, duration: lesForm.dur, pages: lesForm.pages, deadline: lesForm.deadline, order_index: lessons.length });
    setLessons(ls => [...ls, { ...r.data, done: false, questions: [] }]);
    setLesForm({}); setAddingLesson(false);
  };

  if (loading) return <div style={{ color: T.text3, padding: 20 }}>Loading modules...</div>;

  // Module detail view
  if (openMod) return (
    <div>
      {activeLesson?.type === "video" && <VideoModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={() => markDone(activeLesson.id)} />}
      {activeLesson?.type === "quiz" && <QuizModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={score => markDone(activeLesson.id, score)} />}
      {activeLesson?.type === "assignment" && <UploadModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={() => markDone(activeLesson.id)} />}
      {addingLesson && (
        <Modal onClose={() => setAddingLesson(false)} title="➕ Add Lesson">
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Type</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["video", "quiz", "assignment", "reading"].map(t => (
                <button key={t} onClick={() => setLesForm(f => ({ ...f, type: t }))} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `2px solid ${lesForm.type === t ? T.purple : T.border}`, background: lesForm.type === t ? T.purple + "18" : T.bg2, cursor: "pointer", fontSize: 11, fontWeight: 700, color: lesForm.type === t ? T.purple : T.text3, fontFamily: "'Nunito',sans-serif" }}>
                  {t === "video" ? "▶ Video" : t === "quiz" ? "✦ Quiz" : t === "assignment" ? "↑ Task" : "◎ Reading"}
                </button>
              ))}
            </div>
          </div>
          {[["title", "Lesson Title", "e.g. Introduction"], ["dur", "Duration", "e.g. 12:30"], ["deadline", "Deadline", "e.g. June 30"], ["url", "Video URL", "https://youtube.com/..."]].map(([k, l, p]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{l}</div>
              <input value={lesForm[k] || ""} onChange={e => setLesForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} style={{ width: "100%", background: T.bg2, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 14, outline: "none", fontFamily: "'Nunito',sans-serif", boxSizing: "border-box" }} />
            </div>
          ))}
          <Btn onClick={saveLesson} color={T.green}>✓ Save Lesson</Btn>
        </Modal>
      )}
      <button onClick={() => setOpenMod(null)} style={{ background: "none", border: "none", color: T.purple, cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: 20, padding: 0, fontFamily: "'Nunito',sans-serif" }}>← All Modules</button>
      <Card style={{ marginBottom: 20, background: `linear-gradient(135deg,${openMod.color}12,${T.bg1})`, border: `2px solid ${openMod.color}33` }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: openMod.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: openMod.color }}>{openMod.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: T.text, marginBottom: 3 }}>{openMod.title}</div>
            <div style={{ color: T.text2, fontSize: 13 }}>{openMod.description}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: openMod.color }}>{openMod.progress || 0}%</div>
            <div style={{ color: T.text3, fontSize: 11 }}>complete</div>
          </div>
        </div>
        <Bar val={openMod.progress} color={openMod.color} h={8} />
      </Card>
      {isInstructor && <div style={{ marginBottom: 14 }}><Btn onClick={() => setAddingLesson(true)} color={openMod.color}>+ Add Lesson</Btn></div>}
      {lessons.map((lesson, i) => (
        <Card key={lesson.id} style={{ marginBottom: 10, display: "flex", gap: 14, alignItems: "center", opacity: lesson.done ? 0.8 : 1, cursor: lesson.type !== "reading" ? "pointer" : "default" }}
          onClick={() => lesson.type !== "reading" && setActiveLesson(lesson)}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: lesson.done ? T.green + "22" : T.bg3, border: `2px solid ${lesson.done ? T.green : T.border2}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: lesson.done ? T.green : T.text3, fontWeight: 800, flexShrink: 0 }}>
            {lesson.done ? "✓" : i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 4 }}>{lesson.title}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Chip label={lesson.type} color={openMod.color} />
              {lesson.duration && <span style={{ color: T.text3, fontSize: 11 }}>⏱ {lesson.duration}</span>}
              {lesson.deadline && <span style={{ color: T.amber, fontSize: 11 }}>⏰ {lesson.deadline}</span>}
              {lesson.score != null && <span style={{ color: T.green, fontSize: 11 }}>Score: {lesson.score}%</span>}
            </div>
          </div>
          {!lesson.done && lesson.type !== "reading" && <span style={{ color: T.text3, fontSize: 18 }}>›</span>}
        </Card>
      ))}
      {lessons.length === 0 && <Card style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 40, marginBottom: 12 }}>📭</div><div style={{ color: T.text3 }}>No lessons yet{isInstructor ? " — add your first one!" : ". Check back soon!"}</div></Card>}
    </div>
  );

  // Modules list grouped by section
  const COLORS = ["#6c5ce7", "#00b894", "#fd79a8", "#0984e3", "#fdcb6e", "#e17055", "#00cec9"];
  const EMOJIS = ["📚", "🎯", "🚀", "⭐", "🔮", "🌿", "🏆", "🛠️", "💡", "🎓"];
  return (
    <div>
      {addingMod && (
        <Modal onClose={() => setAddingMod(false)} title="✨ New Module">
          {[["title", "Module Title", "e.g. Module 1: Foundations"], ["desc", "Description", "Brief description..."]].map(([k, l, p]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{l}</div>
              <input value={modForm[k] || ""} onChange={e => setModForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} style={{ width: "100%", background: T.bg2, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 14, outline: "none", fontFamily: "'Nunito',sans-serif", boxSizing: "border-box" }} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Color</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COLORS.map(c => <button key={c} onClick={() => setModForm(f => ({ ...f, color: c }))} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: modForm.color === c ? `3px solid ${T.text}` : "3px solid transparent", cursor: "pointer" }} />)}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Icon</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {EMOJIS.map(e => <button key={e} onClick={() => setModForm(f => ({ ...f, emoji: e }))} style={{ width: 38, height: 38, borderRadius: 10, border: `2px solid ${modForm.emoji === e ? T.purple : T.border}`, background: modForm.emoji === e ? T.purple + "18" : T.bg2, cursor: "pointer", fontSize: 18 }}>{e}</button>)}
            </div>
          </div>
          <Btn onClick={saveModule} color={T.green}>✓ Create Module</Btn>
        </Modal>
      )}
      {isInstructor && <div style={{ marginBottom: 20 }}><Btn onClick={() => setAddingMod(true)}>+ New Module</Btn></div>}
      {SECTIONS.map(sec => {
        const secMods = modules.filter((_, i) => (i % 3) === sec.id - 1);
        const allMods = sec.id === 1 ? modules.slice(0, Math.ceil(modules.length / 2)) : sec.id === 2 ? modules.slice(Math.ceil(modules.length / 2)) : [];
        const show = modules.length > 0 ? (sec.id === 1 ? modules.filter((_, i) => i % 3 === 0) : sec.id === 2 ? modules.filter((_, i) => i % 3 === 1) : modules.filter((_, i) => i % 3 === 2)) : [];
        return (
          <div key={sec.id} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 16px", background: sec.color + "12", border: `1.5px solid ${sec.color}33`, borderRadius: 14 }}>
              <span style={{ fontSize: 20 }}>{sec.emoji}</span>
              <div style={{ fontWeight: 800, fontSize: 14, color: sec.color }}>{sec.title}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
              {show.map(m => (
                <Card key={m.id} onClick={() => openModule(m)} style={{ background: `linear-gradient(135deg,${m.color}10,${T.bg1})`, border: `2px solid ${m.color}22` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: m.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: m.color }}>{m.icon}</div>
                    <Chip label={`${m.progress || 0}%`} color={m.color} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: T.text, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ color: T.text2, fontSize: 12, marginBottom: 12 }}>{m.description}</div>
                  <Bar val={m.progress} color={m.color} h={6} />
                  <div style={{ color: T.text3, fontSize: 11, marginTop: 8 }}>{m.lesson_count} lessons</div>
                </Card>
              ))}
              {show.length === 0 && <div style={{ color: T.text3, fontSize: 13, padding: "8px 0" }}>No modules here yet.</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CHAT TAB ─────────────────────────────────────────────────────────────────
function ChatTab({ user }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const ref = useRef();
  useEffect(() => {
    api.get("/chat").then(r => setMsgs(r.data));
    const iv = setInterval(() => api.get("/chat").then(r => setMsgs(r.data)), 5000);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => ref.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);
  const send = async () => {
    if (!input.trim()) return;
    const msg = input; setInput("");
    const r = await api.post("/chat", { message: msg });
    setMsgs(m => [...m, r.data]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 14, borderBottom: `2px solid ${T.border}`, marginBottom: 14 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
        <span style={{ color: T.text2, fontSize: 13, fontWeight: 600 }}>Group Chat · 50 members</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map(m => {
          const self = m.user_id === user?.id;
          return (
            <div key={m.id} style={{ display: "flex", gap: 10, flexDirection: self ? "row-reverse" : "row" }}>
              <Av name={m.author_name || "?"} color={m.avatar_color || T.purple} size={32} />
              <div style={{ maxWidth: "72%" }}>
                {!self && <div style={{ color: T.text3, fontSize: 11, fontWeight: 600, marginBottom: 3 }}>{m.author_name}</div>}
                <div style={{ background: self ? T.purple : T.bg2, color: self ? "#fff" : T.text, border: self ? "none" : `1.5px solid ${T.border}`, borderRadius: self ? "18px 4px 18px 18px" : "4px 18px 18px 18px", padding: "10px 14px", fontSize: 14, lineHeight: 1.55 }}>{m.message}</div>
                <div style={{ color: T.text3, fontSize: 10, marginTop: 3, textAlign: self ? "right" : "left" }}>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            </div>
          );
        })}
        <div ref={ref} />
      </div>
      <div style={{ display: "flex", gap: 10, paddingTop: 14, borderTop: `2px solid ${T.border}`, marginTop: 14 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message..." style={{ flex: 1, background: T.bg2, border: `2px solid ${T.border}`, borderRadius: 14, padding: "11px 16px", color: T.text, fontSize: 14, outline: "none", fontFamily: "'Nunito',sans-serif" }} />
        <button onClick={send} style={{ background: T.purple, border: "none", borderRadius: 14, width: 44, height: 44, color: "#fff", cursor: "pointer", fontSize: 18 }}>↑</button>
      </div>
    </div>
  );
}

// ─── FORUM TAB ────────────────────────────────────────────────────────────────
function ForumTab({ user }) {
  const [posts, setPosts] = useState([]);
  const [composing, setComposing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  useEffect(() => { api.get("/forum").then(r => setPosts(r.data)); }, []);
  const submit = async () => {
    if (!newTitle.trim()) return;
    const r = await api.post("/forum", { title: newTitle, body: newBody });
    setPosts(p => [r.data, ...p]);
    setNewTitle(""); setNewBody(""); setComposing(false);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: T.text }}>💬 Discussion Forum</div>
        <Btn onClick={() => setComposing(c => !c)} small>+ New Post</Btn>
      </div>
      {composing && (
        <Card style={{ marginBottom: 16 }}>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Post title..." style={{ width: "100%", background: T.bg2, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 14, outline: "none", marginBottom: 10, fontFamily: "'Nunito',sans-serif", boxSizing: "border-box" }} />
          <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Write your message..." rows={3} style={{ width: "100%", background: T.bg2, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "'Nunito',sans-serif", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Btn onClick={submit} color={T.green} small>Post</Btn>
            <Btn onClick={() => setComposing(false)} color={T.text3} outline small>Cancel</Btn>
          </div>
        </Card>
      )}
      {posts.map(p => (
        <Card key={p.id} style={{ marginBottom: 10, border: p.pinned ? `2px solid ${T.purple}44` : undefined }}>
          {p.pinned && <div style={{ color: T.purple, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>📌 Pinned</div>}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <Av name={p.author_name} color={p.avatar_color || T.purple} size={32} />
            <div>
              <span style={{ color: T.text2, fontSize: 13, fontWeight: 600 }}>{p.author_name}</span>
              <span style={{ color: T.text3, fontSize: 11, marginLeft: 8 }}>{new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 6 }}>{p.title}</div>
          <div style={{ color: T.text2, fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{p.body}</div>
          <div style={{ color: T.text3, fontSize: 12 }}>💬 {p.reply_count} replies</div>
        </Card>
      ))}
    </div>
  );
}

// ─── STUDENTS TAB ─────────────────────────────────────────────────────────────
function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/students").then(r => { setStudents(r.data); setLoading(false); }).catch(() => { setStudents(DEMO_STUDENTS); setLoading(false); }); }, []);
  if (loading) return <div style={{ color: T.text3 }}>Loading...</div>;
  return (
    <div>
      <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>👥 {students.length} students enrolled</div>
      {students.map((s, i) => (
        <Card key={s.id || i} style={{ marginBottom: 10, display: "flex", gap: 14, alignItems: "center" }}>
          <Av name={s.name || s.av} color={s.avatar_color || s.col} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 2 }}>{s.name}</div>
            <div style={{ color: T.text3, fontSize: 12 }}>{s.email || `Last active ${s.active}`}</div>
          </div>
          <div style={{ minWidth: 120 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ color: T.text3, fontSize: 11 }}>Progress</span>
              <span style={{ color: T.text2, fontSize: 11, fontWeight: 700 }}>{s.overall || s.prog || 0}%</span>
            </div>
            <Bar val={s.overall || s.prog} color={s.avatar_color || s.col} h={5} />
          </div>
          {s.grade && <Chip label={s.grade} color={s.grade?.startsWith("A") ? T.green : s.grade?.startsWith("B") ? T.blue : T.amber} />}
        </Card>
      ))}
    </div>
  );
}

// ─── HOME TAB ─────────────────────────────────────────────────────────────────
function HomeTab() {
  const [modules, setModules] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    api.get("/modules").then(r => setModules(r.data));
    api.get("/announcements").then(r => setAnnouncements(r.data));
  }, []);
  const overall = modules.length ? Math.round(modules.reduce((a, m) => a + (m.progress || 0), 0) / modules.length) : 0;
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg,${T.purple}20,${T.pink}10)`, border: `2px solid ${T.purple}22`, borderRadius: 22, padding: "28px 32px", marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: T.purple, fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Welcome back! 👋</div>
          <div style={{ fontWeight: 900, fontSize: 24, color: T.text, marginBottom: 4 }}>LearnFlow Dashboard</div>
          <div style={{ color: T.text2, fontSize: 14 }}>Your learning journey starts here 🚀</div>
        </div>
        <div style={{ textAlign: "center", background: T.bg1, borderRadius: 20, padding: "16px 24px", boxShadow: "0 4px 24px rgba(108,92,231,0.1)" }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: T.purple }}>{overall}%</div>
          <div style={{ color: T.text3, fontSize: 12, fontWeight: 600 }}>avg progress</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[{ label: "Students", value: "50", color: T.purple, emoji: "👥" }, { label: "Active Today", value: "18", color: T.green, emoji: "🟢" }, { label: "Avg Grade", value: "B+", color: T.amber, emoji: "⭐" }].map(s => (
          <Card key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.emoji}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ color: T.text3, fontSize: 12, fontWeight: 600 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <div style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 14 }}>📊 Modules</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 24 }}>
        {modules.map(m => (
          <Card key={m.id} style={{ background: `linear-gradient(135deg,${m.color}10,${T.bg1})`, border: `2px solid ${m.color}22` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{m.icon}</span>
              <Chip label={`${m.progress || 0}%`} color={m.color} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: T.text, marginBottom: 8 }}>{m.title?.split(":")[0]}</div>
            <Bar val={m.progress} color={m.color} h={5} />
          </Card>
        ))}
      </div>
      <div style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 14 }}>📣 Announcements</div>
      {announcements.map(a => (
        <Card key={a.id} style={{ marginBottom: 10, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 22 }}>{a.type === "info" ? "ℹ️" : a.type === "event" ? "📅" : "🆕"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 3 }}>{a.title}</div>
            <div style={{ color: T.text2, fontSize: 13 }}>{a.body}</div>
          </div>
          <div style={{ color: T.text3, fontSize: 11 }}>{new Date(a.created_at).toLocaleDateString()}</div>
        </Card>
      ))}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isInstructor = user?.role === "instructor";

  const NAV = [
    { id: "home", icon: "⊞", label: "Dashboard" },
    { id: "modules", icon: "◈", label: "My Modules" },
    { id: "chat", icon: "💬", label: "Chat" },
    { id: "forum", icon: "◆", label: "Forum" },
    ...(isInstructor ? [{ id: "students", icon: "👥", label: "Students" }] : []),
  ];

  const TITLES = { home: "Dashboard", modules: "Modules", chat: "Group Chat", forum: "Forum", students: "Students" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: #c8d2f5 transparent; }
        html,body { background: #f0f4ff; font-family: 'Nunito', sans-serif; }
        input::placeholder, textarea::placeholder { color: #8890b8; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      <div style={{ display: "flex", height: "100vh", background: T.bg }}>
        {/* SIDEBAR */}
        <div style={{ width: sidebarOpen ? 220 : 68, background: T.bg1, borderRight: `2px solid ${T.border}`, display: "flex", flexDirection: "column", transition: "width .28s ease", overflow: "hidden", flexShrink: 0, boxShadow: "4px 0 20px rgba(108,92,231,0.06)" }}>
          <div style={{ padding: "20px 14px", borderBottom: `2px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg,${T.purple},${T.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎓</div>
            {sidebarOpen && <span style={{ fontWeight: 900, fontSize: 17, color: T.text, whiteSpace: "nowrap" }}>LearnFlow</span>}
            <button onClick={() => setSidebarOpen(o => !o)} style={{ marginLeft: "auto", background: T.bg3, border: `1.5px solid ${T.border}`, borderRadius: 8, color: T.text3, cursor: "pointer", width: 28, height: 28, flexShrink: 0, fontSize: 13 }}>
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>
          <nav style={{ padding: "12px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderRadius: 14, border: tab === n.id ? `1.5px solid ${T.purple}22` : "1.5px solid transparent", cursor: "pointer", background: tab === n.id ? T.purple + "15" : "transparent", color: tab === n.id ? T.purple : T.text3, fontSize: 14, fontWeight: tab === n.id ? 800 : 600, transition: "all .15s", whiteSpace: "nowrap", overflow: "hidden", textAlign: "left", width: "100%", fontFamily: "'Nunito',sans-serif" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                {sidebarOpen && n.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "14px 10px", borderTop: `2px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
            <Av name={user?.name || "User"} color={user?.avatar_color || T.purple} size={34} />
            {sidebarOpen && (
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ color: T.text, fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                <div style={{ color: T.green, fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>● {user?.role}</div>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={logout} title="Logout" style={{ background: T.red + "18", border: `1.5px solid ${T.red}33`, borderRadius: 8, color: T.red, cursor: "pointer", width: 30, height: 30, fontSize: 14, flexShrink: 0 }}>⏻</button>
            )}
          </div>
        </div>
        {/* MAIN */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 28px", background: T.bg1, borderBottom: `2px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 2px 12px rgba(108,92,231,0.06)" }}>
            <div style={{ fontWeight: 900, fontSize: 20, color: T.text }}>{TITLES[tab]}</div>
            <Chip label={isInstructor ? "👨‍🏫 Instructor" : "🎓 Student"} color={isInstructor ? T.amber : T.blue} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 28, animation: "fadeUp .25s ease" }} key={tab}>
            {tab === "home" && <HomeTab />}
            {tab === "modules" && <ModulesTab isInstructor={isInstructor} />}
            {tab === "chat" && <ChatTab user={user} />}
            {tab === "forum" && <ForumTab user={user} />}
            {tab === "students" && isInstructor && <StudentsTab />}
          </div>
        </div>
      </div>
    </>
  );
}
