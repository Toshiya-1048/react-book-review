// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Header from './components/Header'; // Headerコンポーネントをインポート
import ReviewList from './pages/ReviewList'; // ReviewListコンポーネントをインポート

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen"> {/* flex-colを追加して縦に並べる */}
        <Header /> {/* Headerコンポーネントを追加 */}
        <div className="flex-grow"> {/* コンテンツを縦に広げる */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reviews" element={<ReviewList />} /> {/* ReviewListコンポーネントを追加 */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
