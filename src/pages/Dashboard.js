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

const DEMO_STUDENTS = [
  { id: 1, name: "Aisha N.", av: "AN", col: "#6c5ce7", prog: 78, grade: "A", active: "2h ago" },
  { id: 2, name: "Damir S.", av: "DS", col: "#00b894", prog: 62, grade: "B+", active: "1h ago" },
  { id: 3, name: "Zarina B.", av: "ZB", col: "#fd79a8", prog: 91, grade: "A+", active: "5m ago" },
  { id: 4, name: "Ruslan A.", av: "RA", col: "#0984e3", prog: 44, grade: "C+", active: "3d ago" },
  { id: 5, name: "Madina O.", av: "MO", col: "#fdcb6e", prog: 28, grade: "D", active: "1w ago" },
];

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

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/);
  return match ? match[1] : null;
}

function VideoModal({ lesson, onClose, onComplete }) {
  const ytId = getYouTubeId(lesson.video_url);
  return (
    <Modal onClose={onClose} title={lesson.title}>
      <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "16/9", marginBottom: 16, background: "#000" }}>
        {ytId ? (
          <iframe
            width="100%" height="100%"
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: "block" }}
          />
        ) : (
          <div style={{ background: "linear-gradient(135deg,#1a1f3a,#2d3561)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 52 }}>🎬</div>
            <div style={{ color: "#ffffff88", fontSize: 13 }}>{lesson.video_url ? "Invalid YouTube URL" : "No video URL provided"}</div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ color: T.text2, fontSize: 13 }}>{lesson.duration || ""}</span>
        <button onClick={() => { onComplete && onComplete(); onClose(); }} style={{ marginLeft: "auto", background: T.green, border: "none", borderRadius: 10, color: "#fff", padding: "7px 16px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700 }}>✓ Mark Complete</button>
        <button onClick={onClose} style={{ background: T.bg3, border: `1.5px solid ${T.border}`, borderRadius: 10, color: T.text2, padding: "7px 16px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 600 }}>Close</button>
      </div>
    </Modal>
  );
}

function QuizModal({ lesson, onClose, onComplete }) {
  const formUrl = lesson.video_url || lesson.form_url || "";
  if (!formUrl) {
    return (
      <Modal onClose={onClose} title={lesson.title}>
        <div style={{ textAlign: "center", padding: 20, color: T.text3 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div>No test link added yet.</div>
        </div>
      </Modal>
    );
  }
  return (
    <Modal onClose={onClose} title={lesson.title}>
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>📋</div>
        <div style={{ color: T.text2, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
          Click the button below to open the test in a new tab. Come back here when you are done!
        </div>
        <a href={formUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: T.purple, color: "#fff", borderRadius: 12, padding: "12px 28px", fontWeight: 800, fontSize: 15, textDecoration: "none", marginBottom: 16 }}>
          📝 Open Test
        </a>
        <div style={{ marginTop: 16 }}>
          <button onClick={() => { onComplete && onComplete(100); onClose(); }} style={{ background: T.green, border: "none", borderRadius: 10, color: "#fff", padding: "9px 20px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13 }}>
            ✓ Mark as Completed
          </button>
        </div>
      </div>
    </Modal>
  );
}

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

function CourseNavTab({ isInstructor, onOpenLesson }) {
  const [modules, setModules] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/modules").then(r => { setModules(r.data); setLoading(false); });
  }, []);

  const toggleModule = async (mod) => {
    const isOpen = expanded[mod.id];
    setExpanded(e => ({ ...e, [mod.id]: !isOpen }));
    if (!isOpen && !lessons[mod.id]) {
      const r = await api.get(`/modules/${mod.id}/lessons`);
      setLessons(l => ({ ...l, [mod.id]: r.data }));
    }
  };

  if (loading) return <div style={{ color: T.text3, padding: 20 }}>Loading...</div>;

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18, color: T.text, marginBottom: 20, backgroundImage: "url('https://i.pinimg.com/1200x/d4/19/6b/d4196b7fa6226f1aad81a757dd09faae.jpg')", backgroundSize: "cover", backgroundPosition: "center", borderRadius: 16, padding: "40px 24px", color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>📚 Course Structure</div>
      {modules.map((mod, mi) => (
        <div key={mod.id} style={{ marginBottom: 8 }}>
          <div onClick={() => toggleModule(mod)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: expanded[mod.id] ? mod.color + "15" : T.bg1, border: `2px solid ${expanded[mod.id] ? mod.color + "44" : T.border}`, borderRadius: expanded[mod.id] ? "14px 14px 0 0" : 14, cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: mod.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: mod.color, flexShrink: 0 }}>{mod.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: T.text }}>{mod.title}</div>
              <div style={{ color: T.text3, fontSize: 12 }}>{mod.lesson_count} lessons · {mod.progress || 0}% done</div>
            </div>
            <span style={{ color: mod.color, fontSize: 18, transition: "transform 0.2s", display: "inline-block", transform: expanded[mod.id] ? "rotate(90deg)" : "none" }}>›</span>
          </div>
          {expanded[mod.id] && (
            <div style={{ border: `2px solid ${mod.color}44`, borderTop: "none", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
              {(lessons[mod.id] || []).map((lesson, li) => (
                <div key={lesson.id} onClick={() => lesson.type !== "reading" && onOpenLesson(lesson, mod)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px 11px 32px", background: lesson.done ? T.green + "08" : T.bg2, borderTop: `1px solid ${T.border}`, cursor: lesson.type !== "reading" ? "pointer" : "default" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: lesson.done ? T.green + "22" : T.bg3, border: `2px solid ${lesson.done ? T.green : T.border2}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: lesson.done ? T.green : T.text3, fontWeight: 800, flexShrink: 0 }}>
                    {lesson.done ? "✓" : li + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{lesson.title}</div>
                    <div style={{ fontSize: 11, color: T.text3 }}>
                      {lesson.type === "video" ? "▶ Video" : lesson.type === "quiz" ? "📋 Test" : lesson.type === "assignment" ? "↑ Assignment" : "◎ Reading"}
                      {lesson.duration && ` · ${lesson.duration}`}
                    </div>
                  </div>
                  {!lesson.done && lesson.type !== "reading" && <span style={{ color: T.text3, fontSize: 14 }}>›</span>}
                </div>
              ))}
              {(lessons[mod.id] || []).length === 0 && (
                <div style={{ padding: "16px 32px", color: T.text3, fontSize: 13 }}>No lessons yet.</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ModulesTab({ isInstructor }) {
  const [modules, setModules] = useState([]);
  const [openMod, setOpenMod] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
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
    let deadline = null;
    if (lesForm.deadline) {
      const d = new Date(lesForm.deadline);
      if (!isNaN(d.getTime())) deadline = d.toISOString().split('T')[0];
    }
    const r = await api.post(`/modules/${openMod.id}/lessons`, {
      title: lesForm.title, type: lesForm.type || "video",
      video_url: lesForm.url, duration: lesForm.dur,
      pages: lesForm.pages, deadline, order_index: lessons.length
    });
    setLessons(ls => [...ls, { ...r.data, done: false, questions: [] }]);
    setLesForm({}); setAddingLesson(false);
  };

  if (loading) return <div style={{ color: T.text3, padding: 20 }}>Loading modules...</div>;

  if (openMod) return (
    <div>
      {activeLesson?.type === "video" && <VideoModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={() => markDone(activeLesson.id)} />}
      {activeLesson?.type === "quiz" && <QuizModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={score => markDone(activeLesson.id, score)} />}
      {activeLesson?.type === "assignment" && <UploadModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={() => markDone(activeLesson.id)} />}
      {addingLesson && (
        <Modal onClose={() => setAddingLesson(false)} title="Add Lesson">
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Type</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["video", "quiz", "assignment", "reading"].map(t => (
                <button key={t} onClick={() => setLesForm(f => ({ ...f, type: t }))} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `2px solid ${lesForm.type === t ? T.purple : T.border}`, background: lesForm.type === t ? T.purple + "18" : T.bg2, cursor: "pointer", fontSize: 11, fontWeight: 700, color: lesForm.type === t ? T.purple : T.text3, fontFamily: "'Nunito',sans-serif" }}>
                  {t === "video" ? "▶ Video" : t === "quiz" ? "📋 Test" : t === "assignment" ? "↑ Task" : "◎ Reading"}
                </button>
              ))}
            </div>
          </div>
          {[
            ["title", "Lesson Title", "e.g. Introduction"],
            ["dur", "Duration", "e.g. 12:30"],
            ["deadline", "Deadline", "YYYY-MM-DD (e.g. 2025-06-30)"],
            ["url", lesForm.type === "quiz" ? "Google Form URL" : "Video URL", lesForm.type === "quiz" ? "https://forms.google.com/..." : "https://youtube.com/..."]
          ].map(([k, l, p]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{l}</div>
              <input value={lesForm[k] || ""} onChange={e => setLesForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} style={{ width: "100%", background: T.bg2, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 14, outline: "none", fontFamily: "'Nunito',sans-serif", boxSizing: "border-box" }} />
            </div>
          ))}
          <Btn onClick={saveLesson} color={T.green}>Save Lesson</Btn>
        </Modal>
      )}
      <button onClick={() => setOpenMod(null)} style={{ background: "none", border: "none", color: T.purple, cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: 20, padding: 0, fontFamily: "'Nunito',sans-serif" }}>← All Modules</button>
      <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 20, background: `linear-gradient(135deg,${openMod.color},${openMod.color}88)`, padding: "28px 24px", color: "#fff" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{openMod.icon}</div>
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 4 }}>{openMod.title}</div>
        <div style={{ opacity: 0.8, fontSize: 14, marginBottom: 16 }}>{openMod.description}</div>
        <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, height: 8, marginBottom: 8 }}>
          <div style={{ height: "100%", width: `${openMod.progress || 0}%`, background: "#fff", borderRadius: 99 }} />
        </div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>{openMod.progress || 0}% complete</div>
      </div>
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
              <Chip label={lesson.type === "quiz" ? "📋 Test" : lesson.type} color={openMod.color} />
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

  const COLORS = ["#6c5ce7", "#00b894", "#fd79a8", "#0984e3", "#fdcb6e", "#e17055", "#00cec9"];
  const EMOJIS = ["📚", "🎯", "🚀", "⭐", "🔮", "🌿", "🏆", "🛠️", "💡", "🎓"];
  return (
    <div>
      {addingMod && (
        <Modal onClose={() => setAddingMod(false)} title="New Module">
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
          <Btn onClick={saveModule} color={T.green}>Create Module</Btn>
        </Modal>
      )}
      {isInstructor && <div style={{ marginBottom: 20 }}><Btn onClick={() => setAddingMod(true)}>+ New Module</Btn></div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
        {modules.map(m => (
          <Card key={m.id} onClick={() => openModule(m)} style={{ padding: 0, overflow: "hidden", border: `2px solid ${m.color}22` }}>
            <div style={{ height: 80, background: `linear-gradient(135deg,${m.color},${m.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
              {m.icon}
            </div>
            <div style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "flex-start" }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: T.text, flex: 1 }}>{m.title}</div>
                <Chip label={`${m.progress || 0}%`} color={m.color} />
              </div>
              <div style={{ color: T.text2, fontSize: 12, marginBottom: 12 }}>{m.description}</div>
              <Bar val={m.progress} color={m.color} h={6} />
              <div style={{ color: T.text3, fontSize: 11, marginTop: 8 }}>{m.lesson_count} lessons</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

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
        <span style={{ color: T.text2, fontSize: 13, fontWeight: 600 }}>Group Chat</span>
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
      <div style={{ marginTop: 24, borderRadius: 16, overflow: "hidden" }}>
  <img src="https://i.pinimg.com/1200x/52/f6/55/52f655d1ffc9d68776b690165dbf2355.jpg" alt="motivation" style={{ width: "100%", borderRadius: 16, display: "block" }} />
</div>
    </div>
  );
}

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
      <div style={{ background: `linear-gradient(135deg,${T.purple},#5a4fd4)`, borderRadius: 22, padding: "32px", marginBottom: 22, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.8, marginBottom: 6 }}>Welcome back! 👋</div>
        <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 4 }}>LearnFlow</div>
        <div style={{ opacity: 0.8, fontSize: 14, marginBottom: 20 }}>Your learning journey starts here 🚀</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.2)", borderRadius: 99, height: 10 }}>
            <div style={{ height: "100%", width: `${overall}%`, background: "#fff", borderRadius: 99, transition: "width 0.5s" }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>{overall}%</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[{ label: "Modules", value: modules.length, color: T.purple, emoji: "📚" }, { label: "Completed", value: modules.filter(m => m.progress === 100).length, color: T.green, emoji: "✅" }, { label: "In Progress", value: modules.filter(m => m.progress > 0 && m.progress < 100).length, color: T.amber, emoji: "🔥" }].map(s => (
          <Card key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.emoji}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ color: T.text3, fontSize: 12, fontWeight: 600 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <div style={{ fontWeight: 800, fontSize: 16, color: T.text, marginBottom: 14 }}>📊 My Modules</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 24 }}>
        {modules.map(m => (
          <Card key={m.id} style={{ padding: 0, overflow: "hidden", border: `2px solid ${m.color}22` }}>
            <div style={{ height: 60, background: `linear-gradient(135deg,${m.color},${m.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{m.icon}</div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: T.text, marginBottom: 8 }}>{m.title?.split(":")[0]}</div>
              <Bar val={m.progress} color={m.color} h={5} />
              <div style={{ color: T.text3, fontSize: 11, marginTop: 6 }}>{m.progress || 0}%</div>
            </div>
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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLessonGlobal, setActiveLessonGlobal] = useState(null);
  const [activeLessonMod, setActiveLessonMod] = useState(null);
  const isInstructor = user?.role === "instructor";

  const NAV = [
    { id: "home", icon: "⊞", label: "Dashboard" },
    { id: "course", icon: "🗂", label: "Course Navigation" },
    { id: "modules", icon: "◈", label: "My Modules" },
    { id: "chat", icon: "💬", label: "Chat" },
    { id: "forum", icon: "◆", label: "Forum" },
    ...(isInstructor ? [{ id: "students", icon: "👥", label: "Students" }] : []),
  ];

  const TITLES = { home: "Dashboard", course: "Course Navigation", modules: "My Modules", chat: "Group Chat", forum: "Forum", students: "Students" };

  const handleOpenLesson = (lesson, mod) => {
    setActiveLessonGlobal(lesson);
    setActiveLessonMod(mod);
  };

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
        <div style={{ width: sidebarOpen ? 230 : 68, background: T.bg1, borderRight: `2px solid ${T.border}`, display: "flex", flexDirection: "column", transition: "width .28s ease", overflow: "hidden", flexShrink: 0, boxShadow: "4px 0 20px rgba(108,92,231,0.06)" }}>
          <div style={{ padding: "20px 14px", borderBottom: `2px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg,${T.purple},${T.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎓</div>
            {sidebarOpen && <span style={{ fontWeight: 900, fontSize: 17, color: T.text, whiteSpace: "nowrap" }}>LearnFlow</span>}
            <button onClick={() => setSidebarOpen(o => !o)} style={{ marginLeft: "auto", background: T.bg3, border: `1.5px solid ${T.border}`, borderRadius: 8, color: T.text3, cursor: "pointer", width: 28, height: 28, flexShrink: 0, fontSize: 13 }}>
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>
          <nav style={{ padding: "12px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderRadius: 14, border: tab === n.id ? `1.5px solid ${T.purple}22` : "1.5px solid transparent", cursor: "pointer", background: tab === n.id ? T.purple + "15" : "transparent", color: tab === n.id ? T.purple : T.text3, fontSize: 13, fontWeight: tab === n.id ? 800 : 600, transition: "all .15s", whiteSpace: "nowrap", overflow: "hidden", textAlign: "left", width: "100%", fontFamily: "'Nunito',sans-serif" }}>
                <span style={{ fontSize: 17, flexShrink: 0 }}>{n.icon}</span>
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 28px", background: T.bg1, borderBottom: `2px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 2px 12px rgba(108,92,231,0.06)" }}>
            <div style={{ fontWeight: 900, fontSize: 20, color: T.text }}>{TITLES[tab]}</div>
            <Chip label={isInstructor ? "👨‍🏫 Instructor" : "🎓 Student"} color={isInstructor ? T.amber : T.blue} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 28, animation: "fadeUp .25s ease" }} key={tab}>
            {activeLessonGlobal?.type === "video" && (
              <VideoModal lesson={activeLessonGlobal} onClose={() => setActiveLessonGlobal(null)} onComplete={() => setActiveLessonGlobal(null)} />
            )}
            {activeLessonGlobal?.type === "quiz" && (
              <QuizModal lesson={activeLessonGlobal} onClose={() => setActiveLessonGlobal(null)} onComplete={() => setActiveLessonGlobal(null)} />
            )}
            {tab === "home" && <HomeTab />}
            {tab === "course" && <CourseNavTab isInstructor={isInstructor} onOpenLesson={handleOpenLesson} />}
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