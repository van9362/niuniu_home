import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { AddRecordPage } from './pages/AddRecordPage';
import { RecordDetailPage } from './pages/RecordDetailPage';
import { LoginPage } from './pages/LoginPage';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/record/:id" element={<RecordDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddRecordPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <footer className="footer">
          <p>🍼 牛牛的成长记录 · 用爱记录每一个瞬间 ❤️</p>
        </footer>
      </div>
    </AuthProvider>
  );
}
