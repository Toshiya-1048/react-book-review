import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api'; // apiFetchをインポート

interface ReviewFormData {
  title: string;
  url: string;
  detail: string;
  review: string;
}

const ReviewNew: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ReviewFormData>();
  const navigate = useNavigate();
  const [submissionError, setSubmissionError] = useState<string>('');

  const onSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    setSubmissionError('');
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await apiFetch('/books', { // API_BASE_URLを使用
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      alert('レビューが投稿されました');
      navigate('/reviews');
    } catch (err) {
      setSubmissionError((err as Error).message || 'ネットワークエラーが発生しました。');
      console.error('レビュー投稿エラー:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-gray-300 shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">新規レビュー投稿</h1>
      {submissionError && <p className="text-red-600 mb-4">{submissionError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* タイトル フィールド */}
        <div>
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">タイトル</label>
          <input
            id="title"
            type="text"
            className={`border w-full p-3 rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            {...register('title', { 
              required: 'タイトルは必須です',
              minLength: {
                value: 3,
                message: 'タイトルは3文字以上で入力してください',
              },
              maxLength: {
                value: 100,
                message: 'タイトルは100文字以内で入力してください',
              },
            })}
            placeholder="レビューのタイトルを入力してください"
          />
          {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* URL フィールド */}
        <div>
          <label htmlFor="url" className="block text-gray-700 font-semibold mb-2">書籍URL</label>
          <input
            id="url"
            type="url"
            className={`border w-full p-3 rounded-md ${errors.url ? 'border-red-500' : 'border-gray-300'}`}
            {...register('url', { 
              required: 'URLは必須です',
              pattern: {
                value: /^(https?:\/\/)[^\s$.?#].[^\s]*$/,
                message: '有効なURLを入力してください',
              },
            })}
            placeholder="https://example.com/book"
          />
          {errors.url && <p className="text-red-500 mt-1">{errors.url.message}</p>}
        </div>

        {/* 詳細情報 フィールド */}
        <div>
          <label htmlFor="detail" className="block text-gray-700 font-semibold mb-2">詳細情報</label>
          <textarea
            id="detail"
            className={`border w-full p-3 rounded-md ${errors.detail ? 'border-red-500' : 'border-gray-300'}`}
            {...register('detail', { 
              required: '詳細情報は必須です',
              minLength: {
                value: 10,
                message: '詳細情報は10文字以上で入力してください',
              },
              maxLength: {
                value: 1000,
                message: '詳細情報は1000文字以内で入力してください',
              },
            })}
            placeholder="書籍の詳細情報を入力してください"
            rows={4}
          />
          {errors.detail && <p className="text-red-500 mt-1">{errors.detail.message}</p>}
        </div>

        {/* レビュー内容 フィールド */}
        <div>
          <label htmlFor="review" className="block text-gray-700 font-semibold mb-2">レビュー内容</label>
          <textarea
            id="review"
            className={`border w-full p-3 rounded-md ${errors.review ? 'border-red-500' : 'border-gray-300'}`}
            {...register('review', { 
              required: 'レビュー内容は必須です',
              minLength: {
                value: 20,
                message: 'レビュー内容は20文字以上で入力してください',
              },
              maxLength: {
                value: 5000,
                message: 'レビュー内容は5000文字以内で入力してください',
              },
            })}
            placeholder="書籍の感想や評価を詳しく記入してください"
            rows={6}
          />
          {errors.review && <p className="text-red-500 mt-1">{errors.review.message}</p>}
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
        >
          投稿
        </button>
      </form>
    </div>
  );
};

export default ReviewNew;
