import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          🍼 牛牛的成长记录
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">首页</Link>
          {user ? (
            <>
              <Link to="/add" className="nav-link">添加记录</Link>
              <button onClick={signOut} className="nav-btn">
                退出 ({user.email})
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">登录</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
