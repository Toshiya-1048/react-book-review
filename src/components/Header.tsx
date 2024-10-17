// ヘッダーコンポーネント
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      // ユーザー名を取得するAPIを呼び出すか、トークンからデコードする
      // ここでは仮にユーザー名を設定
      setUserName('ユーザー名'); // 実際のユーザー名を設定するロジックを追加してください
    }
  }, []);

  return (
    <header className="bg-gray-800 p-4 text-white w-full">
      <nav className="container mx-auto flex justify-between">
        <div className="text-xl font-bold">
          <Link to="/">書籍レビューサイト</Link>
        </div>
        <div>
          {isLoggedIn ? (
            <>
              <span className="mr-4">{userName}</span>
              <Link to="/profile" className="mr-4">プロフィール</Link>
              <button onClick={() => {
                localStorage.removeItem('authToken');
                setIsLoggedIn(false);
              }}>サインアウト</button>
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
