// ユーザー登録画面コンポーネント
import React, { useState, useContext, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Compressor from 'compressorjs';
import { apiFetch } from '../utils/api'; // apiFetchをインポート
import { SignUpFormData } from '../types';

const SignUp: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');

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

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    setError('');
    const { name, email, password } = data;
    const iconFile = data.icon[0];
    
    try {
      const userResponse: { token: string } = await apiFetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      new Compressor(iconFile, {
        quality: 0.6,
        success: async (compressedResult) => {
          const formData = new FormData();
          formData.append('icon', compressedResult);

          try {
            const iconResponse: { iconUrl: string } = await apiFetch('/uploads', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${userResponse.token}`,
              },
              body: formData,
            });

            login(userResponse.token, name, iconResponse.iconUrl);
            alert('サインアップに成功しました！');
            navigate('/reviews');
          } catch (iconErr) {
            setError((iconErr as Error).message || 'アイコンのアップロードに失敗しました');
            console.error('アイコンアップロードエラー:', iconErr);
          }
        },
        error(err) {
          console.error('圧縮エラー:', err.message);
          setError('アイコンの圧縮に失敗しました');
        },
      });
    } catch (err) {
      setError((err as Error).message || 'ネットワークエラーが発生しました。');
      console.error('サインアップエラー:', err);
    }
  };

  // リダイレクト(Station06)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/reviews');
    }
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザー登録</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name">名前</label>
          <input
            id="name"
            type="text"
            className="border w-full p-2"
            {...register('name', { required: '名前は必須です' })}
            autoComplete="name" // 自動入力属性を追加
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            className="border w-full p-2"
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: '有効なメールアドレスを入力してください'
              }
            })}
            autoComplete="email" // 自動入力属性を追加
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            className="border w-full p-2"
            {...register('password', { 
              required: 'パスワードは必須です',
              minLength: {
                value: 6,
                message: 'パスワードは6文字以上である必要があります'
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+$/,
                message: 'パスワードは英数字、ピリオド、アンダースコア、パーセント、プラス、ハイフンのみ使用可能です'
              }
            })}
            autoComplete="new-password" // 自動入力属性を追加
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="icon">アイコン</label>
          <input
            id="icon"
            type="file"
            className="border w-full p-2"
            accept="image/*"
            {...register('icon', { validate: validateImageFile })}
          />
          {errors.icon && <p className="text-red-500">{errors.icon.message}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4">
          サインアップ
        </button>
      </form>
      <p className="mt-4">
        すでにアカウントをお持ちですか？ <Link to="/login" className="text-blue-500">ログイン</Link>
      </p>
    </div>
  );
};

export default SignUp;
