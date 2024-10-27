import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { useQuery } from '@tanstack/react-query';

interface BookDetail {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
  isMine: boolean;
}

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn } = useContext(AuthContext);

  const { data: bookDetail, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      return await apiFetch<BookDetail>(`/books/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
    },
    enabled: !!id
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <p className="text-xl">読み込み中...</p>
    </div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-2xl bg-white shadow-md rounded-md mt-10">
        <p className="text-red-600 text-lg mb-4">{(error as Error).message}</p>
        {!isLoggedIn && (
          <Link to="/login" className="text-blue-500 hover:underline">
            ログインページへ
          </Link>
        )}
      </div>
    );
  }

  if (!bookDetail) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl bg-gray-300 shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{bookDetail.title}</h1>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">URL:</span>{' '}
        <a
          href={bookDetail.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {bookDetail.url.length > 30 ? `${bookDetail.url.slice(0, 30)}...` : bookDetail.url}
        </a>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">詳細情報:</span>
        <p className="text-gray-600 mt-1 whitespace-pre-wrap break-words">{bookDetail.detail}</p>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">レビュー:</span>
        <p className="text-gray-600 mt-1 whitespace-pre-wrap break-words">{bookDetail.review}</p>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">レビュー者:</span>
        <span className="text-gray-600 ml-2">{bookDetail.reviewer}</span>
      </div>
      {bookDetail.isMine && (
        <div className="mt-6">
          <Link
            to={`/edit/${bookDetail.id}`}
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            レビューを編集
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewDetail;
