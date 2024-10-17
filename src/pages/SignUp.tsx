// ユーザー登録画面コンポーネント
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Compressor from 'compressorjs';

function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string; email: string; password: string; icon: FileList }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data: { name: string; email: string; password: string; icon: FileList }) => {
    console.log('フォームデータ:', data); // フォームデータをコンソールに出力

    const { name, email, password } = data;

    // アイコン画像のリサイズ
    new Compressor(data.icon[0], {
      quality: 0.6,
      success: async (compressedResult) => {
        // 画像をBase64に変換する
        const reader = new FileReader();
        reader.readAsDataURL(compressedResult);
        reader.onloadend = async () => {
          const base64data = reader.result;

          const requestBody = {
            name,
            email,
            password,
            icon: base64data, // Base64エンコードされた画像データ
          };

          try {
            const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });

            if (response.ok) {
              const responseData: { token: string } = await response.json();
              localStorage.setItem('authToken', responseData.token);
              alert('サインアップに成功しました！'); // 成功メッセージを表示
              navigate('/reviews'); // 書籍レビューの一覧画面に遷移
            } else {
              const errorData = await response.json();
              console.error('サーバーエラー:', errorData); // サーバーエラーメッセージをコンソールに出力
              setError(errorData.ErrorMessageJP || '登録に失敗しました');
            }
          } catch  {
            setError('ネットワークエラーが発生しました');
          }
        };
      },
      error() {
        setError('画像の圧縮に失敗しました');
      },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/reviews'); // ログイン済みならリダイレクト
    }
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザー登録</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>名前</label>
          <input
            type="text"
            className="border w-full p-2"
            {...register('name', { required: '名前は必須です' })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label>メールアドレス</label>
          <input
            type="email"
            className="border w-full p-2"
            // 以下React Hook Formによるバリデーション
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                // メールアドレスの@が、英数字、ピリオド、アンダースコア、パーセント、プラス、ハイフンを含むことを許可。
                // @の後のドメイン名は、英数字、ピリオド、ハイフンを含むことを許可
                // ドットに続いて2文字以上のアルファベットが必須
                // 言い換えるなら日本語は許可されていないのでエラー判定される

                message: '有効なメールアドレスを入力してください'
                // エラー時のUIにあたるメッセージ
              }
            })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label>パスワード</label>
          <input
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
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <label>アイコン画像</label>
          <input
            type="file"
            className="border w-full p-2"
            {...register('icon', { required: 'アイコン画像は必須です' })}
          />
          {errors.icon && <p className="text-red-500">{errors.icon.message}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4">
          登録
        </button>
      </form>
      <p className="mt-4">
        すでにアカウントをお持ちですか？ <Link to="/login" className="text-blue-500">ログイン</Link>
      </p>
    </div>
  );
}

export default SignUp;
