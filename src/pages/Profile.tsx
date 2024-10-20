// ユーザー情報編集画面コンポーネント
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ProfileFormData {
  name: string;
  icon: FileList;
}

function Profile() {
  const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors, setValue } = useForm<ProfileFormData>();
  const navigate = useNavigate();
  const { isLoggedIn, updateUserName } = useContext(AuthContext);
  const [iconUrl, setIconUrl] = useState<string>('');
  const [submissionError, setSubmissionError] = useState<string>('');

  const selectedFile = watch('icon');

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
          setValue('name', data.name);
          setIconUrl(data.iconUrl || '');
        } else {
          const errorData = await response.json();
          setSubmissionError(errorData.ErrorMessageJP || 'ユーザー情報の取得に失敗しました');
          console.error('ユーザー情報取得エラー:', errorData);
        }
      } catch (err) {
        setSubmissionError('ネットワークエラーが発生しました');
        console.error('ユーザー情報取得エラー:', err);
      }
    };

    fetchUserData();
  }, [navigate, setValue]); // 'setValue'を依存配列に追加

  const validateImageFile = (fileList: FileList) => {
    const file = fileList[0];
    if (!file) return 'アイコンを選択してください';

    // ファイルサイズの制限（1MB以下）
    if (file.size > 1024 * 1024) {
      return 'アイコンのファイルサイズは1MB以下である必要があります';
    }

    // 拡張子のチェック
    const validExtensions = ['image/jpeg', 'image/png'];
    if (!validExtensions.includes(file.type)) {
      return '許可されているファイル形式はjpgまたはpngのみです';
    }

    return true; // バリデーション成功
  };

  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      const file = selectedFile[0];
      // ファイルサイズの制限（1MB以下）
      if (file.size > 1024 * 1024) {
        setError('icon', { type: 'manual', message: 'アイコンのファイルサイズは1MB以下である必要があります' });
      } else {
        clearErrors('icon');
      }

      // 拡張子のチェック
      const validExtensions = ['image/jpeg', 'image/png'];
      if (!validExtensions.includes(file.type)) {
        setError('icon', { type: 'manual', message: '許可されているファイル形式はjpgまたはpngのみです' });
      } else {
        clearErrors('icon');
      }
    }
  }, [selectedFile, setError, clearErrors]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    setSubmissionError('');
    const { name, icon } = data;
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const updateData = { name };

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
        // setName(responseData.name);
        setIconUrl(responseData.iconUrl !== undefined ? responseData.iconUrl : iconUrl);
        updateUserName(responseData.name, responseData.iconUrl || iconUrl);

        // アイコンのアップロード
        if (icon && icon.length > 0) {
          const formData = new FormData();
          formData.append('icon', icon[0]);

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
            setSubmissionError(errorData.ErrorMessageJP || 'アイコンのアップロードに失敗しました');
            console.error('アイコンアップロードエラー:', errorData);
          }
        }

        alert('プロフィールが更新されました');
      } else {
        const errorData = await response.json();
        setSubmissionError(errorData.ErrorMessageJP || 'プロフィールの更新に失敗しました');
        console.error('プロフィール更新エラー:', errorData);
      }
    } catch (err) {
      setSubmissionError('ネットワークエラーが発生しました');
      console.error('プロフィール更新エラー:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プロフィール編集</h1>
      {submissionError && <p className="text-red-500">{submissionError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name">名前</label>
          <input
            id="name"
            type="text"
            className={`border w-full p-2 ${errors.name ? 'border-red-500' : ''}`}
            {...register('name', { required: '名前は必須です' })}
            autoComplete="name" // 自動入力属性を追加
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        {iconUrl && (
          <div>
            <label htmlFor="current-icon">現在のアイコン</label>
            <img id="current-icon" src={iconUrl} alt="ユーザーアイコン" className="w-20 h-20" />
          </div>
        )}
        <div>
          <label htmlFor="icon-upload">アイコンを変更</label>
          <input
            id="icon-upload"
            type="file"
            className={`border w-full p-2 ${errors.icon ? 'border-red-500' : ''}`}
            accept="image/*"
            {...register('icon', { validate: validateImageFile })}
          />
          {errors.icon && <p className="text-red-500">{errors.icon.message}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4">
          更新
        </button>
      </form>
    </div>
  );
}

export default Profile;
