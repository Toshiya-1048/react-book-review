// ログイン画面コンポーネント
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // AuthContextからlogin関数を取得
  const [error, setError] = useState('');

  const onSubmit = async (data: LoginFormData) => {
    setError(''); // エラーメッセージをリセット

    const signinData = {
      email: data.email,
      password: data.password,
    };

    // console.log('送信データ:', signinData); // 送信データをコンソールに出力

    try {
      const response = await fetch('https://railway.bookreview.techtrain.dev/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signinData),
      });

      // console.log('レスポンスステータス:', response.status); // レスポンスステータスをコンソールに出力

      if (response.ok) {
        const responseData: { token: string } = await response.json();
        // console.log('レスポンスデータ:', responseData); // レスポンスデータをコンソールに出力

        // ユーザー名を取得するAPIを呼び出す
        const userResponse = await fetch('https://railway.bookreview.techtrain.dev/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${responseData.token}`,
          },
        });

        if (userResponse.ok) {
          const userData: { name: string; iconUrl: string } = await userResponse.json();
          // console.log('ユーザーデータ:', userData);

          // AuthContextのlogin関数を呼び出す
          login(responseData.token, userData.name, userData.iconUrl || '');

          // レビュー一覧にリダイレクト
          navigate('/reviews');
        } else {
          const errorData = await userResponse.json();
          setError(errorData.ErrorMessageJP || 'ユーザー情報の取得に失敗しました');
          console.error('ユーザー情報取得エラー:', errorData);
        }
      } else {
        const errorData = await response.json();
        switch (response.status) {
          case 400:
            setError(errorData.ErrorMessageJP || 'リクエストが正しくありません');
            break;
          case 401:
            setError(errorData.ErrorMessageJP || '認証に失敗しました');
            break;
          case 500:
            setError(errorData.ErrorMessageJP || 'サーバーエラーが発生しました');
            break;
          case 503:
            setError(errorData.ErrorMessageJP || 'サービスが利用できません');
            break;
          default:
            setError('ログインに失敗しました');
        }
        console.error('サーバーエラー:', errorData);
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
      console.error('ログインエラー:', err);
    }
  };

  // リダイレクト(Station06)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/reviews'); // ログイン済みならリダイレクト
    }
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            autoComplete="email"
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
            autoComplete="current-password"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4">
          ログイン
        </button>
      </form>
      <p className="mt-4">
        アカウントをお持ちでないですか？ <Link to="/signup" className="text-blue-500">ユーザー登録</Link>
      </p>
    </div>
  );
}

export default Login;
