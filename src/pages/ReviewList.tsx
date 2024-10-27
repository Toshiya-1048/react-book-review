import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReviewPagination from './ReviewPagination';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ReviewType } from '../types';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { useQuery } from '@tanstack/react-query';

function ReviewList() {
  const { isLoggedIn } = useContext(AuthContext);
  const { currentPage } = useSelector((state: RootState) => state.reviews);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', currentPage, isLoggedIn],
    queryFn: async () => {
      const offset = (currentPage - 1) * 10;
      const endpoint = isLoggedIn 
        ? `/books?offset=${offset}`
        : `/public/books?offset=${offset}`;
      
      const headers: HeadersInit = isLoggedIn
        ? { 'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}` }
        : {};

      const response = await apiFetch<ReviewType[]>(endpoint, {
        method: 'GET',
        headers,
      });
      
      return {
        reviews: response,
        hasNextPage: response.length === 10
      };
    }
  });

  const handleReviewClick = async (reviewId: string) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await apiFetch('/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ selectBookId: reviewId }),
        });
      } catch (err) {
        console.error('ログ送信エラー:', err);
      }
    }
    navigate(`/detail/${reviewId}`);
  };

  if (isLoading) {
    return <div className="text-center">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{(error as Error).message}</div>;
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-screen-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">書籍レビュー一覧</h1>
        <div className="text-right mb-4">
          <Link to="/new" className="text-blue-500">新しいレビューを投稿</Link>
        </div>
        <ul className="space-y-4">
          {data?.reviews.map((review: ReviewType) => (
            <li key={review.id} className="border-b py-2 w-full">
              <div 
                className="flex flex-col cursor-pointer hover:bg-red-400 transition duration-200"
                onClick={() => handleReviewClick(review.id)}
              >
                <h2 className="text-xl font-bold">{review.title}</h2>
                <p className="text-gray-300 overflow-hidden whitespace-nowrap text-ellipsis">
                  {review.review}
                </p>
                <p className="text-sm text-gray-500">レビュワー: {review.reviewer}</p>
              </div>
              <div className="flex space-x-4">
                  {review.isMine && (
                    <Link to={`/edit/${review.id}`} className="text-blue-500">
                      編集
                    </Link>
                  )}
                </div>
            </li>
          ))}
        </ul>
        <ReviewPagination 
          currentPage={currentPage} 
          hasNextPage={data?.hasNextPage || false} 
        />
      </div>
    </div>
  );
}

export default ReviewList;
