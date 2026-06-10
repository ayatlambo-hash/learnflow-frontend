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

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${T.purple}15, ${T.bg})`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 20, background: `linear-gradient(135deg, ${T.purple}, #fd79a8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 14px', boxShadow: `0 8px 24px ${T.purple}33` }}>🎓</div>
          <div style={{ fontWeight: 900, fontSize: 26, color: T.text, letterSpacing: '-0.02em' }}>LearnFlow</div>
          <div style={{ color: T.text3, fontSize: 13, marginTop: 4 }}>Your online learning platform</div>
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

        <div style={{ textAlign: 'center', marginTop: 20, color: T.text3, fontSize: 13 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', color: T.purple, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}