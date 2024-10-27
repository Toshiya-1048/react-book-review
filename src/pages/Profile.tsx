// ユーザー情報編集画面コンポーネント
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { ProfileFormData, UserData } from '../types';

function Profile() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>();
  const [submissionError, setSubmissionError] = useState<string>('');
  const [iconUrl, setIconUrl] = useState<string>('');

  const { updateUserName } = useContext(AuthContext);

  const { isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return null;
      }

      const data = await apiFetch<UserData>('/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (data) {
        setValue('name', data.name);
        setIconUrl(data.iconUrl || '');
      }
      return data;
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('認証エラー');

      const { name, icon } = data;
      const updateData = { name };

      // ユーザー名の更新
      const userData = await apiFetch<UserData>('/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      // アイコンが選択されている場合のみアップロード
      if (icon && icon.length > 0) {
        const formData = new FormData();
        formData.append('icon', icon[0]);

        const iconData = await apiFetch<{ iconUrl: string }>('/uploads', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        // アイコンURLを更新
        setIconUrl(iconData.iconUrl); // ここでアイコンURLを更新
        return { ...userData, iconUrl: iconData.iconUrl };
      }

      return userData;
    },
    onSuccess: (data) => {
      // data.iconUrl が存在する場合のみ更新
      if (data.iconUrl) {
        setIconUrl(data.iconUrl);
        updateUserName(data.name, data.iconUrl);
      } else {
        updateUserName(data.name, iconUrl); // 既存のiconUrlを保持
      }
      alert('プロフィールが更新されました');
    },
    onError: (error: Error) => {
      setSubmissionError(error.message || 'プロフィールの更新に失敗しました');
    }
  });

  // アイコンのバリデーション
  const validateImageFile = (fileList: FileList) => {
    if (!fileList || fileList.length === 0) return true;

    const file = fileList[0];

    if (file.size > 1024 * 1024) {
      return 'アイコンのファイルサイズは1MB以下である必要があります';
    }

    const validExtensions = ['image/jpeg', 'image/png'];
    if (!validExtensions.includes(file.type)) {
      return '許可されているファイル形式はjpgまたはpngのみです';
    }

    return true;
  };

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="text-center">読み込み中...</div>;
  }

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
            autoComplete="name"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
          <div>
            <label>現在のアイコン</label>
            <img id="current-icon" src={iconUrl} alt="ユーザーアイコン" className="w-20 h-20" />
          </div>
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
        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-4"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? '更新中...' : '更新'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
