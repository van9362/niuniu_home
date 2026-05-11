import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          🍼 牛牛的成长记录
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">首页</Link>
          <Link to="/meals" className="nav-link">🍚 吃饭</Link>
        </nav>
      </div>
    </header>
  );
}
