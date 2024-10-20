// src/App.tsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Header from './components/Header'; // Headerコンポーネントをインポート
import ReviewList from './pages/ReviewList'; // ReviewListコンポーネントをインポート
import Profile from './pages/Profile'; // Profileコンポーネントをインポート
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header /> {/* Headerコンポーネントを追加 */}
          <div className="flex-grow"> {/* 余白がある場合コンテンツを縦に広げる */}
            <Routes>
              <Route path="/" element={<Navigate to="/reviews" />} /> {/* デフォルトでreviewsにリダイレクト */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reviews" element={<ReviewList />} /> {/* ReviewListコンポーネントを追加 */}
              <Route path="/profile" element={<Profile />} /> {/* Profileコンポーネントのルートを追加 */}
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
