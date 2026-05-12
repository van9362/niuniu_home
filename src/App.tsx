import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { RecordDetailPage } from './pages/RecordDetailPage';
import { MealsPage } from './pages/MealsPage';
import { LibraryPage } from './pages/LibraryPage';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/record/:id" element={<RecordDetailPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>🍼 牛牛的成长记录 · 用爱记录每一个瞬间 ❤️</p>
      </footer>
    </div>
  );
}
