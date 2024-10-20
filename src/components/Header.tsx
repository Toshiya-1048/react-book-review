// ヘッダーコンポーネント
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const navigate = useNavigate(); // useNavigateフックを使用
  const { isLoggedIn, userName, iconUrl, logout } = useContext(AuthContext);

  console.log('ユーザー名:', userName); // ここでユーザー名を確認

  // station08
  const handleLogout = () => {
    logout();
    navigate('/login'); // ログアウト後にログインページにリダイレクト
  };

  return (
    <header className="bg-gray-800 p-4 text-white w-full">
      <nav className="container mx-auto flex justify-between">
        <div className="text-xl font-bold">
          <Link to="/">書籍レビューサイト</Link>
        </div>
        <div className="flex items-center">
          {isLoggedIn ? (
            <>
              {iconUrl && (
                <img src={iconUrl} alt="ユーザーアイコン" className="w-8 h-8 rounded-full mr-2" />
              )}
              <span className="mr-4">{userName}</span>
              <Link to="/profile" className="mr-4">プロフィール</Link>
              <button className='text-blue-500' onClick={handleLogout}>サインアウト</button>
            </>
          ) : (
            <Link to="/login">ログイン</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
