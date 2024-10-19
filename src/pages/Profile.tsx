// ユーザー情報編集画面コンポーネント
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, updateUserName } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || !isLoggedIn) {
      navigate('/login');
    }
  }, [navigate, isLoggedIn]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: { name: string; iconUrl?: string } = await response.json();
          console.log('取得したユーザーデータ:', data); // data.name が正しいか確認
          setName(data.name);
          setIconUrl(data.iconUrl || '');
        } else {
          const errorData = await response.json();
          setError(errorData.ErrorMessageJP || 'ユーザー情報の取得に失敗しました');
          console.error('ユーザー情報取得エラー:', errorData);
        }
      } catch (err) {
        setError('ネットワークエラーが発生しました');
        console.error('ユーザー情報取得エラー:', err);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const updateData = {
      name,
    };

    try {
      // ユーザー名の更新
      const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const responseData: { name: string; iconUrl?: string } = await response.json();
        setName(responseData.name);
        setIconUrl(responseData.iconUrl !== undefined ? responseData.iconUrl : iconUrl);
        updateUserName(responseData.name, responseData.iconUrl || iconUrl);

        // アイコンのアップロード
        if (selectedFile) {
          const formData = new FormData();
          formData.append('icon', selectedFile);

          const iconResponse = await fetch('https://railway.bookreview.techtrain.dev/uploads', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (iconResponse.ok) {
            const iconData: { iconUrl: string } = await iconResponse.json();
            setIconUrl(iconData.iconUrl);
            updateUserName(responseData.name, iconData.iconUrl); // アイコンURLを更新
          } else {
            const errorData = await iconResponse.json();
            setError(errorData.ErrorMessageJP || 'アイコンのアップロードに失敗しました');
            console.error('アイコンアップロードエラー:', errorData);
          }
        }

        alert('プロフィールが更新されました');
      } else {
        const errorData = await response.json();
        setError(errorData.ErrorMessageJP || 'プロフィールの更新に失敗しました');
        console.error('プロフィール更新エラー:', errorData);
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
      console.error('プロフィール更新エラー:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール編集</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label>名前</label>
          <input
            type="text"
            className="border w-full p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {iconUrl && (
          <div>
            <label>現在のアイコン</label>
            <img src={iconUrl} alt="ユーザーアイコン" className="w-20 h-20" />
          </div>
        )}
        <div>
          <label>アイコンを変更</label>
          <input type="file" className="border w-full p-2" onChange={handleFileChange} />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4">
          更新
        </button>
      </form>
    </div>
  );
}

export default Profile;
