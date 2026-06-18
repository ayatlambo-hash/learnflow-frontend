
cat > /home/claude/Dashboard.js << 'ENDOFFILE'
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const T = {
  bg: "#f5f7fa", bg1: "#ffffff", bg2: "#f8fafc", bg3: "#eef2f7",
  border: "#e2e8f0", border2: "#cbd5e1",
  text: "#1e293b", text2: "#475569", text3: "#94a3b8",
  primary: "#2563eb", primaryL: "#3b82f6",
  green: "#16a34a", amber: "#d97706",
  red: "#dc2626", blue: "#2563eb", teal: "#0891b2",
};

const DEMO_STUDENTS = [
  { id: 1, name: "Aisha N.", av: "AN", col: "#2563eb", prog: 78, grade: "A", active: "2h ago" },
  { id: 2, name: "Damir S.", av: "DS", col: "#16a34a", prog: 62, grade: "B+", active: "1h ago" },
  { id: 3, name: "Zarina B.", av: "ZB", col: "#0891b2", prog: 91, grade: "A+", active: "5m ago" },
  { id: 4, name: "Ruslan A.", av: "RA", col: "#7c3aed", prog: 44, grade: "C+", active: "3d ago" },
  { id: 5, name: "Madina O.", av: "MO", col: "#d97706", prog: 28, grade: "D", active: "1w ago" },
];

function Av({ name, color, size = 34 }) {
  const ini = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "18", border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color, flexShrink: 0 }}>
      {ini}
    </div>
  );
}

function Bar({ val, color = T.primary, h = 6 }) {
  return (
    <div style={{ height: h, background: T.bg3, borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, val || 0)}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
    </div>
  );
}

function Chip({ label, color }) {
  return <span style={{ background: color + "14", color, border: `1px solid ${color}33`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{label}</span>;
}

function Card({ children, style, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: T.bg1, border: `1px solid ${hov && onClick ? T.border2 : T.border}`, borderRadius: 12, padding: "18px 20px", boxShadow: hov && onClick ? "0 4px 20px rgba(37,99,235,0.1)" : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s", cursor: onClick ? "pointer" : "default", transform: hov && onClick ? "translateY(-1px)" : "none", ...style }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, color = T.primary, outline, small, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: outline ? "transparent" : color, border: `1.5px solid ${color}`, borderRadius: small ? 6 : 8, padding: small ? "5px 12px" : "9px 18px", color: outline ? color : "#fff", fontWeight: 600, fontSize: small ? 12 : 13, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, transition: "all 0.15s", fontFamily: "'Inter', sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}>
      {children}
    </button>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.bg1, borderRadius: 16, width: "min(580px,95vw)", maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        {title && (
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bg2 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: T.text }}>{title}</div>
            <button onClick={onClose} style={{ background: T.bg3, border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 14, color: T.text3 }}>✕</button>
          </div>
        )}
        <div style={{ padding: 22, overflowY: "auto" }}>{children}</div>
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
      <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9", marginBottom: 16, background: "#000" }}>
        {ytId ? (
          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} title={lesson.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: "block" }} />
        ) : (
          <div style={{ background: "#1e293b", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 40 }}>📖</div>
            <div style={{ color: "#94a3b8", fontSize: 13 }}>{lesson.video_url ? "Invalid YouTube URL" : "No video URL provided"}</div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: T.text3, fontSize: 13 }}>{lesson.duration || ""}</span>
        <button onClick={() => { onComplete && onComplete(); onClose(); }} style={{ marginLeft: "auto", background: T.green, border: "none", borderRadius: 8, color: "#fff", padding: "8px 18px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13 }}>✓ Mark Complete</button>
        <button onClick={onClose} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text2, padding: "8px 16px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13 }}>Close</button>
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
          <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
          <div>No test link added yet.</div>
        </div>
      </Modal>
    );
  }
  return (
    <Modal onClose={onClose} title={lesson.title}>
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📖</div>
        <div style={{ color: T.text2, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Click the button below to open the test in a new tab.</div>
        <a href={formUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: T.primary, color: "#fff", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: 14, textDecoration: "none", marginBottom: 16 }}>Open Test →</a>
        <div style={{ marginTop: 16 }}>
          <button onClick={() => { onComplete && onComplete(100); onClose(); }} style={{ background: T.green, border: "none", borderRadius: 8, color: "#fff", padding: "8px 18px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13 }}>✓ Mark as Completed</button>
        </div>
      </div>
    </Modal>
  );
}

function UploadModal({ lesson, onClose, onComplete }) {
  const [files, setFiles] = useState([]);
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
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ color: T.green, fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Submitted!</div>
          <Btn onClick={onClose}>Close</Btn>
        </div>
      ) : (
        <>
          <div onClick={() => ref.current.click()} style={{ border: `2px dashed ${T.border2}`, borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: T.bg2, marginBottom: 14 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
            <div style={{ color: T.text2, fontSize: 13 }}>Drop files or <span style={{ color: T.primary, fontWeight: 600 }}>browse</span></div>
            <input ref={ref} type="file" multiple style={{ display: "none" }} onChange={e => addF(e.target.files)} />
          </div>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
              <span style={{ color: T.text2, fontSize: 13 }}>📄 {f.name}</span>
              <span style={{ color: T.text3, fontSize: 12 }}>{f.size}</span>
            </div>
          ))}
          {files.length > 0 && <Btn onClick={submit} color={T.green} disabled={uploading}>{uploading ? "Uploading..." : `Submit ${files.length} file(s)`}</Btn>}
        </>
      )}
    </Modal>
  );
}

function CourseNavSectionModal({ mod, isInstructor, onClose }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [lessons, setLessons] = useState([]);
  const ref = useRef();

  useEffect(() => {
    api.get(`/modules/${mod.id}/lessons`).then(r => setLessons(r.data));
  }, [mod.id]);

  const addF = (fs) => setFiles(p => [...p, ...[...fs].map(f => ({ file: f, name: f.name, size: (f.size / 1024).toFixed(0) + " KB" }))]);

  const submit = async () => {
    setUploading(true);
    try {
      let lessonId;
      if (lessons.length === 0) {
        const r = await api.post(`/modules/${mod.id}/lessons`, { title: mod.title, type: "assignment", order_index: 0 });
        lessonId = r.data.id;
      } else {
        lessonId = lessons[0].id;
      }
      const form = new FormData();
      files.forEach(f => form.append("files", f.file));
      await api.post(`/upload/${lessonId}`, form, { headers: { "Content-Type": "multipart/form-data" } });
      setDone(true);
    } catch (e) { alert("Upload failed: " + e.message); }
    finally { setUploading(false); }
  };

  return (
    <Modal onClose={onClose} title={mod.title}>
      {isInstructor ? (
        done ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ color: T.green, fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Files uploaded!</div>
            <Btn onClick={onClose}>Close</Btn>
          </div>
        ) : (
          <>
            <div style={{ color: T.text2, fontSize: 13, marginBottom: 16 }}>Upload materials for this section. Students will be able to view them.</div>
            <div onClick={() => ref.current.click()} style={{ border: `2px dashed ${T.border2}`, borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: T.bg2, marginBottom: 14 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
              <div style={{ color: T.text2, fontSize: 13 }}>Drop files or <span style={{ color: T.primary, fontWeight: 600 }}>browse</span></div>
              <input ref={ref} type="file" multiple style={{ display: "none" }} onChange={e => addF(e.target.files)} />
            </div>
            {files.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
                <span style={{ color: T.text2, fontSize: 13 }}>📄 {f.name}</span>
                <span style={{ color: T.text3, fontSize: 12 }}>{f.size}</span>
              </div>
            ))}
            {files.length > 0 && <Btn onClick={submit} color={T.green} disabled={uploading}>{uploading ? "Uploading..." : `Upload ${files.length} file(s)`}</Btn>}
          </>
        )
      ) : (
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div style={{ color: T.text2, fontSize: 14 }}>Materials for this section will appear here once uploaded by the instructor.</div>
          <div style={{ marginTop: 20 }}><Btn onClick={onClose}>Close</Btn></div>
        </div>
      )}
    </Modal>
  );
}

function CourseNavTab({ isInstructor }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    api.get("/modules/coursenav").then(r => { setModules(r.data); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: T.text3, padding: 20 }}>Loading...</div>;

  return (
    <div>
      {activeSection && (
        <CourseNavSectionModal mod={activeSection} isInstructor={isInstructor} onClose={() => setActiveSection(null)} />
      )}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "28px 24px", marginBottom: 20, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Course Materials</div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Course Structure</div>
        <div style={{ opacity: 0.75, fontSize: 13 }}>Select a section to view or upload materials</div>
      </div>
      {modules.map((mod, idx) => (
        <div key={mod.id} onClick={() => setActiveSection(mod)}
          style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 8, cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#93c5fd"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.bg1; e.currentTarget.style.borderColor = T.border; }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: T.primary }}>📖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{mod.title}</div>
            <div style={{ color: T.text3, fontSize: 12, marginTop: 2 }}>{isInstructor ? "Click to upload materials" : "Click to view materials"}</div>
          </div>
          <span style={{ color: T.text3, fontSize: 16 }}>›</span>
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
  const [activeLessonIdx, setActiveLessonIdx] = useState(null);
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

  const openLesson = (lesson, idx) => {
    setActiveLesson(lesson);
    setActiveLessonIdx(idx);
  };

  const goNext = () => {
    const nextIdx = activeLessonIdx + 1;
    if (nextIdx < lessons.length) {
      setActiveLesson(lessons[nextIdx]);
      setActiveLessonIdx(nextIdx);
    } else {
      setActiveLesson(null);
      setActiveLessonIdx(null);
    }
  };

  const saveModule = async () => {
    if (!modForm.title) return;
    const r = await api.post("/modules", { title: modForm.title, description: modForm.desc, color: modForm.color || T.primary, icon: "📖", status: "published" });
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

  if (openMod) {
    const videoCount = lessons.filter(l => l.type === "video").length;
    const quizCount = lessons.filter(l => l.type === "quiz").length;
    const assignCount = lessons.filter(l => l.type === "assignment").length;
    const readingCount = lessons.filter(l => l.type === "reading").length;
    const totalDone = lessons.filter(l => l.done).length;
    const completion = lessons.length > 0 ? Math.round((totalDone / lessons.length) * 100) : 0;

    return (
      <div>
        {activeLesson?.type === "video" && (
          <Modal onClose={() => setActiveLesson(null)} title={activeLesson.title}>
            <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9", marginBottom: 16, background: "#000" }}>
              {getYouTubeId(activeLesson.video_url) ? (
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.video_url)}?autoplay=1`} title={activeLesson.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: "block" }} />
              ) : (
                <div style={{ background: "#1e293b", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ color: "#94a3b8", fontSize: 13 }}>No video URL</div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => { markDone(activeLesson.id); }} style={{ background: T.green, border: "none", borderRadius: 8, color: "#fff", padding: "8px 16px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13 }}>✓ Mark Complete</button>
              <button onClick={() => setActiveLesson(null)} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text2, padding: "8px 14px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13 }}>Close</button>
              {activeLessonIdx < lessons.length - 1 && (
                <button onClick={goNext} style={{ marginLeft: "auto", background: T.primary, border: "none", borderRadius: 8, color: "#fff", padding: "8px 18px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13 }}>Next Activity →</button>
              )}
            </div>
          </Modal>
        )}
        {activeLesson?.type === "quiz" && <QuizModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={score => { markDone(activeLesson.id, score); goNext(); }} />}
        {activeLesson?.type === "assignment" && <UploadModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={() => markDone(activeLesson.id)} />}
        {addingLesson && (
          <Modal onClose={() => setAddingLesson(false)} title="Add Lesson">
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Type</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["video", "quiz", "assignment", "reading"].map(t => (
                  <button key={t} onClick={() => setLesForm(f => ({ ...f, type: t }))} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1.5px solid ${lesForm.type === t ? T.primary : T.border}`, background: lesForm.type === t ? "#eff6ff" : T.bg2, cursor: "pointer", fontSize: 11, fontWeight: 600, color: lesForm.type === t ? T.primary : T.text3, fontFamily: "'Inter',sans-serif" }}>
                    {t === "video" ? "Video" : t === "quiz" ? "Quiz" : t === "assignment" ? "Task" : "Reading"}
                  </button>
                ))}
              </div>
            </div>
            {[
              ["title", "Lesson Title", "e.g. Introduction"],
              ["dur", "Duration", "e.g. 12:30"],
              ["deadline", "Deadline", "YYYY-MM-DD"],
              ["url", lesForm.type === "quiz" ? "Google Form URL" : "Video URL", lesForm.type === "quiz" ? "https://forms.google.com/..." : "https://youtube.com/..."]
            ].map(([k, l, p]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{l}</div>
                <input value={lesForm[k] || ""} onChange={e => setLesForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
              </div>
            ))}
            <Btn onClick={saveLesson} color={T.green}>Save Lesson</Btn>
          </Modal>
        )}

        <button onClick={() => setOpenMod(null)} style={{ background: "none", border: "none", color: T.primary, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0, fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", gap: 4 }}>← All Modules</button>

        {/* Module Header */}
        <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "24px", marginBottom: 20, color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{openMod.title}</div>
              <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 14 }}>{openMod.description}</div>
              {/* Progress */}
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "10px 14px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, opacity: 0.9 }}>Course completion</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{completion}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${completion}%`, background: "#fff", borderRadius: 99, transition: "width 0.5s" }} />
                </div>
              </div>
              {/* Activity counts */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {videoCount > 0 && <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 10px", fontSize: 11 }}>Videos: {videoCount}</span>}
                {quizCount > 0 && <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 10px", fontSize: 11 }}>Quizzes: {quizCount}</span>}
                {assignCount > 0 && <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 10px", fontSize: 11 }}>Tasks: {assignCount}</span>}
                {readingCount > 0 && <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 10px", fontSize: 11 }}>Readings: {readingCount}</span>}
              </div>
            </div>
          </div>
        </div>

        {isInstructor && <div style={{ marginBottom: 14 }}><Btn onClick={() => setAddingLesson(true)} color={T.primary}>+ Add Lesson</Btn></div>}

        {/* Lessons */}
        {lessons.map((lesson, i) => (
          <div key={lesson.id} onClick={() => lesson.type !== "reading" && openLesson(lesson, i)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: lesson.done ? "#f0fdf4" : T.bg1, border: `1px solid ${lesson.done ? "#bbf7d0" : T.border}`, borderRadius: 10, marginBottom: 8, cursor: lesson.type !== "reading" ? "pointer" : "default", transition: "all 0.15s" }}
            onMouseEnter={e => { if (lesson.type !== "reading") e.currentTarget.style.borderColor = "#93c5fd"; }}
            onMouseLeave={e => e.currentTarget.style.borderColor = lesson.done ? "#bbf7d0" : T.border}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: lesson.done ? "#dcfce7" : T.bg3, border: `1.5px solid ${lesson.done ? "#86efac" : T.border2}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: lesson.done ? T.green : T.text3, fontWeight: 700, flexShrink: 0 }}>
              {lesson.done ? "✓" : i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 3 }}>{lesson.title}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <Chip label={lesson.type === "quiz" ? "Quiz" : lesson.type === "video" ? "Video" : lesson.type === "assignment" ? "Task" : "Reading"} color={T.primary} />
                {lesson.duration && <span style={{ color: T.text3, fontSize: 11 }}>{lesson.duration}</span>}
                {lesson.deadline && <span style={{ color: T.amber, fontSize: 11 }}>Due: {lesson.deadline}</span>}
                {lesson.score != null && <span style={{ color: T.green, fontSize: 11 }}>Score: {lesson.score}%</span>}
              </div>
            </div>
            {!lesson.done && lesson.type !== "reading" && <span style={{ color: T.text3, fontSize: 16 }}>›</span>}
          </div>
        ))}

        {/* Reading Pack & Useful Links sections */}
        <div style={{ marginTop: 24, borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
          <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>📖 Reading Pack</div>
            <div style={{ color: T.text3, fontSize: 13 }}>Reading materials for this module will be added here by the instructor.</div>
          </div>
          <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>🔗 Useful Links</div>
            <div style={{ color: T.text3, fontSize: 13 }}>Useful links and resources will be added here by the instructor.</div>
          </div>
        </div>

        {lessons.length === 0 && <div style={{ textAlign: "center", padding: 40, color: T.text3 }}>No lessons yet{isInstructor ? " — add your first one!" : ". Check back soon!"}</div>}
      </div>
    );
  }

  const COLORS = ["#2563eb", "#0891b2", "#7c3aed", "#16a34a", "#d97706", "#dc2626"];
  const MODULE_COLORS = ["#2563eb", "#0891b2", "#1d4ed8", "#0369a1"];

  return (
    <div>
      {addingMod && (
        <Modal onClose={() => setAddingMod(false)} title="New Module">
          {[["title", "Module Title", "e.g. Module 1"], ["desc", "Description", "Brief description..."]].map(([k, l, p]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{l}</div>
              <input value={modForm[k] || ""} onChange={e => setModForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Color</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COLORS.map(c => <button key={c} onClick={() => setModForm(f => ({ ...f, color: c }))} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: modForm.color === c ? `3px solid ${T.text}` : "3px solid transparent", cursor: "pointer" }} />)}
            </div>
          </div>
          <Btn onClick={saveModule} color={T.green}>Create Module</Btn>
        </Modal>
      )}
      {isInstructor && <div style={{ marginBottom: 20 }}><Btn onClick={() => setAddingMod(true)}>+ New Module</Btn></div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {modules.map((m, idx) => (
          <Card key={m.id} onClick={() => openModule(m)} style={{ padding: 0, overflow: "hidden", border: `1px solid ${T.border}` }}>
            <div style={{ height: 100, background: `linear-gradient(135deg, ${MODULE_COLORS[idx % MODULE_COLORS.length]}, ${MODULE_COLORS[(idx + 1) % MODULE_COLORS.length]})`, display: "flex", alignItems: "center", padding: "0 20px", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📖</div>
              <div style={{ color: "#fff" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{m.title?.split(":")[0]?.split(" ").slice(0, 2).join(" ")}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{m.lesson_count} lessons</div>
              </div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 10 }}>{m.title}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: T.text3, fontSize: 12 }}>Course completion</span>
                <span style={{ color: T.primary, fontSize: 12, fontWeight: 700 }}>{m.progress || 0}%</span>
              </div>
              <Bar val={m.progress} color={MODULE_COLORS[idx % MODULE_COLORS.length]} h={5} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GradesTab({ user }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/modules").then(async r => {
      const mods = r.data;
      const result = await Promise.all(mods.map(async mod => {
        const lessons = await api.get(`/modules/${mod.id}/lessons`).then(r => r.data);
        return { ...mod, lessons };
      }));
      setModules(result);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ color: T.text3, padding: 20 }}>Loading grades...</div>;

  const allLessons = modules.flatMap(m => m.lessons || []);
  const completedLessons = allLessons.filter(l => l.done);
  const totalCompletion = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0;
  const gradedLessons = completedLessons.filter(l => l.score != null);
  const avgScore = gradedLessons.length > 0 ? Math.round(gradedLessons.reduce((a, l) => a + l.score, 0) / gradedLessons.length) : null;

  const getGrade = (score) => {
    if (score >= 90) return { letter: "A", color: T.green };
    if (score >= 80) return { letter: "B", color: T.primary };
    if (score >= 70) return { letter: "C", color: T.amber };
    return { letter: "D", color: T.red };
  };

  return (
    <div>
      {/* Summary */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "24px", marginBottom: 20, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Academic Progress</div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>My Grades</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{totalCompletion}%</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Course Completion</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{completedLessons.length}</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Completed</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{avgScore != null ? `${avgScore}%` : "—"}</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Avg Score</div>
          </div>
        </div>
      </div>

      {/* Per module */}
      {modules.map(mod => {
        const modLessons = mod.lessons || [];
        const modDone = modLessons.filter(l => l.done).length;
        const modCompletion = modLessons.length > 0 ? Math.round((modDone / modLessons.length) * 100) : 0;
        const modGraded = modLessons.filter(l => l.score != null);
        const modAvg = modGraded.length > 0 ? Math.round(modGraded.reduce((a, l) => a + l.score, 0) / modGraded.length) : null;

        return (
          <Card key={mod.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{mod.title}</div>
                <div style={{ color: T.text3, fontSize: 12 }}>{modLessons.length} lessons</div>
              </div>
              {modAvg != null && (
                <div style={{ textAlign: "center", background: getGrade(modAvg).color + "14", border: `1px solid ${getGrade(modAvg).color}33`, borderRadius: 8, padding: "6px 14px" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: getGrade(modAvg).color }}>{getGrade(modAvg).letter}</div>
                  <div style={{ fontSize: 11, color: T.text3 }}>{modAvg}%</div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: T.text3, fontSize: 12 }}>Course completion</span>
              <span style={{ color: T.primary, fontSize: 12, fontWeight: 700 }}>{modCompletion}%</span>
            </div>
            <Bar val={modCompletion} color={T.primary} h={6} />
            {modLessons.filter(l => l.score != null).map(l => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${T.border}`, marginTop: 8 }}>
                <span style={{ color: T.text2, fontSize: 13 }}>{l.title}</span>
                <Chip label={`${l.score}%`} color={getGrade(l.score).color} />
              </div>
            ))}
          </Card>
        );
      })}
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
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 14, borderBottom: `1px solid ${T.border}`, marginBottom: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green }} />
        <span style={{ color: T.text2, fontSize: 13, fontWeight: 600 }}>Group Chat</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map(m => {
          const self = m.user_id === user?.id;
          return (
            <div key={m.id} style={{ display: "flex", gap: 10, flexDirection: self ? "row-reverse" : "row" }}>
              <Av name={m.author_name || "?"} color={m.avatar_color || T.primary} size={30} />
              <div style={{ maxWidth: "70%" }}>
                {!self && <div style={{ color: T.text3, fontSize: 11, fontWeight: 600, marginBottom: 3 }}>{m.author_name}</div>}
                <div style={{ background: self ? T.primary : T.bg2, color: self ? "#fff" : T.text, border: self ? "none" : `1px solid ${T.border}`, borderRadius: self ? "14px 4px 14px 14px" : "4px 14px 14px 14px", padding: "9px 13px", fontSize: 13, lineHeight: 1.5 }}>{m.message}</div>
                <div style={{ color: T.text3, fontSize: 10, marginTop: 3, textAlign: self ? "right" : "left" }}>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            </div>
          );
        })}
        <div ref={ref} />
      </div>
      <div style={{ display: "flex", gap: 10, paddingTop: 14, borderTop: `1px solid ${T.border}`, marginTop: 14 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message..." style={{ flex: 1, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif" }} />
        <button onClick={send} style={{ background: T.primary, border: "none", borderRadius: 10, width: 42, height: 42, color: "#fff", cursor: "pointer", fontSize: 16 }}>↑</button>
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
        <div style={{ fontWeight: 700, fontSize: 16, color: T.text }}>Discussion Forum</div>
        <Btn onClick={() => setComposing(c => !c)} small>+ New Post</Btn>
      </div>
      {composing && (
        <Card style={{ marginBottom: 16 }}>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Post title..." style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", marginBottom: 10, fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          <textarea value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Write your message..." rows={3} style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Btn onClick={submit} color={T.green} small>Post</Btn>
            <Btn onClick={() => setComposing(false)} color={T.text3} outline small>Cancel</Btn>
          </div>
        </Card>
      )}
      {posts.map(p => (
        <Card key={p.id} style={{ marginBottom: 10 }}>
          {p.pinned && <div style={{ color: T.primary, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>📌 Pinned</div>}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <Av name={p.author_name} color={p.avatar_color || T.primary} size={30} />
            <div>
              <span style={{ color: T.text2, fontSize: 13, fontWeight: 600 }}>{p.author_name}</span>
              <span style={{ color: T.text3, fontSize: 11, marginLeft: 8 }}>{new Date(p.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 6 }}>{p.title}</div>
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
      <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Students enrolled: {students.length}</div>
      {students.map((s, i) => (
        <Card key={s.id || i} style={{ marginBottom: 10, display: "flex", gap: 14, alignItems: "center" }}>
          <Av name={s.name || s.av} color={s.avatar_color || s.col} size={38} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 2 }}>{s.name}</div>
            <div style={{ color: T.text3, fontSize: 12 }}>{s.email || `Last active ${s.active}`}</div>
          </div>
          <div style={{ minWidth: 120 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ color: T.text3, fontSize: 11 }}>Progress</span>
              <span style={{ color: T.primary, fontSize: 11, fontWeight: 700 }}>{s.overall || s.prog || 0}%</span>
            </div>
            <Bar val={s.overall || s.prog} color={s.avatar_color || s.col} h={5} />
          </div>
          {s.grade && <Chip label={s.grade} color={s.grade?.startsWith("A") ? T.green : s.grade?.startsWith("B") ? T.primary : T.amber} />}
        </Card>
      ))}
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
  const completed = modules.filter(m => m.progress === 100).length;
  const inProgress = modules.filter(m => m.progress > 0 && m.progress < 100).length;

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "28px", marginBottom: 20, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Welcome back</div>
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>LearnFlow</div>
        <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 18 }}>Your professional development platform</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, opacity: 0.9 }}>Course completion</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{overall}%</span>
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 99 }}>
          <div style={{ height: "100%", width: `${overall}%`, background: "#fff", borderRadius: 99, transition: "width 0.5s" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[{ label: "Total Modules", value: modules.length, color: T.primary }, { label: "Completed", value: completed, color: T.green }, { label: "In Progress", value: inProgress, color: T.amber }].map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "16px 12px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ color: T.text3, fontSize: 12 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 12 }}>My Modules</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, marginBottom: 20 }}>
        {modules.map((m, idx) => {
          const colors = ["#2563eb", "#0891b2", "#1d4ed8", "#0369a1"];
          return (
            <Card key={m.id} style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ height: 56, background: `linear-gradient(135deg, ${colors[idx % colors.length]}, ${colors[(idx + 1) % colors.length]})`, display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
                <span style={{ fontSize: 18 }}>📖</span>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, opacity: 0.9 }}>{m.title?.split(" ").slice(0, 2).join(" ")}</span>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: T.text3, fontSize: 11 }}>Completion</span>
                  <span style={{ color: T.primary, fontSize: 11, fontWeight: 700 }}>{m.progress || 0}%</span>
                </div>
                <Bar val={m.progress} color={colors[idx % colors.length]} h={4} />
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 12 }}>Announcements</div>
      {announcements.map(a => (
        <Card key={a.id} style={{ marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
            {a.type === "info" ? "ℹ️" : a.type === "event" ? "📅" : "🆕"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 3 }}>{a.title}</div>
            <div style={{ color: T.text2, fontSize: 12, lineHeight: 1.5 }}>{a.body}</div>
          </div>
          <div style={{ color: T.text3, fontSize: 11, whiteSpace: "nowrap" }}>{new Date(a.created_at).toLocaleDateString()}</div>
        </Card>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isInstructor = user?.role === "instructor";

  const NAV = [
    { id: "home", icon: "⊞", label: "Dashboard" },
    { id: "course", icon: "📋", label: "Course Navigation" },
    { id: "modules", icon: "📖", label: "My Modules" },
    { id: "grades", icon: "🎓", label: "Grades" },
    { id: "chat", icon: "💬", label: "Chat" },
    { id: "forum", icon: "◆", label: "Forum" },
    ...(isInstructor ? [{ id: "students", icon: "👥", label: "Students" }] : []),
  ];

  const TITLES = { home: "Dashboard", course: "Course Navigation", modules: "My Modules", grades: "Grades", chat: "Group Chat", forum: "Forum", students: "Students" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        html,body { background: #f5f7fa; font-family: 'Inter', sans-serif; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      <div style={{ display: "flex", height: "100vh", background: T.bg }}>
        <div style={{ width: sidebarOpen ? 220 : 60, background: T.bg1, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", transition: "width .25s ease", overflow: "hidden", flexShrink: 0, boxShadow: "2px 0 8px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "18px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #1e3a5f, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, color: "#fff" }}>📖</div>
            {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 15, color: T.text, whiteSpace: "nowrap" }}>LearnFlow</span>}
            <button onClick={() => setSidebarOpen(o => !o)} style={{ marginLeft: "auto", background: T.bg3, border: "none", borderRadius: 6, color: T.text3, cursor: "pointer", width: 26, height: 26, flexShrink: 0, fontSize: 12 }}>
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>
          <nav style={{ padding: "10px 8px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === n.id ? "#eff6ff" : "transparent", color: tab === n.id ? T.primary : T.text3, fontSize: 13, fontWeight: tab === n.id ? 600 : 500, transition: "all .15s", whiteSpace: "nowrap", overflow: "hidden", textAlign: "left", width: "100%", fontFamily: "'Inter',sans-serif" }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{n.icon}</span>
                {sidebarOpen && n.label}
              </button>
            ))}
          </nav>
          <div style={{ padding: "12px 8px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
            <Av name={user?.name || "User"} color={user?.avatar_color || T.primary} size={32} />
            {sidebarOpen && (
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ color: T.text, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                <div style={{ color: T.green, fontSize: 11, textTransform: "capitalize" }}>{user?.role}</div>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={logout} title="Logout" style={{ background: "#fee2e2", border: "none", borderRadius: 6, color: T.red, cursor: "pointer", width: 28, height: 28, fontSize: 13, flexShrink: 0 }}>⏻</button>
            )}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 24px", background: T.bg1, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: T.text }}>{TITLES[tab]}</div>
            <Chip label={isInstructor ? "Instructor" : "Student"} color={isInstructor ? T.amber : T.primary} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 24, animation: "fadeUp .2s ease" }} key={tab}>
            {tab === "home" && <HomeTab />}
            {tab === "course" && <CourseNavTab isInstructor={isInstructor} />}
            {tab === "modules" && <ModulesTab isInstructor={isInstructor} />}
            {tab === "grades" && <GradesTab user={user} />}
            {tab === "chat" && <ChatTab user={user} />}
            {tab === "forum" && <ForumTab user={user} />}
            {tab === "students" && isInstructor && <StudentsTab />}
          </div>
        </div>
      </div>
    </>
  );
}