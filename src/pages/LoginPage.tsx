import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccessMsg('注册成功！请检查邮箱确认链接。');
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-emoji">🍼</span>
          <h2>{isSignUp ? '注册账号' : '登录'}</h2>
        </div>

        {error && <div className="login-error">{error}</div>}
        {successMsg && <div className="login-success">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">📧 邮箱</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">🔒 密码</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="至少6位密码"
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="login-btn"
            disabled={submitting}
          >
            {submitting ? '请稍候...' : isSignUp ? '注册' : '登录'}
          </button>
        </form>

        <p className="login-toggle">
          {isSignUp ? '已有账号？' : '没有账号？'}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMsg(null); }}
          >
            {isSignUp ? '去登录' : '注册'}
          </button>
        </p>
      </div>
    </div>
  );
}
