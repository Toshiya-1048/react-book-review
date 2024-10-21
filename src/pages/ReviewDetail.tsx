import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface BookDetail {
  id: string; // 追加: 書籍のID
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
  isMine: boolean; // 追加: ログインユーザーが作成したレビューか
}

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetail = async () => {
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
          const data: BookDetail = await response.json();
          setBookDetail(data);
        } else {
          setError('書籍情報の取得に失敗しました');
        }
      } catch {
        setError('ネットワークエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id, navigate]);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {bookDetail && (
        <>
          <h1 className="text-2xl font-bold mb-4">{bookDetail.title}</h1>
          <p><strong>URL:</strong> <a href={bookDetail.url} target="_blank" rel="noopener noreferrer">{bookDetail.url}</a></p>
          <p><strong>詳細情報:</strong> {bookDetail.detail}</p>
          <p><strong>レビュー:</strong> {bookDetail.review}</p>
          <p><strong>レビュー者:</strong> {bookDetail.reviewer}</p>
          {bookDetail.isMine && (
            <div className="mt-4">
              <Link to={`/edit/${bookDetail.id}`} className="text-blue-500">レビューを編集</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewDetail;
