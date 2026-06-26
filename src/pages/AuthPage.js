import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const T = {
  bg: '#f0f4ff', bg1: '#ffffff', bg2: '#f7f9ff',
  border: '#e2e8ff', border2: '#c8d2f5',
  text: '#1a1f3a', text2: '#4a5080', text3: '#8890b8',
  purple: '#6c5ce7', purpleL: '#a29bfe',
  green: '#00b894', red: '#e17055', amber: '#fdcb6e',
};

const INSTRUCTOR_CODE = "teacher2024";

function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter (A-Z)");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter (a-z)");
  if (!/[0-9]/.test(password)) errors.push("At least one number (0-9)");
  return errors;
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const errors = validatePassword(password);
  const strength = 4 - errors.length;
  const colors = ['#e17055', '#e17055', '#fdcb6e', '#00b894', '#00b894'];

  return (
    <div style={{ marginTop: 8, marginBottom: 4 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < strength ? colors[strength] : T.border, transition: 'background 0.3s' }} />
        ))}
      </div>
      {strength < 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {errors.map((e, i) => (
            <div key={i} style={{ color: T.red, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>✕</span> {e}
            </div>
          ))}
        </div>
      )}
      {strength === 4 && <div style={{ color: T.green, fontSize: 11 }}>✓ Strong password</div>}
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [instructorCode, setInstructorCode] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const clearError = useCallback((key) => {
    setErrors(e => ({ ...e, [key]: '', general: '' }));
  }, []);

  const switchMode = useCallback((m) => {
    setMode(m);
    setErrors({});
    setName(''); setEmail(''); setPassword('');
    setConfirmPassword(''); setRole('student'); setInstructorCode('');
  }, []);

  const validate = () => {
    const errs = {};
    if (mode === 'register') {
      if (!name.trim()) errs.name = 'Name is required';
      else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
      const passErrors = validatePassword(password);
      if (passErrors.length > 0) errs.password = passErrors[0];
      if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
      if (role === 'instructor') {
        if (!instructorCode) errs.instructorCode = 'Instructor code is required';
        else if (instructorCode !== INSTRUCTOR_CODE) errs.instructorCode = 'Invalid instructor code';
      }
    }
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      if (msg.includes('password') || msg.includes('Invalid')) {
        setErrors({ general: 'Incorrect email or password. Please try again.' });
      } else if (msg.includes('Email already')) {
        setErrors({ email: 'This email is already registered. Try signing in.' });
      } else if (msg.includes('not found') || msg.includes('No user')) {
        setErrors({ general: 'No account found with this email. Please register first.' });
      } else {
        setErrors({ general: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const floaters = [
    { ch: 'A', x: '5%',  y: '12%', size: 52, op: 0.13, rot: -15 },
    { ch: 'B', x: '88%', y: '8%',  size: 40, op: 0.10, rot: 12  },
    { ch: '英', x: '92%', y: '55%', size: 46, op: 0.09, rot: 8   },
    { ch: 'Z', x: '3%',  y: '72%', size: 38, op: 0.10, rot: -10 },
    { ch: '?', x: '78%', y: '82%', size: 44, op: 0.09, rot: 20  },
    { ch: 'E', x: '18%', y: '88%', size: 36, op: 0.10, rot: -8  },
    { ch: '!', x: '50%', y: '6%',  size: 42, op: 0.08, rot: 5   },
    { ch: 'α', x: '60%', y: '90%', size: 38, op: 0.09, rot: -12 },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Nunito', sans-serif", overflow: 'hidden' }}>

      {/* Rich background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0,
        background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3a6e 30%, #2d1b69 65%, #1e0a3c 100%)' }} />

      {/* Radial glow blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%',  width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,92,231,0.35) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,107,200,0.30) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%',   width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(253,121,168,0.12) 0%, transparent 70%)' }} />
      </div>

      {/* Floating letters */}
      {floaters.map((f, i) => (
        <div key={i} style={{ position: 'fixed', left: f.x, top: f.y, fontSize: f.size, color: '#fff', opacity: f.op, transform: `rotate(${f.rot}deg)`, zIndex: 1, fontWeight: 900, fontFamily: 'Georgia, serif', pointerEvents: 'none', userSelect: 'none',
          animation: `float${i % 3} ${5 + i}s ease-in-out infinite` }}>
          {f.ch}
        </div>
      ))}

      {/* LEFT PANEL — English course illustration */}
      <div style={{ position: 'fixed', left: 0, bottom: 0, width: 320, height: '100vh', zIndex: 1, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 0 20px 20px' }}>
        <svg width="300" height="420" viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.82 }}>
          {/* Open book */}
          <rect x="40" y="200" width="220" height="160" rx="8" fill="#1d3a8a" opacity="0.9"/>
          <rect x="40" y="200" width="108" height="160" rx="8" fill="#2952cc" opacity="0.9"/>
          <rect x="148" y="200" width="112" height="160" rx="8" fill="#3b6fd4" opacity="0.9"/>
          <line x1="150" y1="200" x2="150" y2="360" stroke="#fff" strokeWidth="3" opacity="0.4"/>
          {/* Book spine label */}
          <text x="85" y="290" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Georgia,serif" opacity="0.9">ENGLISH</text>
          <text x="85" y="305" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Georgia,serif" opacity="0.9">COURSE</text>
          {/* Right page text */}
          <text x="205" y="260" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Georgia,serif" opacity="0.8">DO YOU</text>
          <text x="205" y="275" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Georgia,serif" opacity="0.8">SPEAK</text>
          <text x="205" y="290" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Georgia,serif" opacity="0.8">ENGLISH?</text>
          {/* UK flag mini on book */}
          <rect x="165" y="208" width="32" height="20" rx="2" fill="#012169"/>
          <line x1="165" y1="208" x2="197" y2="228" stroke="white" strokeWidth="3"/>
          <line x1="197" y1="208" x2="165" y2="228" stroke="white" strokeWidth="3"/>
          <line x1="181" y1="208" x2="181" y2="228" stroke="white" strokeWidth="4"/>
          <line x1="165" y1="218" x2="197" y2="218" stroke="white" strokeWidth="4"/>
          <line x1="165" y1="208" x2="197" y2="228" stroke="#c8102e" strokeWidth="1.5"/>
          <line x1="197" y1="208" x2="165" y2="228" stroke="#c8102e" strokeWidth="1.5"/>
          <line x1="181" y1="208" x2="181" y2="228" stroke="#c8102e" strokeWidth="2.5"/>
          <line x1="165" y1="218" x2="197" y2="218" stroke="#c8102e" strokeWidth="2.5"/>
          {/* Headphones */}
          <path d="M100 140 Q100 100 150 100 Q200 100 200 140" stroke="#e53e3e" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <rect x="86" y="138" width="18" height="28" rx="8" fill="#e53e3e"/>
          <rect x="196" y="138" width="18" height="28" rx="8" fill="#e53e3e"/>
          {/* Listening bubble */}
          <ellipse cx="150" cy="175" rx="52" ry="18" fill="#f6ad2b" opacity="0.92"/>
          <text x="150" y="180" textAnchor="middle" fill="#1a1f3a" fontSize="12" fontWeight="bold" fontFamily="'Nunito',sans-serif">Listening</text>
          {/* Speech bubble - Speaking */}
          <ellipse cx="62" cy="145" rx="42" ry="20" fill="#e53e3e" opacity="0.85"/>
          <text x="62" y="150" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="'Nunito',sans-serif">Speaking</text>
          <polygon points="70,163 85,175 60,170" fill="#e53e3e" opacity="0.85"/>
          {/* Writing bubble */}
          <ellipse cx="240" cy="155" rx="40" ry="18" fill="#f6ad2b" opacity="0.85"/>
          <text x="240" y="160" textAnchor="middle" fill="#1a1f3a" fontSize="11" fontWeight="bold" fontFamily="'Nunito',sans-serif">Writing</text>
          {/* Pencil */}
          <rect x="215" y="160" width="10" height="50" rx="2" fill="#2952cc" transform="rotate(35,220,185)"/>
          <polygon points="215,210 225,210 220,225" fill="#f6ad2b" transform="rotate(35,220,210)"/>
          {/* Grammar pills */}
          <ellipse cx="50" cy="80" rx="18" ry="12" fill="white" opacity="0.15"/>
          <text x="50" y="85" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="'Nunito',sans-serif">Am</text>
          <ellipse cx="88" cy="72" rx="14" ry="11" fill="white" opacity="0.10"/>
          <text x="88" y="77" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="'Nunito',sans-serif">Is</text>
          <ellipse cx="125" cy="78" rx="20" ry="12" fill="#e53e3e" opacity="0.7"/>
          <text x="125" y="83" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="'Nunito',sans-serif">Are</text>
          {/* Grad cap */}
          <polygon points="150,40 110,60 150,75 190,60" fill="#1d3a8a" opacity="0.85"/>
          <rect x="140" y="38" width="20" height="6" rx="2" fill="#1d3a8a" opacity="0.85"/>
          <line x1="190" y1="60" x2="195" y2="80" stroke="#f6ad2b" strokeWidth="3"/>
          <circle cx="195" cy="83" r="5" fill="#f6ad2b"/>
          {/* Stars */}
          <text x="30" y="60" fontSize="14" fill="#f6ad2b" opacity="0.7">✦</text>
          <text x="260" y="90" fontSize="12" fill="#f6ad2b" opacity="0.6">✦</text>
          <text x="240" y="50" fontSize="10" fill="white" opacity="0.5">✦</text>
          {/* Do / Does / Did */}
          <ellipse cx="155" cy="395" rx="18" ry="12" fill="white" opacity="0.12"/>
          <text x="155" y="399" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="'Nunito',sans-serif">Do</text>
          <ellipse cx="200" cy="390" rx="22" ry="12" fill="white" opacity="0.10"/>
          <text x="200" y="395" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="'Nunito',sans-serif">Does</text>
          <ellipse cx="248" cy="395" rx="18" ry="12" fill="#e53e3e" opacity="0.6"/>
          <text x="248" y="399" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="'Nunito',sans-serif">Did</text>
        </svg>
      </div>

      {/* RIGHT PANEL — book + headphones illustration */}
      <div style={{ position: 'fixed', right: 0, top: 0, width: 280, height: '100vh', zIndex: 1, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 16px 0 0' }}>
        <svg width="260" height="380" viewBox="0 0 260 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.78 }}>
          {/* Stacked books */}
          <rect x="20" y="80" width="90" height="130" rx="6" fill="#1d3a8a" opacity="0.9"/>
          <rect x="24" y="84" width="82" height="122" rx="4" fill="#2952cc" opacity="0.6"/>
          <text x="65" y="135" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Georgia,serif">ENGLISH</text>
          <text x="65" y="150" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Georgia,serif">COURSE</text>
          {/* Open book */}
          <rect x="60" y="160" width="180" height="140" rx="8" fill="#f0f4ff" opacity="0.92"/>
          <rect x="60" y="160" width="88" height="140" rx="8" fill="#e8eeff" opacity="0.95"/>
          <line x1="150" y1="160" x2="150" y2="300" stroke="#c8d2f5" strokeWidth="2"/>
          {/* Lines on left page */}
          <line x1="72" y1="190" x2="138" y2="190" stroke="#c8d2f5" strokeWidth="1.5"/>
          <line x1="72" y1="203" x2="138" y2="203" stroke="#c8d2f5" strokeWidth="1.5"/>
          <line x1="72" y1="216" x2="138" y2="216" stroke="#c8d2f5" strokeWidth="1.5"/>
          <line x1="72" y1="229" x2="120" y2="229" stroke="#c8d2f5" strokeWidth="1.5"/>
          {/* UK map silhouette on right page */}
          <ellipse cx="205" cy="225" rx="35" ry="42" fill="#f6ad2b" opacity="0.5"/>
          {/* Headphones */}
          <path d="M130 300 Q130 340 165 355 Q200 340 200 300" stroke="#e53e3e" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <rect x="118" y="298" width="16" height="26" rx="7" fill="#e53e3e"/>
          <rect x="196" y="298" width="16" height="26" rx="7" fill="#e53e3e"/>
          {/* Notebook */}
          <rect x="10" y="230" width="75" height="90" rx="4" fill="white" opacity="0.18"/>
          <line x1="22" y1="248" x2="74" y2="248" stroke="white" strokeWidth="1.5" opacity="0.4"/>
          <line x1="22" y1="260" x2="74" y2="260" stroke="white" strokeWidth="1.5" opacity="0.4"/>
          <line x1="22" y1="272" x2="74" y2="272" stroke="white" strokeWidth="1.5" opacity="0.4"/>
          <line x1="22" y1="284" x2="60" y2="284" stroke="white" strokeWidth="1.5" opacity="0.4"/>
          {/* Pen */}
          <rect x="5" y="295" width="6" height="55" rx="3" fill="#2952cc" transform="rotate(-20,8,320)" opacity="0.8"/>
          <polygon points="5,348 11,348 8,358" fill="#f0f4ff" transform="rotate(-20,8,348)" opacity="0.8"/>
          {/* Flowers */}
          <text x="200" y="75" fontSize="22" opacity="0.55" fill="white">✿</text>
          <text x="30" y="200" fontSize="16" opacity="0.4" fill="white">✿</text>
          <text x="230" y="170" fontSize="14" opacity="0.4" fill="white">�</text>
          {/* Stars */}
          <text x="110" y="55" fontSize="16" fill="#f6ad2b" opacity="0.6">✦</text>
          <text x="50" y="70" fontSize="12" fill="#f6ad2b" opacity="0.5">✦</text>
        </svg>
      </div>


      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(-15deg)} 50%{transform:translateY(-18px) rotate(-15deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(12deg)} 50%{transform:translateY(-12px) rotate(12deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(8deg)} 50%{transform:translateY(-20px) rotate(8deg)} }
      `}</style>

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${T.purple}, #fd79a8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 14px', boxShadow: `0 8px 32px rgba(108,92,231,0.5)` }}>🎓</div>
          <div style={{ fontWeight: 900, fontSize: 28, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>LearnFlow</div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 4 }}>🇬🇧 Professional Communication for Teachers</div>
        </div>

        <div style={{ background: T.bg1, border: `1.5px solid ${T.border}`, borderRadius: 22, padding: 32, boxShadow: '0 8px 40px rgba(108,92,231,0.10)' }}>
          <div style={{ display: 'flex', background: T.bg2, borderRadius: 12, padding: 4, marginBottom: 26 }}>
            {['login', 'register'].map(m => (
              <button key={m} type="button" onClick={() => switchMode(m)}
                style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', background: mode === m ? T.bg1 : 'transparent', color: mode === m ? T.purple : T.text3, fontWeight: mode === m ? 800 : 600, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s', fontFamily: "'Nunito', sans-serif", boxShadow: mode === m ? '0 2px 8px rgba(108,92,231,0.10)' : 'none' }}>
                {m === 'login' ? '🔑 Sign In' : '✨ Register'}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: T.text2, fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); clearError('name'); }}
                  placeholder="Your full name"
                  style={{ width: '100%', background: errors.name ? T.red + '08' : T.bg2, border: `1.5px solid ${errors.name ? T.red : T.border}`, borderRadius: 10, padding: '11px 14px', color: T.text, fontSize: 14, outline: 'none', fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box' }}
                />
                {errors.name && <div style={{ color: T.red, fontSize: 11, marginTop: 4 }}>✕ {errors.name}</div>}
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ color: T.text2, fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); clearError('email'); }}
                placeholder="you@example.com"
                style={{ width: '100%', background: errors.email ? T.red + '08' : T.bg2, border: `1.5px solid ${errors.email ? T.red : T.border}`, borderRadius: 10, padding: '11px 14px', color: T.text, fontSize: 14, outline: 'none', fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box' }}
              />
              {errors.email && <div style={{ color: T.red, fontSize: 11, marginTop: 4 }}>✕ {errors.email}</div>}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ color: T.text2, fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearError('password'); }}
                  placeholder={mode === 'register' ? 'Min 8 chars, uppercase, number...' : 'Your password'}
                  style={{ width: '100%', background: errors.password ? T.red + '08' : T.bg2, border: `1.5px solid ${errors.password ? T.red : T.border}`, borderRadius: 10, padding: '11px 44px 11px 14px', color: T.text, fontSize: 14, outline: 'none', fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <div style={{ color: T.red, fontSize: 11, marginTop: 4 }}>✕ {errors.password}</div>}
              {mode === 'register' && <PasswordStrength password={password} />}
            </div>

            {mode === 'register' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ color: T.text2, fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                      placeholder="Repeat your password"
                      style={{ width: '100%', background: errors.confirmPassword ? T.red + '08' : T.bg2, border: `1.5px solid ${errors.confirmPassword ? T.red : T.border}`, borderRadius: 10, padding: '11px 44px 11px 14px', color: T.text, fontSize: 14, outline: 'none', fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box' }}
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <div style={{ color: T.red, fontSize: 11, marginTop: 4 }}>✕ {errors.confirmPassword}</div>}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ color: T.text2, fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>I am a...</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['student', 'instructor'].map(r => (
                      <button key={r} type="button" onClick={() => setRole(r)} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, border: `2px solid ${role === r ? T.purple : T.border}`, background: role === r ? T.purple + '15' : T.bg2, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700, color: role === r ? T.purple : T.text3, transition: 'all 0.15s' }}>
                        {r === 'student' ? '🎓 Student' : '👨‍🏫 Instructor'}
                      </button>
                    ))}
                  </div>
                </div>

                {role === 'instructor' && (
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ color: T.text2, fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Instructor Code</label>
                    <input
                      type="password"
                      value={instructorCode}
                      onChange={e => { setInstructorCode(e.target.value); clearError('instructorCode'); }}
                      placeholder="Enter secret instructor code"
                      style={{ width: '100%', background: errors.instructorCode ? T.red + '08' : T.bg2, border: `1.5px solid ${errors.instructorCode ? T.red : T.amber}`, borderRadius: 10, padding: '11px 14px', color: T.text, fontSize: 14, outline: 'none', fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box' }}
                    />
                    {errors.instructorCode
                      ? <div style={{ color: T.red, fontSize: 11, marginTop: 4 }}>✕ {errors.instructorCode}</div>
                      : <div style={{ color: T.amber, fontSize: 11, marginTop: 4 }}>🔒 Only instructors have this code</div>
                    }
                  </div>
                )}
              </>
            )}

            {errors.general && (
              <div style={{ background: T.red + '12', border: `1.5px solid ${T.red}44`, borderRadius: 10, padding: '11px 14px', color: T.red, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                ✕ {errors.general}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? T.border : `linear-gradient(135deg, ${T.purple}, #5a4fd4)`, border: 'none', borderRadius: 12, padding: '13px', color: loading ? T.text3 : '#fff', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontFamily: "'Nunito', sans-serif", boxShadow: loading ? 'none' : `0 4px 16px ${T.purple}33`, marginTop: 4 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', color: T.purple, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}