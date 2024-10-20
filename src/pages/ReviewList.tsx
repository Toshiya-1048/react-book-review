import { useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    dispatch(fetchReviews(currentPage));
  }, [dispatch, currentPage]);


  return (
    <div className="flex justify-center p-4 ">
      <div className="w-full max-w-screen-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">書籍レビュー一覧</h1>
        {loading && <p className="text-center">読み込み中...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border-b py-2 w-full">
              <div className="flex flex-col">
                <div className="flex-1 mb-2">
                  <h2 className="text-xl font-bold">{review.title}</h2>
                  <p>{review.review}</p>
                </div>
                <div className="flex space-x-4">
                  <Link to={`/reviews/${review.id}`} className="text-blue-500">
                    詳細
                  </Link>
                  <Link to={`/reviews/${review.id}/edit`} className="text-blue-500">
                    編集
                  </Link>
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
