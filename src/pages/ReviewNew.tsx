import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch('https://railway.bookreview.techtrain.dev/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('レビューが投稿されました');
        navigate('/reviews'); // 投稿後にレビュー一覧にリダイレクト
      } else {
        const errorData = await response.json();
        setSubmissionError(errorData.ErrorMessageJP || 'レビューの投稿に失敗しました');
        console.error('レビュー投稿エラー:', errorData);
      }
    } catch (err) {
      setSubmissionError('ネットワークエラーが発生しました');
      console.error('レビュー投稿エラー:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新規レビュー投稿</h1>
      {submissionError && <p className="text-red-500">{submissionError}</p>}
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
          投稿
        </button>
      </form>
    </div>
  );
};

export default ReviewNew;