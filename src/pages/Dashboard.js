import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const T = {
  bg: "#f5f7fa", bg1: "#ffffff", bg2: "#f8fafc", bg3: "#eef2f7",
  border: "#e2e8f0", border2: "#cbd5e1",
  text: "#1e293b", text2: "#475569", text3: "#94a3b8",
  primary: "#2563eb", primaryL: "#3b82f6",
  green: "#16a34a", amber: "#d97706", teal: "#0891b2", red: "#dc2626",
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

function QuizModal({ lesson, onClose, onComplete, lessons, activeLessonIdx }) {
  const formUrl = lesson.video_url || lesson.form_url || "";
  const total = lessons?.length || 1;
  const current = (activeLessonIdx ?? 0) + 1;
  const isLast = activeLessonIdx >= total - 1;

  const handleComplete = () => { onComplete && onComplete(100); };

  const inner = !formUrl ? (
    <div style={{ textAlign: "center", padding: 20, color: T.text3 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
      <div>No quiz link added yet.</div>
    </div>
  ) : (
    <div style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>📋</div>
      <div style={{ color: T.text, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{lesson.title}</div>
      <div style={{ color: T.text2, fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Open the quiz in a new tab, complete it, then come back and mark it done.</div>
      <a href={formUrl} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", borderRadius: 10, padding: "11px 28px", fontWeight: 700, fontSize: 14, textDecoration: "none", marginBottom: 20, boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}>
        📋 Open Quiz
      </a>
    </div>
  );

  return (
    <Modal onClose={onClose} title={lesson.title}>
      {inner}
      {/* Progress bar */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.text3, marginBottom: 5, marginTop: 8 }}>
        <span>Activity {current} of {total}</span>
        <span>{Math.round((current / total) * 100)}% through module</span>
      </div>
      <div style={{ height: 4, background: T.bg3, borderRadius: 99, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(current / total) * 100}%`, background: "linear-gradient(90deg, #7c3aed, #2563eb)", borderRadius: 99, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text2, padding: "8px 14px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13 }}>Close</button>
        {!isLast ? (
          <button onClick={handleComplete} style={{ marginLeft: "auto", background: "linear-gradient(135deg, #7c3aed, #2563eb)", border: "none", borderRadius: 8, color: "#fff", padding: "9px 20px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}>
            ✓ Done · Next Activity →
          </button>
        ) : (
          <button onClick={handleComplete} style={{ marginLeft: "auto", background: `linear-gradient(135deg, ${T.green}, #0891b2)`, border: "none", borderRadius: 8, color: "#fff", padding: "9px 20px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13 }}>
            ✓ Finish Module
          </button>
        )}
      </div>
    </Modal>
  );
}

function UploadModal({ lesson, onClose, onComplete, lessons, activeLessonIdx }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef();
  const total = lessons?.length || 1;
  const current = (activeLessonIdx ?? 0) + 1;
  const isLast = activeLessonIdx >= total - 1;
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
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ color: T.green, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Assignment Submitted!</div>
          <div style={{ color: T.text3, fontSize: 13, marginBottom: 24 }}>Your instructor will review and grade it.</div>
          {/* Progress bar */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.text3, marginBottom: 5 }}>
            <span>Activity {current} of {total}</span>
            <span>{Math.round((current / total) * 100)}% through module</span>
          </div>
          <div style={{ height: 4, background: T.bg3, borderRadius: 99, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(current / total) * 100}%`, background: `linear-gradient(90deg, ${T.amber}, #f97316)`, borderRadius: 99, transition: "width 0.5s" }} />
          </div>
          {!isLast ? (
            <button onClick={onClose} style={{ background: `linear-gradient(135deg, ${T.amber}, #f97316)`, border: "none", borderRadius: 10, color: "#fff", padding: "10px 24px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(217,119,6,0.3)" }}>
              Next Activity →
            </button>
          ) : (
            <Btn onClick={onClose} color={T.green}>✓ Finish Module</Btn>
          )}
        </div>
      ) : (
        <>
          <div onClick={() => ref.current.click()} style={{ border: `2px dashed ${T.border2}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: T.bg2, marginBottom: 14, transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.amber}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border2}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✏</div>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600 }}>Drop files or <span style={{ color: T.amber }}>browse</span></div>
            <div style={{ color: T.text3, fontSize: 11, marginTop: 4 }}>PDF, DOCX, images accepted</div>
            <input ref={ref} type="file" multiple style={{ display: "none" }} onChange={e => addF(e.target.files)} />
          </div>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", background: "#fffbeb", border: `1px solid #fde68a`, borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
              <span style={{ color: T.text2, fontSize: 13 }}>✏ {f.name}</span>
              <span style={{ color: T.text3, fontSize: 12 }}>{f.size}</span>
            </div>
          ))}
          {files.length > 0 && <Btn onClick={submit} color={T.amber} disabled={uploading}>{uploading ? "Uploading..." : `Submit ${files.length} file(s)`}</Btn>}
        </>
      )}
    </Modal>
  );
}

function ModuleResources({ moduleId, isInstructor }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState("link");
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const load = () => {
    api.get(`/resources?module_id=${moduleId}`).then(r => { setResources(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, [moduleId]);

  const submit = async () => {
    setSaving(true);
    try {
      if (addType === "link") {
        await api.post("/resources/link", { ...form, module_id: moduleId, type: form.linkType || "link" });
      } else {
        const fd = new FormData();
        if (file) fd.append("file", file);
        fd.append("title", form.title || "");
        fd.append("module_id", moduleId);
        fd.append("type", "reading");
        if (form.description) fd.append("description", form.description);
        await api.post("/resources", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      load(); setShowAdd(false); setForm({}); setFile(null);
    } catch { alert("Failed."); }
    finally { setSaving(false); }
  };

  const readings = resources.filter(r => r.type === "reading" || r.type === "file");
  const links    = resources.filter(r => r.type === "link");

  if (loading) return null;

  return (
    <div style={{ marginTop: 28, borderTop: `2px solid ${T.border}`, paddingTop: 22 }}>
      {showAdd && (
        <Modal onClose={() => { setShowAdd(false); setForm({}); setFile(null); }} title="Add Resource">
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["link", "file"].map(t => (
              <button key={t} onClick={() => setAddType(t)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${addType === t ? T.primary : T.border}`, background: addType === t ? "#eff6ff" : T.bg2, cursor: "pointer", fontSize: 12, fontWeight: 700, color: addType === t ? T.primary : T.text3, fontFamily: "'Inter',sans-serif" }}>
                {t === "link" ? "🔗 Add Link" : "📄 Upload File"}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Title</div>
            <input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Resource title" style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          </div>
          {addType === "link" ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>URL</div>
                <input value={form.url || ""} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Type</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ v: "link", l: "🔗 Useful Link" }, { v: "reading", l: "📄 Reading" }].map(o => (
                    <button key={o.v} onClick={() => setForm(f => ({ ...f, linkType: o.v }))} style={{ flex: 1, padding: "7px", borderRadius: 8, border: `1.5px solid ${form.linkType === o.v ? T.primary : T.border}`, background: form.linkType === o.v ? "#eff6ff" : T.bg2, cursor: "pointer", fontSize: 12, fontWeight: 600, color: form.linkType === o.v ? T.primary : T.text3, fontFamily: "'Inter',sans-serif" }}>{o.l}</button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${T.border2}`, borderRadius: 10, padding: "22px", textAlign: "center", cursor: "pointer", background: T.bg2 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>📄</div>
                <div style={{ color: T.text2, fontSize: 13 }}>{file ? file.name : "Click to select file"}</div>
                <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
              </div>
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Description (optional)</div>
            <input value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          </div>
          <Btn onClick={submit} color={T.green} disabled={saving || !form.title}>{saving ? "Saving..." : "Add"}</Btn>
        </Modal>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: T.text, fontFamily: "'Nunito',sans-serif" }}>Materials for this module</div>
        {isInstructor && <Btn onClick={() => setShowAdd(true)} small>+ Add</Btn>}
      </div>

      {/* Reading Pack */}
      <div style={{ background: "linear-gradient(135deg, #eff6ff, #f5f3ff)", border: `1.5px solid #c7d2fe`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: T.primary, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          📄 Reading Pack
          <span style={{ background: T.primary + "18", color: T.primary, borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{readings.length}</span>
        </div>
        {readings.length === 0 ? (
          <div style={{ color: T.text3, fontSize: 12 }}>No reading materials yet{isInstructor ? " — add some above" : ""}.</div>
        ) : readings.map(r => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid #e0e7ff` }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: T.text }}>{r.title}</div>
              {r.description && <div style={{ color: T.text3, fontSize: 11 }}>{r.description}</div>}
            </div>
            {r.file_path && (
              <a href={`${process.env.REACT_APP_API_URL || "/api"}/resources/file/${r.file_path}`} target="_blank" rel="noopener noreferrer" style={{ background: T.primary + "14", color: T.primary, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Download</a>
            )}
            {r.url && (
              <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ background: T.primary + "14", color: T.primary, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Open →</a>
            )}
          </div>
        ))}
      </div>

      {/* Useful Links */}
      <div style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfeff)", border: `1.5px solid #a7f3d0`, borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: T.teal, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          🔗 Useful Links
          <span style={{ background: T.teal + "18", color: T.teal, borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{links.length}</span>
        </div>
        {links.length === 0 ? (
          <div style={{ color: T.text3, fontSize: 12 }}>No useful links yet{isInstructor ? " — add some above" : ""}.</div>
        ) : links.map(r => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid #a7f3d0` }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🔗</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: T.text }}>{r.title}</div>
              {r.description && <div style={{ color: T.text3, fontSize: 11 }}>{r.description}</div>}
            </div>
            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ background: T.teal + "14", color: T.teal, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Open →</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonUploadModal({ lesson, modId, isInstructor, onClose }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [existing, setExisting] = useState([]);
  const ref = useRef();

  useEffect(() => {
    api.get(`/upload/submissions/${lesson.id}`).then(r => setExisting(r.data)).catch(() => {});
  }, [lesson.id]);

  const addF = (fs) => setFiles(p => [...p, ...[...fs].map(f => ({ file: f, name: f.name, size: (f.size / 1024).toFixed(0) + " KB" }))]);

  const submit = async () => {
    setUploading(true);
    try {
      const form = new FormData();
      files.forEach(f => form.append("files", f.file));
      await api.post(`/upload/${lesson.id}`, form, { headers: { "Content-Type": "multipart/form-data" } });
      setDone(true);
    } catch (e) { alert("Upload failed: " + e.message); }
    finally { setUploading(false); }
  };

  const typeConfig = {
    video: { icon: "▶", color: T.primary }, quiz: { icon: "📋", color: "#7c3aed" },
    assignment: { icon: "✏", color: T.amber }, reading: { icon: "📄", color: T.teal },
  };
  const tc = typeConfig[lesson.type] || typeConfig.video;

  return (
    <Modal onClose={onClose} title={lesson.title}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: tc.color + "10", border: `1px solid ${tc.color}22`, borderRadius: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 20 }}>{tc.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{lesson.title}</div>
          <div style={{ color: T.text3, fontSize: 11, textTransform: "capitalize" }}>{lesson.type}{lesson.duration ? ` · ${lesson.duration}` : ""}</div>
        </div>
      </div>

      {done ? (
        <div style={{ textAlign: "center", padding: "16px 0" }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
          <div style={{ color: T.green, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Files uploaded!</div>
          <div style={{ color: T.text3, fontSize: 13, marginBottom: 20 }}>Students can now access these materials.</div>
          <Btn onClick={onClose}>Done</Btn>
        </div>
      ) : isInstructor ? (
        <>
          {existing.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: T.text2, marginBottom: 8 }}>Already uploaded:</div>
              {existing.map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "7px 12px", marginBottom: 5 }}>
                  <span style={{ color: T.text2, fontSize: 12 }}>📄 {f.file_name}</span>
                  <a href={`${process.env.REACT_APP_API_URL || "/api"}/upload/file/${f.file_path}`} target="_blank" rel="noopener noreferrer" style={{ color: T.primary, fontSize: 11, fontWeight: 600, textDecoration: "none" }}>View</a>
                </div>
              ))}
            </div>
          )}
          <div style={{ color: T.text2, fontSize: 13, marginBottom: 12 }}>Upload materials for <strong>{lesson.title}</strong>. Any file type accepted.</div>
          <div onClick={() => ref.current.click()} style={{ border: `2px dashed ${T.border2}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: T.bg2, marginBottom: 14, transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.primary}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border2}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>📤</div>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600 }}>Drop files or <span style={{ color: T.primary }}>browse</span></div>
            <div style={{ color: T.text3, fontSize: 11, marginTop: 4 }}>PDF, DOCX, MP4, PPT, images — any format</div>
            <input ref={ref} type="file" multiple style={{ display: "none" }} onChange={e => addF(e.target.files)} />
          </div>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
              <span style={{ color: T.text2, fontSize: 13 }}>📄 {f.name}</span>
              <span style={{ color: T.text3, fontSize: 11 }}>{f.size}</span>
            </div>
          ))}
          {files.length > 0 && <Btn onClick={submit} color={T.primary} disabled={uploading}>{uploading ? "Uploading..." : `Upload ${files.length} file(s)`}</Btn>}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div style={{ color: T.text2, fontSize: 14 }}>Materials uploaded by the instructor will appear here.</div>
          {existing.length > 0 && (
            <div style={{ marginTop: 16, textAlign: "left" }}>
              {existing.map((f, i) => (
                <a key={i} href={`${process.env.REACT_APP_API_URL || "/api"}/upload/file/${f.file_path}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, marginBottom: 8, textDecoration: "none" }}>
                  <span style={{ fontSize: 18 }}>📄</span>
                  <span style={{ color: T.primary, fontSize: 13, fontWeight: 600 }}>{f.file_name}</span>
                </a>
              ))}
            </div>
          )}
          <div style={{ marginTop: 16 }}><Btn onClick={onClose}>Close</Btn></div>
        </div>
      )}
    </Modal>
  );
}

function CourseNavTab({ isInstructor }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonMap, setLessonMap] = useState({});
  const [loadingLessons, setLoadingLessons] = useState({});

  useEffect(() => {
    api.get("/modules/coursenav").then(r => {
      setModules(r.data);
      setLoading(false);
      const first = r.data[0];
      if (first) {
        setExpanded({ [first.id]: true });
        fetchLessons(first.id);
      }
    });
  }, []);

  const fetchLessons = (modId) => {
    if (lessonMap[modId]) return;
    setLoadingLessons(p => ({ ...p, [modId]: true }));
    api.get(`/modules/${modId}/lessons`).then(r => {
      setLessonMap(p => ({ ...p, [modId]: r.data }));
      setLoadingLessons(p => ({ ...p, [modId]: false }));
    }).catch(() => setLoadingLessons(p => ({ ...p, [modId]: false })));
  };

  const toggleMod = (mod) => {
    setExpanded(p => ({ ...p, [mod.id]: !p[mod.id] }));
    fetchLessons(mod.id);
  };

  const palettes = [
    ["#1e3a5f", "#2563eb"], ["#1d4ed8", "#7c3aed"],
    ["#0e7490", "#0891b2"], ["#15803d", "#0891b2"]
  ];

  if (loading) return <div style={{ color: T.text3, padding: 20 }}>Loading...</div>;

  return (
    <div>
      {activeLesson && (
        <LessonUploadModal lesson={activeLesson.lesson} modId={activeLesson.modId} isInstructor={isInstructor} onClose={() => setActiveLesson(null)} />
      )}

      {/* Header banner */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #7c3aed 100%)", borderRadius: 16, padding: "28px 28px", marginBottom: 24, color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 8px 28px rgba(37,99,235,0.28)" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, opacity: 0.75, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Course Materials</div>
          <div style={{ fontWeight: 900, fontSize: 22, fontFamily: "'Nunito',sans-serif", marginBottom: 4 }}>Course Structure</div>
          <div style={{ opacity: 0.8, fontSize: 13 }}>
            {isInstructor ? "Click any lesson to upload files — any format accepted" : "Click any lesson to view uploaded materials"}
          </div>
        </div>
      </div>

      {/* Module blocks */}
      {modules.map((mod, idx) => {
        const [c1, c2] = palettes[idx % palettes.length];
        const isOpen = !!expanded[mod.id];
        const modLessons = lessonMap[mod.id] || [];
        const isLoadingL = loadingLessons[mod.id];

        return (
          <div key={mod.id} style={{ background: T.bg1, border: `1.5px solid ${T.border}`, borderRadius: 14, marginBottom: 16, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", animation: `fadeUp .3s ease ${idx * 0.07}s both` }}>

            {/* Module header row */}
            <div onClick={() => toggleMod(mod)} style={{ display: "flex", alignItems: "center", gap: 0, cursor: "pointer", userSelect: "none" }}>
              <div style={{ width: 6, alignSelf: "stretch", background: `linear-gradient(180deg, ${c1}, ${c2})`, flexShrink: 0 }} />
              <div style={{ padding: "18px 20px", flex: 1, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${c1}, ${c2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, boxShadow: `0 4px 12px ${c1}44` }}>📋</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: T.text, textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "'Nunito',sans-serif" }}>{mod.title}</div>
                  <div style={{ color: T.text3, fontSize: 12, marginTop: 2 }}>{mod.lesson_count || 0} lessons{mod.description ? ` · ${mod.description}` : ""}</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: isOpen ? `linear-gradient(135deg, ${c1}, ${c2})` : T.bg3, display: "flex", alignItems: "center", justifyContent: "center", color: isOpen ? "#fff" : T.text3, fontSize: 14, transition: "all .2s", flexShrink: 0 }}>
                  {isOpen ? "−" : "+"}
                </div>
              </div>
            </div>

            {/* Expanded lesson list */}
            {isOpen && (
              <div style={{ borderTop: `1px solid ${T.border}` }}>
                {isLoadingL && <div style={{ padding: "16px 24px", color: T.text3, fontSize: 13 }}>Loading lessons...</div>}
                {!isLoadingL && modLessons.length === 0 && (
                  <div style={{ padding: "20px 24px", color: T.text3, fontSize: 13, textAlign: "center" }}>
                    No lessons yet{isInstructor ? " — add lessons in the Modules tab" : ""}.
                  </div>
                )}
                {modLessons.map((lesson, li) => {
                  const typeConfig = {
                    video:      { icon: "▶", color: T.primary,  bg: "#eff6ff" },
                    quiz:       { icon: "📋", color: "#7c3aed",  bg: "#f5f3ff" },
                    assignment: { icon: "✏",  color: T.amber,    bg: "#fffbeb" },
                    reading:    { icon: "📄", color: T.teal,     bg: "#ecfeff" },
                  };
                  const tc = typeConfig[lesson.type] || typeConfig.video;
                  return (
                    <div key={lesson.id}
                      onClick={() => setActiveLesson({ lesson, modId: mod.id })}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderTop: li > 0 ? `1px solid ${T.border}` : "none", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = tc.bg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      {/* Step number */}
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: tc.bg, border: `2px solid ${tc.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: tc.color, flexShrink: 0 }}>
                        {li + 1}
                      </div>
                      {/* Type icon */}
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: tc.bg, border: `1px solid ${tc.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{tc.icon}</div>
                      {/* Title */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: T.text, textTransform: "uppercase", letterSpacing: "0.03em" }}>{lesson.title}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                          <span style={{ background: tc.color + "14", color: tc.color, borderRadius: 6, padding: "1px 8px", fontSize: 11, fontWeight: 600, textTransform: "capitalize" }}>{lesson.type}</span>
                          {lesson.duration && <span style={{ color: T.text3, fontSize: 11 }}>⏱ {lesson.duration}</span>}
                          {lesson.deadline && <span style={{ color: T.amber, fontSize: 11 }}>📅 Due {lesson.deadline}</span>}
                        </div>
                      </div>
                      {/* Action button */}
                      <div style={{ background: isInstructor ? `linear-gradient(135deg, ${c1}, ${c2})` : tc.bg, color: isInstructor ? "#fff" : tc.color, border: isInstructor ? "none" : `1px solid ${tc.color}33`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", boxShadow: isInstructor ? `0 3px 10px ${c1}44` : "none" }}>
                        {isInstructor ? "↑ Upload" : "▶ View"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {modules.length === 0 && (
        <div style={{ textAlign: "center", padding: 48, color: T.text3 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>No modules yet</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Create modules in the My Modules tab first.</div>
        </div>
      )}
    </div>
  );
}

function InstructorLessonModal({ lesson, onClose, onSaved }) {
  const [form, setForm] = useState({ url: lesson.video_url || "", duration: lesson.duration || "", deadline: lesson.deadline || "" });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef();

  const isVideo = lesson.type === "video";
  const isQuiz  = lesson.type === "quiz";
  const isUpload = lesson.type === "assignment" || lesson.type === "reading";

  const saveUrl = async () => {
    await api.patch(`/modules/lessons/${lesson.id}`, { video_url: form.url, duration: form.duration, deadline: form.deadline });
    onSaved && onSaved({ ...lesson, video_url: form.url, duration: form.duration, deadline: form.deadline });
    onClose();
  };

  const uploadFiles = async () => {
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append("files", f.file));
      await api.post(`/upload/${lesson.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setDone(true);
    } catch { alert("Upload failed."); }
    finally { setUploading(false); }
  };

  const addF = fs => setFiles(p => [...p, ...[...fs].map(f => ({ file: f, name: f.name, size: (f.size / 1024).toFixed(0) + " KB" }))]);

  const typeConfig = { video: { icon: "▶", color: T.primary }, quiz: { icon: "📋", color: "#7c3aed" }, assignment: { icon: "✏", color: T.amber }, reading: { icon: "📄", color: T.teal } };
  const tc = typeConfig[lesson.type] || typeConfig.video;

  return (
    <Modal onClose={onClose} title={`Edit: ${lesson.title}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: tc.color + "12", border: `1px solid ${tc.color}25`, borderRadius: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 22 }}>{tc.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{lesson.title}</div>
          <div style={{ color: T.text3, fontSize: 11, textTransform: "capitalize" }}>{lesson.type}</div>
        </div>
      </div>

      {done ? (
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
          <div style={{ color: T.green, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Files uploaded!</div>
          <Btn onClick={onClose}>Done</Btn>
        </div>
      ) : (
        <>
          {(isVideo || isQuiz) && (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                  {isVideo ? "YouTube Video URL" : "Google Form / Quiz URL"}
                </div>
                <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder={isVideo ? "https://youtube.com/watch?v=..." : "https://forms.google.com/..."}
                  style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
              </div>
              {isVideo && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Duration</div>
                  <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g. 12:30"
                    style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
                </div>
              )}
              <div style={{ marginBottom: 18 }}>
                <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Deadline (optional)</div>
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
              </div>
              <Btn onClick={saveUrl} color={tc.color} disabled={!form.url}>💾 Save</Btn>
            </>
          )}

          {isUpload && (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Deadline (optional)</div>
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
              </div>
              {form.deadline && <div style={{ marginBottom: 14 }}><Btn onClick={saveUrl} color={T.teal}>💾 Save Deadline</Btn></div>}
              <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Upload files for students</div>
              <div onClick={() => ref.current.click()} style={{ border: `2px dashed ${T.border2}`, borderRadius: 12, padding: "26px 20px", textAlign: "center", cursor: "pointer", background: T.bg2, marginBottom: 14, transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = tc.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.border2}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>📤</div>
                <div style={{ color: T.text2, fontSize: 13, fontWeight: 600 }}>Drop files or <span style={{ color: tc.color }}>browse</span></div>
                <div style={{ color: T.text3, fontSize: 11, marginTop: 4 }}>Any file format accepted</div>
                <input ref={ref} type="file" multiple style={{ display: "none" }} onChange={e => addF(e.target.files)} />
              </div>
              {files.map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
                  <span style={{ color: T.text2, fontSize: 13 }}>📄 {f.name}</span>
                  <span style={{ color: T.text3, fontSize: 11 }}>{f.size}</span>
                </div>
              ))}
              {files.length > 0 && <Btn onClick={uploadFiles} color={tc.color} disabled={uploading}>{uploading ? "Uploading..." : `Upload ${files.length} file(s)`}</Btn>}
            </>
          )}
        </>
      )}
    </Modal>
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
        {activeLesson && isInstructor && (
          <InstructorLessonModal lesson={activeLesson} onClose={() => setActiveLesson(null)}
            onSaved={updated => setLessons(ls => ls.map(l => l.id === updated.id ? { ...l, ...updated } : l))} />
        )}
        {activeLesson?.type === "video" && !isInstructor && (
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
            {/* Progress mini-bar */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>
              <span>Activity {activeLessonIdx + 1} of {lessons.length}</span>
              <span>{Math.round(((activeLessonIdx + 1) / lessons.length) * 100)}% through module</span>
            </div>
            <div style={{ height: 4, background: T.bg3, borderRadius: 99, marginBottom: 14, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((activeLessonIdx + 1) / lessons.length) * 100}%`, background: `linear-gradient(90deg, ${T.primary}, #7c3aed)`, borderRadius: 99, transition: "width 0.5s" }} />
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={() => { markDone(activeLesson.id); }} style={{ background: T.green, border: "none", borderRadius: 8, color: "#fff", padding: "8px 16px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13 }}>✓ Mark Complete</button>
              <button onClick={() => setActiveLesson(null)} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text2, padding: "8px 14px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13 }}>Close</button>
              {activeLessonIdx < lessons.length - 1 ? (
                <button onClick={() => { markDone(activeLesson.id); goNext(); }} style={{ marginLeft: "auto", background: `linear-gradient(135deg, ${T.primary}, #7c3aed)`, border: "none", borderRadius: 8, color: "#fff", padding: "9px 20px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
                  Next Activity <span style={{ fontSize: 16 }}>→</span>
                </button>
              ) : (
                <button onClick={() => { markDone(activeLesson.id); setActiveLesson(null); }} style={{ marginLeft: "auto", background: `linear-gradient(135deg, ${T.green}, #0891b2)`, border: "none", borderRadius: 8, color: "#fff", padding: "9px 20px", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  ✓ Finish Module
                </button>
              )}
            </div>
          </Modal>
        )}
        {activeLesson?.type === "quiz" && !isInstructor && <QuizModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={score => { markDone(activeLesson.id, score); goNext(); }} lessons={lessons} activeLessonIdx={activeLessonIdx} />}
        {activeLesson?.type === "assignment" && !isInstructor && <UploadModal lesson={activeLesson} onClose={() => setActiveLesson(null)} onComplete={() => { markDone(activeLesson.id); goNext(); }} lessons={lessons} activeLessonIdx={activeLessonIdx} />}
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
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #7c3aed 100%)", borderRadius: 16, padding: "24px", marginBottom: 20, color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 8px 28px rgba(37,99,235,0.28)" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, position: "relative", zIndex: 1 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>�</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 19, marginBottom: 3, fontFamily: "'Nunito',sans-serif" }}>{openMod.title}</div>
              <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 16 }}>{openMod.description}</div>

              {/* Progress Widget */}
              <div style={{ background: "rgba(255,255,255,0.13)", borderRadius: 10, padding: "12px 16px", marginBottom: 14, backdropFilter: "blur(4px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, opacity: 0.9, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14 }}>📊</span> Course Completion
                  </span>
                  <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Nunito',sans-serif" }}>{completion}%</span>
                </div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${completion}%`, background: "linear-gradient(90deg, #a5f3fc, #ffffff)", borderRadius: 99, transition: "width 1s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 8px rgba(255,255,255,0.5)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, opacity: 0.8 }}>
                  <span>{totalDone} of {lessons.length} activities completed</span>
                  {completion === 100 && <span style={{ color: "#bbf7d0", fontWeight: 700 }}>🎉 Module Complete!</span>}
                </div>
              </div>

              {/* Activity count badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { count: videoCount, label: "Videos", icon: "▶" },
                  { count: quizCount, label: "Quizzes", icon: "📋" },
                  { count: assignCount, label: "Tasks", icon: "✏" },
                  { count: readingCount, label: "Readings", icon: "📄" },
                ].filter(b => b.count > 0).map(b => (
                  <span key={b.label} style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    <span>{b.icon}</span> {b.label} <span style={{ background: "rgba(255,255,255,0.3)", borderRadius: 10, padding: "1px 6px", fontSize: 11 }}>{b.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isInstructor && <div style={{ marginBottom: 14 }}><Btn onClick={() => setAddingLesson(true)} color={T.primary}>+ Add Lesson</Btn></div>}

        {/* Lessons */}
        {lessons.map((lesson, i) => {
          const typeConfig = {
            video:      { icon: "▶", color: T.primary,  bg: "#eff6ff", label: "Video" },
            quiz:       { icon: "📋", color: "#7c3aed",  bg: "#f5f3ff", label: "Quiz" },
            assignment: { icon: "✏", color: T.amber,    bg: "#fffbeb", label: "Task" },
            reading:    { icon: "📄", color: T.teal,     bg: "#ecfeff", label: "Reading" },
          };
          const tc = typeConfig[lesson.type] || typeConfig.video;
          return (
            <div key={lesson.id} onClick={() => isInstructor ? openLesson(lesson, i) : lesson.type !== "reading" && openLesson(lesson, i)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: lesson.done ? "#f0fdf4" : T.bg1, border: `1.5px solid ${lesson.done ? "#86efac" : T.border}`, borderRadius: 12, marginBottom: 8, cursor: lesson.type !== "reading" ? "pointer" : "default", transition: "all 0.2s", animation: `fadeUp .3s ease ${i * 0.05}s both` }}
              onMouseEnter={e => { if (lesson.type !== "reading") { e.currentTarget.style.borderColor = tc.color; e.currentTarget.style.boxShadow = `0 4px 16px ${tc.color}18`; }}}
              onMouseLeave={e => { e.currentTarget.style.borderColor = lesson.done ? "#86efac" : T.border; e.currentTarget.style.boxShadow = "none"; }}>
              {/* Step number bubble */}
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: lesson.done ? "#dcfce7" : tc.bg, border: `2px solid ${lesson.done ? "#86efac" : tc.color + "44"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: lesson.done ? T.green : tc.color, fontWeight: 800, flexShrink: 0 }}>
                {lesson.done ? "✓" : i + 1}
              </div>
              {/* Type icon */}
              <div style={{ width: 32, height: 32, borderRadius: 8, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, border: `1px solid ${tc.color}22` }}>{tc.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: lesson.done ? "#15803d" : T.text, marginBottom: 3 }}>{lesson.title}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ background: tc.color + "14", color: tc.color, border: `1px solid ${tc.color}33`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{tc.label}</span>
                  {lesson.duration && <span style={{ color: T.text3, fontSize: 11 }}>⏱ {lesson.duration}</span>}
                  {lesson.deadline && <span style={{ color: T.amber, fontSize: 11 }}>📅 Due: {lesson.deadline}</span>}
                  {lesson.score != null && <span style={{ color: T.green, fontSize: 11, fontWeight: 600 }}>★ {lesson.score}%</span>}
                </div>
              </div>
              {lesson.done
                ? <span style={{ color: T.green, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>✓ Done</span>
                : lesson.type !== "reading" && (
                  <div style={{ background: `linear-gradient(135deg, ${tc.color}, #7c3aed)`, borderRadius: 8, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", boxShadow: `0 3px 10px ${tc.color}33` }}>Start →</div>
                )
              }
            </div>
          );
        })}

        {/* Reading Pack & Useful Links — loaded from API */}
        <ModuleResources moduleId={openMod.id} isInstructor={isInstructor} />

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
          <Card key={m.id} onClick={() => openModule(m)} style={{ padding: 0, overflow: "hidden", border: `1px solid ${T.border}`, animation: `fadeUp .3s ease ${idx * 0.07}s both` }}>
            <div style={{ height: 100, background: `linear-gradient(135deg, ${MODULE_COLORS[idx % MODULE_COLORS.length]}, ${MODULE_COLORS[(idx + 1) % MODULE_COLORS.length]})`, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>�</div>
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
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    api.get("/students").then(r => { setStudents(r.data); setLoading(false); })
      .catch(() => { setStudents(DEMO_STUDENTS); setLoading(false); });
  }, []);

  const openDetail = async (s) => {
    setSelected(s);
    setDetailLoading(true);
    try {
      const r = await api.get(`/students/${s.id}/progress`);
      setDetail(r.data);
    } catch { setDetail(null); }
    finally { setDetailLoading(false); }
  };

  if (loading) return <div style={{ color: T.text3 }}>Loading...</div>;

  if (selected) {
    return (
      <div>
        <button onClick={() => { setSelected(null); setDetail(null); }} style={{ background: "none", border: "none", color: T.primary, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0, fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", gap: 4 }}>← All Students</button>
        <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "22px 24px", marginBottom: 20, color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
          <Av name={selected.name} color={selected.avatar_color || T.primary} size={48} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{selected.name}</div>
            <div style={{ opacity: 0.8, fontSize: 13 }}>{selected.email}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
              <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>Progress: {selected.overall || 0}%</span>
              {selected.avg_score != null && <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>Avg: {selected.avg_score}%</span>}
            </div>
          </div>
        </div>
        {detailLoading ? <div style={{ color: T.text3, padding: 20 }}>Loading...</div> : detail && detail.modules.map(m => (
          <Card key={m.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{m.title}</div>
                <div style={{ color: T.text3, fontSize: 12 }}>{m.lessons?.length || 0} lessons · {m.progress || 0}% done</div>
              </div>
              <div style={{ width: 80 }}><Bar val={m.progress} color={T.primary} h={5} /></div>
            </div>
            {m.lessons?.map(l => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderTop: `1px solid ${T.border}` }}>
                <div>
                  <span style={{ color: T.text2, fontSize: 13 }}>{l.title}</span>
                  <Chip label={l.type} color={T.primary} />
                </div>
                {l.done ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: T.green, fontSize: 12, fontWeight: 600 }}>✓ Done</span>
                    {l.score != null && <Chip label={`${l.score}%`} color={l.score >= 80 ? T.green : l.score >= 60 ? T.amber : T.red} />}
                  </div>
                ) : <span style={{ color: T.text3, fontSize: 12 }}>Not started</span>}
              </div>
            ))}
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "22px 24px", marginBottom: 20, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Enrolled Students</div>
        <div style={{ fontWeight: 700, fontSize: 20 }}>{students.length} Students</div>
      </div>
      {students.map((s, i) => (
        <Card key={s.id || i} onClick={() => s.id && openDetail(s)} style={{ marginBottom: 10, display: "flex", gap: 14, alignItems: "center" }}>
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
          {s.avg_score != null && <Chip label={`${s.avg_score}%`} color={s.avg_score >= 80 ? T.green : s.avg_score >= 60 ? T.amber : T.red} />}
          <span style={{ color: T.text3, fontSize: 16 }}>›</span>
        </Card>
      ))}
    </div>
  );
}

function SubmissionsTab() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null);
  const [gradeVal, setGradeVal] = useState("");
  const [feedbackVal, setFeedbackVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = () => {
    api.get("/students/submissions/all").then(r => { setSubmissions(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const submitGrade = async () => {
    if (!grading) return;
    setSaving(true);
    try {
      await api.post(`/upload/grade/${grading.id}`, { grade: parseInt(gradeVal), feedback: feedbackVal });
      setSubmissions(ss => ss.map(s => s.id === grading.id ? { ...s, grade: parseInt(gradeVal), feedback: feedbackVal } : s));
      setGrading(null); setGradeVal(""); setFeedbackVal("");
    } catch { alert("Failed to save grade."); }
    finally { setSaving(false); }
  };

  const filtered = filter === "ungraded" ? submissions.filter(s => s.grade == null)
    : filter === "graded" ? submissions.filter(s => s.grade != null)
    : submissions;

  if (loading) return <div style={{ color: T.text3, padding: 20 }}>Loading submissions...</div>;

  return (
    <div>
      {grading && (
        <Modal onClose={() => { setGrading(null); setGradeVal(""); setFeedbackVal(""); }} title={`Grade: ${grading.student_name}`}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.text2, fontSize: 13, marginBottom: 6 }}>File: <strong>{grading.file_name}</strong></div>
            <div style={{ color: T.text3, fontSize: 12, marginBottom: 16 }}>Module: {grading.module_title} · Lesson: {grading.lesson_title}</div>
            <a href={`${process.env.REACT_APP_API_URL || '/api'}/upload/file/${grading.file_path}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: T.primary + "14", color: T.primary, border: `1px solid ${T.primary}33`, borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 20 }}>
              📎 Download File
            </a>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Grade (0–100)</div>
            <input type="number" min="0" max="100" value={gradeVal} onChange={e => setGradeVal(e.target.value)}
              placeholder="e.g. 85"
              style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Feedback</div>
            <textarea value={feedbackVal} onChange={e => setFeedbackVal(e.target.value)} rows={3}
              placeholder="Write feedback for the student..."
              style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          </div>
          <Btn onClick={submitGrade} color={T.green} disabled={saving || !gradeVal}>{saving ? "Saving..." : "Save Grade"}</Btn>
        </Modal>
      )}

      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "22px 24px", marginBottom: 20, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Assignment Grading</div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Student Submissions</div>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          {["all", "ungraded", "graded"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, padding: "5px 14px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", textTransform: "capitalize" }}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: T.text3 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div>No submissions yet.</div>
        </div>
      ) : filtered.map(s => (
        <Card key={s.id} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Av name={s.student_name} color={s.avatar_color || T.primary} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 2 }}>{s.student_name}</div>
              <div style={{ color: T.text3, fontSize: 12, marginBottom: 4 }}>{s.module_title} → {s.lesson_title}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: T.text2, fontSize: 12 }}>📄 {s.file_name}</span>
                <span style={{ color: T.text3, fontSize: 11 }}>{new Date(s.submitted_at).toLocaleDateString()}</span>
                {s.grade != null ? (
                  <Chip label={`${s.grade}%`} color={s.grade >= 80 ? T.green : s.grade >= 60 ? T.amber : T.red} />
                ) : <Chip label="Ungraded" color={T.amber} />}
              </div>
              {s.feedback && <div style={{ color: T.text2, fontSize: 12, marginTop: 6, fontStyle: "italic" }}>Feedback: {s.feedback}</div>}
            </div>
            <Btn onClick={() => { setGrading(s); setGradeVal(s.grade ?? ""); setFeedbackVal(s.feedback || ""); }} small color={s.grade != null ? T.text3 : T.primary} outline={s.grade != null}>
              {s.grade != null ? "Edit Grade" : "Grade"}
            </Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ResourcesTab({ isInstructor }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState("file");
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const load = () => {
    api.get("/resources").then(r => { setResources(r.data); setLoading(false); });
    api.get("/modules").then(r => setModules(r.data));
  };
  useEffect(() => { load(); }, []);

  const submitResource = async () => {
    setUploading(true);
    try {
      if (addType === "link") {
        await api.post("/resources/link", { ...form, type: form.linkType || "link" });
      } else {
        const fd = new FormData();
        if (file) fd.append("file", file);
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        fd.append("type", "file");
        await api.post("/resources", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      load();
      setShowAdd(false); setForm({}); setFile(null);
    } catch { alert("Failed to add resource."); }
    finally { setUploading(false); }
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    await api.delete(`/resources/${id}`);
    setResources(r => r.filter(x => x.id !== id));
  };

  const grouped = { reading: resources.filter(r => r.type === "reading" || r.type === "file"), links: resources.filter(r => r.type === "link") };

  if (loading) return <div style={{ color: T.text3, padding: 20 }}>Loading resources...</div>;

  return (
    <div>
      {showAdd && (
        <Modal onClose={() => { setShowAdd(false); setForm({}); setFile(null); }} title="Add Resource">
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["file", "link"].map(t => (
              <button key={t} onClick={() => setAddType(t)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${addType === t ? T.primary : T.border}`, background: addType === t ? "#eff6ff" : T.bg2, cursor: "pointer", fontSize: 12, fontWeight: 600, color: addType === t ? T.primary : T.text3, fontFamily: "'Inter',sans-serif" }}>
                {t === "file" ? "📎 Upload File" : "🔗 Add Link"}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Title</div>
            <input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Resource title" style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Module (optional)</div>
            <select value={form.module_id || ""} onChange={e => setForm(f => ({ ...f, module_id: e.target.value }))} style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }}>
              <option value="">All modules / General</option>
              {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>
          {addType === "link" ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>URL</div>
                <input value={form.url || ""} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Type</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["link", "reading"].map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, linkType: t }))} style={{ flex: 1, padding: "7px", borderRadius: 8, border: `1.5px solid ${form.linkType === t ? T.primary : T.border}`, background: form.linkType === t ? "#eff6ff" : T.bg2, cursor: "pointer", fontSize: 12, fontWeight: 600, color: form.linkType === t ? T.primary : T.text3, fontFamily: "'Inter',sans-serif" }}>
                      {t === "link" ? "🔗 Useful Link" : "📖 Reading"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${T.border2}`, borderRadius: 10, padding: "22px 20px", textAlign: "center", cursor: "pointer", background: T.bg2 }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
                <div style={{ color: T.text2, fontSize: 13 }}>{file ? file.name : "Click to select file (PDF, DOCX, PPTX...)"}  </div>
                <input ref={fileRef} type="file" style={{ display: "none" }} accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png,.zip" onChange={e => setFile(e.target.files[0])} />
              </div>
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Description (optional)</div>
            <input value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          </div>
          <Btn onClick={submitResource} color={T.green} disabled={uploading || !form.title}>{uploading ? "Uploading..." : "Add Resource"}</Btn>
        </Modal>
      )}

      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: 12, padding: "22px 24px", marginBottom: 20, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Course Materials</div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Resources & Links</div>
        <div style={{ opacity: 0.75, fontSize: 13 }}>Reading packs, useful links and study materials</div>
      </div>

      {isInstructor && (
        <div style={{ marginBottom: 20 }}><Btn onClick={() => setShowAdd(true)}>+ Add Resource</Btn></div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>📖 Reading Pack</div>
        {grouped.reading.length === 0 ? (
          <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px", textAlign: "center", color: T.text3, fontSize: 13 }}>
            No reading materials added yet.
          </div>
        ) : grouped.reading.map(r => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{r.title}</div>
              {r.description && <div style={{ color: T.text3, fontSize: 12, marginTop: 2 }}>{r.description}</div>}
              {r.module_title && <div style={{ color: T.text3, fontSize: 11, marginTop: 2 }}>Module: {r.module_title}</div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {r.file_path && (
                <a href={`${process.env.REACT_APP_API_URL || '/api'}/resources/file/${r.file_path}`} target="_blank" rel="noopener noreferrer" style={{ background: T.primary + "14", color: T.primary, border: `1px solid ${T.primary}33`, borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Download</a>
              )}
              {isInstructor && <button onClick={() => deleteResource(r.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 6, color: T.red, cursor: "pointer", padding: "5px 10px", fontSize: 12, fontFamily: "'Inter',sans-serif" }}>✕</button>}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>🔗 Useful Links</div>
        {grouped.links.length === 0 ? (
          <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "20px", textAlign: "center", color: T.text3, fontSize: 13 }}>
            No links added yet.
          </div>
        ) : grouped.links.map(r => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🔗</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{r.title}</div>
              {r.description && <div style={{ color: T.text3, fontSize: 12, marginTop: 2 }}>{r.description}</div>}
              {r.module_title && <div style={{ color: T.text3, fontSize: 11, marginTop: 2 }}>Module: {r.module_title}</div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ background: T.green + "14", color: T.green, border: `1px solid ${T.green}33`, borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>Open →</a>
              )}
              {isInstructor && <button onClick={() => deleteResource(r.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 6, color: T.red, cursor: "pointer", padding: "5px 10px", fontSize: 12, fontFamily: "'Inter',sans-serif" }}>✕</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatingLetters() {
  const letters = [
    { char: "A", top: "12%", left: "6%", size: 52, color: "rgba(255,255,255,0.18)", anim: "floatA", dur: "4s" },
    { char: "B", top: "55%", left: "3%", size: 36, color: "rgba(255,255,255,0.12)", anim: "floatB", dur: "5.5s" },
    { char: "C", top: "25%", right: "5%", size: 44, color: "rgba(255,255,255,0.14)", anim: "floatC", dur: "3.8s" },
    { char: "Z", top: "65%", right: "8%", size: 30, color: "rgba(255,255,255,0.10)", anim: "floatD", dur: "6s" },
    { char: "✦", top: "38%", left: "88%", size: 22, color: "rgba(255,255,255,0.20)", anim: "floatA", dur: "4.5s" },
    { char: "✦", top: "78%", left: "18%", size: 18, color: "rgba(255,255,255,0.15)", anim: "floatB", dur: "3.2s" },
  ];
  return (
    <>
      {letters.map((l, i) => (
        <div key={i} style={{ position: "absolute", top: l.top, left: l.left, right: l.right, fontSize: l.size, color: l.color, fontWeight: 900, fontFamily: "'Nunito',sans-serif", animation: `${l.anim} ${l.dur} ease-in-out infinite`, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>{l.char}</div>
      ))}
    </>
  );
}

function HomeTab({ isInstructor }) {
  const [modules, setModules] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [annForm, setAnnForm] = useState({});
  const { user } = useAuth();

  const loadAnnouncements = () => api.get("/announcements").then(r => setAnnouncements(r.data));

  useEffect(() => {
    api.get("/modules").then(r => setModules(r.data));
    loadAnnouncements();
  }, []);

  const postAnnouncement = async () => {
    if (!annForm.title) return;
    await api.post("/announcements", annForm);
    loadAnnouncements();
    setShowAnnounce(false); setAnnForm({});
  };

  const deleteAnnouncement = async (id) => {
    await api.delete(`/announcements/${id}`);
    setAnnouncements(a => a.filter(x => x.id !== id));
  };
  const overall = modules.length ? Math.round(modules.reduce((a, m) => a + (m.progress || 0), 0) / modules.length) : 0;
  const completed = modules.filter(m => m.progress === 100).length;
  const inProgress = modules.filter(m => m.progress > 0 && m.progress < 100).length;

  const STAT_CARDS = [
    { label: "Total Modules", value: modules.length, color: T.primary, bg: "#eff6ff", icon: "📚", delay: "0s" },
    { label: "Completed", value: completed, color: T.green, bg: "#f0fdf4", icon: "✅", delay: "0.1s" },
    { label: "In Progress", value: inProgress, color: T.amber, bg: "#fffbeb", icon: "⚡", delay: "0.2s" },
  ];

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>

      {/* Hero Banner */}
      <div style={{ position: "relative", background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%)", borderRadius: 18, padding: "32px 28px", marginBottom: 24, color: "#fff", overflow: "hidden", boxShadow: "0 12px 40px rgba(37,99,235,0.35)" }}>
        <FloatingLetters />
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, right: 80, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 20, right: 120, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 11, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Welcome back</span>
            <span style={{ fontSize: 14, animation: "pulse 2s ease-in-out infinite" }}>👋</span>
          </div>
          <div style={{ fontWeight: 900, fontSize: 28, fontFamily: "'Nunito',sans-serif", marginBottom: 4, letterSpacing: "-0.02em" }}>
            {user?.name?.split(" ")[0] || "Learner"}
          </div>
          <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 14 }}>🇬🇧 PC 101 Professional Communication for Teachers</div>

          {/* Course Description */}
          <div style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7, marginBottom: 7 }}>Course Description</div>
            <div style={{ fontSize: 13, lineHeight: 1.65, opacity: 0.92 }}>
              The PC 101 Professional Communication for Teachers course is designed to enhance the communication skills of educators in various professional contexts. The program consists of four modules that build upon each other, focusing on the foundations of professional communication, enhancing language skills, mastering teaching knowledge, and applying these skills in real-world teaching scenarios. Students will engage in interactive lessons that develop their ability to communicate effectively with colleagues, students, and parents, ensuring they are well-prepared for diverse educational environments.
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, opacity: 0.9, fontWeight: 600 }}>Overall Course Progress</span>
            <span style={{ fontSize: 16, fontWeight: 800 }}>{overall}%</span>
          </div>
          <div style={{ height: 10, background: "rgba(255,255,255,0.2)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${overall}%`, background: "linear-gradient(90deg, #a5f3fc, #ffffff)", borderRadius: 99, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 12px rgba(255,255,255,0.6)" }} />
          </div>
          {/* English decorations row */}
          <div style={{ display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
            {["📖 Grammar", "🎧 Listening", "✍️ Writing", "🗣️ Speaking"].map(tag => (
              <span key={tag} style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {STAT_CARDS.map((s, i) => (
          <div key={s.label} className="stat-card" style={{ background: s.bg, border: `1.5px solid ${s.color}22`, borderRadius: 14, padding: "18px 16px", textAlign: "center", transition: "all .25s ease", animation: `countUp .5s ease ${s.delay} both`, boxShadow: `0 4px 16px ${s.color}14`, cursor: "default" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4, fontFamily: "'Nunito',sans-serif" }}>{s.value}</div>
            <div style={{ color: T.text3, fontSize: 12, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Word of the Day — rotates daily */}
      {(() => {
        const WORDS = [
          { word: "Perseverance", def: "The quality of continuing to try despite difficulties." },
          { word: "Articulate", def: "Able to express thoughts and ideas clearly and effectively." },
          { word: "Pedagogy", def: "The method and practice of teaching as an academic subject." },
          { word: "Eloquent", def: "Fluent and persuasive in speaking or writing." },
          { word: "Curriculum", def: "The subjects comprising a course of study in a school." },
          { word: "Proficiency", def: "A high degree of competence or skill in a language." },
          { word: "Intonation", def: "The rise and fall of the voice in speaking." },
          { word: "Coherence", def: "The quality of being logical and consistent in communication." },
          { word: "Enunciate", def: "To say or pronounce words clearly and distinctly." },
          { word: "Empathy", def: "The ability to understand and share the feelings of another." },
          { word: "Syntax", def: "The arrangement of words and phrases to create sentences." },
          { word: "Pragmatics", def: "How context influences the interpretation of meaning." },
          { word: "Vocabulary", def: "The body of words used in a particular language or subject." },
          { word: "Fluency", def: "The ability to speak a language easily, accurately, and quickly." },
          { word: "Assertive", def: "Confident and direct in claiming one's rights or views." },
          { word: "Intercultural", def: "Relating to communication between different cultures." },
          { word: "Didactic", def: "Intended to teach, especially with moral instruction." },
          { word: "Register", def: "The level of formality in language use for a given situation." },
          { word: "Feedback", def: "Information given to help improve performance or understanding." },
          { word: "Collaboration", def: "Working jointly with others toward a common goal." },
          { word: "Nuance", def: "A subtle difference in meaning, expression, or tone." },
          { word: "Comprehension", def: "The ability to understand something fully." },
          { word: "Rhetoric", def: "The art of effective or persuasive speaking and writing." },
          { word: "Discourse", def: "Written or spoken communication or debate on a subject." },
          { word: "Motivation", def: "The desire or willingness to do something; enthusiasm." },
          { word: "Facilitation", def: "The act of making a process easier or helping it run smoothly." },
          { word: "Phonetics", def: "The study of the sounds of human speech." },
          { word: "Scaffolding", def: "Temporary support given to students to help them learn." },
          { word: "Assessment", def: "The evaluation of a student's work or performance." },
          { word: "Innovation", def: "The introduction of new ideas, methods, or approaches." },
        ];
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const w = WORDS[dayOfYear % WORDS.length];
        return (
          <div style={{ background: "linear-gradient(135deg, #fef3c7, #fff7ed)", border: "1.5px solid #fde68a", borderRadius: 14, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>💡</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 3 }}>Word of the Day</div>
              <div style={{ color: "#78350f", fontSize: 15, fontStyle: "italic", fontWeight: 700 }}>"{w.word}"</div>
              <div style={{ color: "#a16207", fontSize: 12, marginTop: 3 }}>{w.def}</div>
            </div>
            <div style={{ color: "#d97706", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", alignSelf: "flex-start" }}>
              {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </div>
          </div>
        );
      })()}

      {/* My Modules */}
      <div style={{ fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>📚 My Modules</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 12, marginBottom: 24 }}>
        {modules.map((m, idx) => {
          const palettes = [
            ["#2563eb","#7c3aed"], ["#0891b2","#2563eb"], ["#7c3aed","#db2777"], ["#16a34a","#0891b2"]
          ];
          const [c1, c2] = palettes[idx % palettes.length];
          const icons = ["📖", "🎧", "✍️", "🗣️", "📝", "🌍"];
          return (
            <div key={m.id} className="module-card" style={{ background: T.bg1, borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}`, transition: "all .25s ease", animation: `fadeUp .4s ease ${idx * 0.08}s both`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ height: 72, background: `linear-gradient(135deg, ${c1}, ${c2})`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -15, right: -15, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                <span style={{ fontSize: 24 }}>{icons[idx % icons.length]}</span>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{m.title?.split(":")[0] || m.title}</span>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: T.text3, fontSize: 11 }}>Progress</span>
                  <span style={{ color: c1, fontSize: 11, fontWeight: 700 }}>{m.progress || 0}%</span>
                </div>
                <div style={{ height: 5, background: T.bg3, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.progress || 0}%`, background: `linear-gradient(90deg, ${c1}, ${c2})`, borderRadius: 99, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
                </div>
                <div style={{ color: T.text3, fontSize: 11, marginTop: 6 }}>{m.lesson_count || 0} lessons</div>
              </div>
            </div>
          );
        })}
        {modules.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "32px 20px", color: T.text3 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No modules yet</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Your instructor will add course modules soon.</div>
          </div>
        )}
      </div>

      {showAnnounce && (
        <Modal onClose={() => { setShowAnnounce(false); setAnnForm({}); }} title="New Announcement">
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Title</div>
            <input value={annForm.title || ""} onChange={e => setAnnForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Message</div>
            <textarea value={annForm.body || ""} onChange={e => setAnnForm(f => ({ ...f, body: e.target.value }))} rows={3} placeholder="Write your announcement..." style={{ width: "100%", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: T.text2, fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Type</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["info", "event", "new"].map(t => (
                <button key={t} onClick={() => setAnnForm(f => ({ ...f, type: t }))} style={{ flex: 1, padding: "7px", borderRadius: 8, border: `1.5px solid ${annForm.type === t ? T.primary : T.border}`, background: annForm.type === t ? "#eff6ff" : T.bg2, cursor: "pointer", fontSize: 11, fontWeight: 600, color: annForm.type === t ? T.primary : T.text3, fontFamily: "'Inter',sans-serif" }}>
                  {t === "info" ? "ℹ️ Info" : t === "event" ? "📅 Event" : "🆕 New"}
                </button>
              ))}
            </div>
          </div>
          <Btn onClick={postAnnouncement} color={T.green} disabled={!annForm.title}>Post Announcement</Btn>
        </Modal>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: T.text }}>Announcements</div>
        {isInstructor && <Btn onClick={() => setShowAnnounce(true)} small>+ Announce</Btn>}
      </div>
      {announcements.length === 0 && <div style={{ color: T.text3, fontSize: 13, marginBottom: 20 }}>No announcements yet.</div>}
      {announcements.map(a => (
        <Card key={a.id} style={{ marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
            {a.type === "info" ? "ℹ️" : a.type === "event" ? "📅" : "🆕"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: T.text, marginBottom: 3 }}>{a.title}</div>
            <div style={{ color: T.text2, fontSize: 12, lineHeight: 1.5 }}>{a.body}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div style={{ color: T.text3, fontSize: 11, whiteSpace: "nowrap" }}>{new Date(a.created_at).toLocaleDateString()}</div>
            {isInstructor && <button onClick={() => deleteAnnouncement(a.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 6, color: T.red, cursor: "pointer", padding: "3px 8px", fontSize: 11, fontFamily: "'Inter',sans-serif" }}>✕</button>}
          </div>
        </Card>
      ))}

      {/* English course illustrations — visible in free space at bottom */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 24 }}>

        {/* Card 1 — Skills illustration */}
        <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #0f1f3d 0%, #1a3a6e 50%, #2d1b69 100%)", padding: "20px", display: "flex", gap: 16, alignItems: "center", boxShadow: "0 4px 20px rgba(37,99,235,0.18)" }}>
          <svg width="130" height="130" viewBox="0 0 260 260" fill="none" style={{ flexShrink: 0 }}>
            {/* Open book */}
            <rect x="20" y="100" width="220" height="145" rx="8" fill="#2563eb"/>
            <rect x="20" y="100" width="108" height="145" rx="8" fill="#1d3a8a"/>
            <line x1="130" y1="100" x2="130" y2="245" stroke="#fff" strokeWidth="3" opacity="0.4"/>
            <text x="74" y="178" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Georgia,serif">I ♥</text>
            <text x="74" y="196" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Georgia,serif">English</text>
            <text x="185" y="178" textAnchor="middle" fill="white" fontSize="11" fontFamily="Georgia,serif">READING</text>
            {/* Headphones */}
            <path d="M85 72 Q85 40 130 40 Q175 40 175 72" stroke="#e53e3e" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <rect x="72" y="70" width="18" height="28" rx="8" fill="#e53e3e"/>
            <rect x="170" y="70" width="18" height="28" rx="8" fill="#e53e3e"/>
            {/* Listening bubble */}
            <ellipse cx="130" cy="105" rx="48" ry="16" fill="#f6ad2b"/>
            <text x="130" y="110" textAnchor="middle" fill="#1a1f3a" fontSize="11" fontWeight="bold" fontFamily="'Nunito',sans-serif">Listening</text>
            {/* UK flag mini */}
            <rect x="152" y="106" width="30" height="18" rx="2" fill="#012169"/>
            <line x1="152" y1="106" x2="182" y2="124" stroke="white" strokeWidth="2.5"/>
            <line x1="182" y1="106" x2="152" y2="124" stroke="white" strokeWidth="2.5"/>
            <line x1="167" y1="106" x2="167" y2="124" stroke="white" strokeWidth="3.5"/>
            <line x1="152" y1="115" x2="182" y2="115" stroke="white" strokeWidth="3.5"/>
            <line x1="152" y1="106" x2="182" y2="124" stroke="#c8102e" strokeWidth="1.5"/>
            <line x1="182" y1="106" x2="152" y2="124" stroke="#c8102e" strokeWidth="1.5"/>
            <line x1="167" y1="106" x2="167" y2="124" stroke="#c8102e" strokeWidth="2"/>
            <line x1="152" y1="115" x2="182" y2="115" stroke="#c8102e" strokeWidth="2"/>
            {/* Speaking bubble */}
            <ellipse cx="52" cy="82" rx="38" ry="18" fill="#e53e3e" opacity="0.9"/>
            <text x="52" y="87" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="'Nunito',sans-serif">Speaking</text>
            <polygon points="58,99 72,110 50,106" fill="#e53e3e" opacity="0.9"/>
            {/* Writing bubble */}
            <ellipse cx="210" cy="88" rx="38" ry="18" fill="#f6ad2b" opacity="0.9"/>
            <text x="210" y="93" textAnchor="middle" fill="#1a1f3a" fontSize="10" fontWeight="bold" fontFamily="'Nunito',sans-serif">Writing</text>
            {/* Grammar pills */}
            <ellipse cx="40" cy="30" rx="18" ry="11" fill="white" opacity="0.25"/>
            <text x="40" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Am</text>
            <ellipse cx="80" cy="22" rx="13" ry="10" fill="white" opacity="0.18"/>
            <text x="80" y="27" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Is</text>
            <ellipse cx="120" cy="28" rx="20" ry="11" fill="#e53e3e" opacity="0.75"/>
            <text x="120" y="33" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Are</text>
            {/* Grad cap */}
            <polygon points="200,18 168,34 200,46 232,34" fill="#1d3a8a"/>
            <rect x="192" y="16" width="16" height="5" rx="2" fill="#0f1f3d"/>
            <line x1="232" y1="34" x2="236" y2="52" stroke="#f6ad2b" strokeWidth="3"/>
            <circle cx="236" cy="55" r="5" fill="#f6ad2b"/>
            {/* Stars */}
            <text x="22" y="20" fontSize="14" fill="#f6ad2b">✦</text>
            <text x="230" y="72" fontSize="12" fill="#f6ad2b">✦</text>
            <text x="145" y="16" fontSize="10" fill="white" opacity="0.6">✦</text>
          </svg>
          <div>
            <div style={{ color: "#f6ad2b", fontWeight: 800, fontSize: 13, fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>🇬🇧 English Skills</div>
            {["📖 Grammar", "🎧 Listening", "✍️ Writing", "🗣️ Speaking"].map(s => (
              <div key={s} style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f6ad2b", display: "inline-block", flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Card 2 — Book + headphones illustration */}
        <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, #fef9f0 0%, #fff7ed 100%)", border: "1.5px solid #fde68a", padding: "20px", display: "flex", gap: 16, alignItems: "center", boxShadow: "0 4px 20px rgba(246,173,43,0.12)" }}>
          <svg width="130" height="130" viewBox="0 0 260 260" fill="none" style={{ flexShrink: 0 }}>
            {/* Stacked book behind */}
            <rect x="15" y="50" width="90" height="130" rx="6" fill="#1d3a8a" opacity="0.9"/>
            <rect x="19" y="54" width="82" height="122" rx="4" fill="#2563eb" opacity="0.5"/>
            <text x="60" y="108" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Georgia,serif">ENGLISH</text>
            <text x="60" y="122" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Georgia,serif">COURSE</text>
            {/* Open book */}
            <rect x="55" y="130" width="190" height="110" rx="8" fill="#f0f4ff"/>
            <rect x="55" y="130" width="93" height="110" rx="8" fill="#e8eeff"/>
            <line x1="149" y1="130" x2="149" y2="240" stroke="#c8d2f5" strokeWidth="2"/>
            <line x1="67" y1="155" x2="137" y2="155" stroke="#c8d2f5" strokeWidth="1.5"/>
            <line x1="67" y1="168" x2="137" y2="168" stroke="#c8d2f5" strokeWidth="1.5"/>
            <line x1="67" y1="181" x2="137" y2="181" stroke="#c8d2f5" strokeWidth="1.5"/>
            <line x1="67" y1="194" x2="117" y2="194" stroke="#c8d2f5" strokeWidth="1.5"/>
            {/* UK map shape on right page */}
            <ellipse cx="196" cy="188" rx="30" ry="36" fill="#f6ad2b" opacity="0.55"/>
            <text x="196" y="193" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="bold">UK</text>
            {/* Headphones over book */}
            <path d="M128 240 Q128 258 155 262 Q182 258 182 240" stroke="#e53e3e" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <rect x="118" y="238" width="14" height="22" rx="7" fill="#e53e3e"/>
            <rect x="182" y="238" width="14" height="22" rx="7" fill="#e53e3e"/>
            {/* Notebook */}
            <rect x="8" y="185" width="65" height="70" rx="4" fill="white" opacity="0.9"/>
            <rect x="8" y="185" width="6" height="70" rx="2" fill="#2563eb" opacity="0.4"/>
            <line x1="20" y1="200" x2="66" y2="200" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="20" y1="212" x2="66" y2="212" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="20" y1="224" x2="66" y2="224" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="20" y1="236" x2="52" y2="236" stroke="#cbd5e1" strokeWidth="1.5"/>
            {/* Pen */}
            <rect x="3" y="242" width="6" height="46" rx="3" fill="#2563eb" transform="rotate(-18,6,265)" opacity="0.8"/>
            <polygon points="3,285 9,285 6,295" fill="#e8eeff" transform="rotate(-18,6,285)" opacity="0.8"/>
            {/* Flowers */}
            <text x="195" y="60" fontSize="20" fill="#f6ad2b" opacity="0.7">✿</text>
            <text x="30" y="175" fontSize="14" fill="#86efac" opacity="0.8">✿</text>
            <text x="228" y="140" fontSize="13" fill="#86efac" opacity="0.7">🌿</text>
            <text x="110" y="48" fontSize="16" fill="#f6ad2b" opacity="0.65">✦</text>
            <text x="48" y="65" fontSize="12" fill="#f6ad2b" opacity="0.55">✦</text>
          </svg>
          <div>
            <div style={{ color: "#92400e", fontWeight: 800, fontSize: 13, fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>📚 Course Materials</div>
            {["Do you speak English?", "Read · Write · Listen", "British English focus", "Professional context"].map(s => (
              <div key={s} style={{ color: "#78350f", fontSize: 12, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f6ad2b", display: "inline-block", flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
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
    { id: "resources", icon: "📂", label: "Resources" },
    ...(!isInstructor ? [{ id: "grades", icon: "🎓", label: "Grades" }] : []),
    { id: "chat", icon: "💬", label: "Chat" },
    { id: "forum", icon: "◆", label: "Forum" },
    ...(isInstructor ? [
      { id: "students", icon: "👥", label: "Students" },
      { id: "submissions", icon: "📝", label: "Submissions" },
    ] : []),
  ];

  const TITLES = { home: "Dashboard", course: "Course Navigation", modules: "My Modules", grades: "Grades", chat: "Group Chat", forum: "Forum", students: "Students", submissions: "Student Submissions", resources: "Resources & Links" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        html,body { background: #f0f4ff; font-family: 'Inter', sans-serif; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(-8deg);} 50%{transform:translateY(-14px) rotate(-4deg);} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(12deg);} 50%{transform:translateY(-18px) rotate(8deg);} }
        @keyframes floatC { 0%,100%{transform:translateY(0) rotate(3deg);} 50%{transform:translateY(-10px) rotate(7deg);} }
        @keyframes floatD { 0%,100%{transform:translateY(0) rotate(-15deg);} 50%{transform:translateY(-12px) rotate(-10deg);} }
        @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes countUp { from{opacity:0;transform:scale(0.5);} to{opacity:1;transform:scale(1);} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes progressFill { from{width:0%} to{width:var(--target-width)} }
        .nav-btn:hover { background: #eff6ff !important; color: #2563eb !important; transform: translateX(3px); }
        .stat-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 32px rgba(37,99,235,0.15) !important; }
        .module-card:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 24px rgba(37,99,235,0.12) !important; }
      `}</style>
      <div style={{ display: "flex", height: "100vh", background: T.bg, position: "relative", overflow: "hidden" }}>

        <div style={{ width: sidebarOpen ? 220 : 60, background: T.bg1, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", transition: "width .25s ease", overflow: "hidden", flexShrink: 0, boxShadow: "2px 0 8px rgba(0,0,0,0.04)", position: "relative", zIndex: 3 }}>
          <div style={{ padding: "18px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: "#fff", boxShadow: "0 4px 12px rgba(37,99,235,0.35)", animation: "pulse 3s ease-in-out infinite" }}>🎓</div>
            {sidebarOpen && <span style={{ fontWeight: 900, fontSize: 16, color: T.text, whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif", background: "linear-gradient(135deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LearnFlow</span>}
            <button onClick={() => setSidebarOpen(o => !o)} style={{ marginLeft: "auto", background: T.bg3, border: "none", borderRadius: 6, color: T.text3, cursor: "pointer", width: 26, height: 26, flexShrink: 0, fontSize: 12 }}>
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>
          <nav style={{ padding: "10px 8px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((n, i) => (
              <button key={n.id} onClick={() => setTab(n.id)} className="nav-btn" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer", background: tab === n.id ? "linear-gradient(135deg, #eff6ff, #e0e7ff)" : "transparent", color: tab === n.id ? T.primary : T.text3, fontSize: 13, fontWeight: tab === n.id ? 700 : 500, transition: "all .2s", whiteSpace: "nowrap", overflow: "hidden", textAlign: "left", width: "100%", fontFamily: "'Inter',sans-serif", animation: `slideRight .3s ease ${i * 0.05}s both`, borderLeft: tab === n.id ? `3px solid ${T.primary}` : "3px solid transparent" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "linear-gradient(180deg, #f0f4ff 0%, #f8fafc 100%)", position: "relative", zIndex: 3 }}>
          <div style={{ padding: "12px 24px", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{NAV.find(n => n.id === tab)?.icon || "⊞"}</span>
              <div style={{ fontWeight: 700, fontSize: 18, color: T.text }}>{TITLES[tab]}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, animation: "pulse 3s ease-in-out infinite" }}>🇬🇧</span>
              <Chip label={isInstructor ? "Instructor" : "Student"} color={isInstructor ? T.amber : T.primary} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 24, animation: "fadeUp .2s ease" }} key={tab}>
            {tab === "home" && <HomeTab isInstructor={isInstructor} />}
            {tab === "course" && <CourseNavTab isInstructor={isInstructor} />}
            {tab === "modules" && <ModulesTab isInstructor={isInstructor} />}
            {tab === "resources" && <ResourcesTab isInstructor={isInstructor} />}
            {tab === "grades" && !isInstructor && <GradesTab user={user} />}
            {tab === "chat" && <ChatTab user={user} />}
            {tab === "forum" && <ForumTab user={user} />}
            {tab === "students" && isInstructor && <StudentsTab />}
            {tab === "submissions" && isInstructor && <SubmissionsTab />}
          </div>
        </div>
      </div>
    </>
  );
}