import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../slices/reviewsSlice';
import { AppDispatch } from '../store';

interface ReviewPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
}

function ReviewPagination({ currentPage, hasNextPage }: ReviewPaginationProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleNext = () => {
    if (hasNextPage) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleFirstPage = () => {
    dispatch(setCurrentPage(1));
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleFirstPage}
        disabled={currentPage === 1}
        className="bg-gray-300 px-4 py-2 mx-2 disabled:opacity-50"
      >
        1ページ目
      </button>
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="bg-gray-300 px-4 py-2 mx-2 disabled:opacity-50"
      >
        前へ
      </button>
      <span className="px-4 py-2">{currentPage}</span>
      <button
        onClick={handleNext}
        disabled={!hasNextPage}
        className="bg-gray-300 px-4 py-2 mx-2 disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}

export default ReviewPagination;
