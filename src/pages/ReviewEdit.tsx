import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

interface ReviewFormData {
  title: string;
  url: string;
  detail: string;
  review: string;
}

const ReviewEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ReviewFormData>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchReview = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://railway.bookreview.techtrain.dev/books/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setValue('title', data.title);
          setValue('url', data.url);
          setValue('detail', data.detail);
          setValue('review', data.review);
        } else {
          setError('レビューの取得に失敗しました');
        }
      } catch  {
        setError('ネットワークエラーが発生しました');
      }
    };

    fetchReview();
  }, [id, navigate, setValue]);

  const onSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    setError('');
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://railway.bookreview.techtrain.dev/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('レビューが更新されました');
        navigate('/reviews');
      } else {
        setError('レビューの更新に失敗しました');
      }
    } catch  {
      setError('ネットワークエラーが発生しました');
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://railway.bookreview.techtrain.dev/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('レビューが削除されました');
        navigate('/reviews');
      } else {
        setError('レビューの削除に失敗しました');
      }
    } catch  {
      setError('ネットワークエラーが発生しました');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">レビュー編集</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            type="text"
            className={`border w-full p-2 ${errors.title ? 'border-red-500' : ''}`}
            {...register('title', { required: 'タイトルは必須です' })}
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="url"
            className={`border w-full p-2 ${errors.url ? 'border-red-500' : ''}`}
            {...register('url', { required: 'URLは必須です' })}
          />
          {errors.url && <p className="text-red-500">{errors.url.message}</p>}
        </div>
        <div>
          <label htmlFor="detail">詳細情報</label>
          <textarea
            id="detail"
            className={`border w-full p-2 ${errors.detail ? 'border-red-500' : ''}`}
            {...register('detail', { required: '詳細情報は必須です' })}
          />
          {errors.detail && <p className="text-red-500">{errors.detail.message}</p>}
        </div>
        <div>
          <label htmlFor="review">レビュー内容</label>
          <textarea
            id="review"
            className={`border w-full p-2 ${errors.review ? 'border-red-500' : ''}`}
            {...register('review', { required: 'レビュー内容は必須です' })}
          />
          {errors.review && <p className="text-red-500">{errors.review.message}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4">
          更新
        </button>
        <button type="button" onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 ml-2">
          削除
        </button>
      </form>
    </div>
  );
};

export default ReviewEdit;