import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReviewPagination from './ReviewPagination';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchReviews } from '../slices/reviewsSlice';
import { ReviewType } from '../types';

function ReviewList() {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, currentPage, hasNextPage, loading, error } = useSelector((state: RootState) => state.reviews as {
    reviews: ReviewType[]; //レビューリスト本体
    currentPage: number; //ページ番号
    hasNextPage: boolean; //最終ページか否か
    loading: boolean; //ローディング中か否か
    error: string | null; //エラー内容
  });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchReviews(currentPage));
  }, [dispatch, currentPage]);

  const handleReviewClick = async (reviewId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await fetch('https://railway.bookreview.techtrain.dev/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ selectBookId: reviewId }),
      });
      console.log('selected book id:', reviewId);
    } catch (err) {
      console.error('ログ送信エラー:', err);
    }

    navigate(`/detail/${reviewId}`);
  };

  return (
    <div className="flex justify-center p-4 ">
      <div className="w-full max-w-screen-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">書籍レビュー一覧</h1>
        <div className="text-right mb-4">
          <Link to="/new" className="text-blue-500">新しいレビューを投稿</Link>
        </div>
        {loading && <p className="text-center">読み込み中...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <ul className="space-y-4">
          {reviews.map((review: ReviewType) => (
            <li key={review.id} className="border-b py-2 w-full">
              <div className="flex flex-col">
                <div 
                  className="flex-1 mb-2 cursor-pointer hover:bg-red-400 transition duration-200" 
                  onClick={() => handleReviewClick(review.id)}
                >
                  <h2 className="text-xl font-bold">{review.title}</h2>
                  <p>{review.review}</p>
                </div>
                <div className="flex space-x-4">
                  {review.isMine && (
                    <Link to={`/edit/${review.id}`} className="text-blue-500">
                      編集
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <ReviewPagination
          currentPage={currentPage}
          hasNextPage={hasNextPage}
        />
      </div>
    </div>
  );
}

export default ReviewList;
