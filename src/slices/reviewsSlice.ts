import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ReviewType } from '../types';

interface ReviewsState {
  reviews: ReviewType[];
  currentPage: number;
  hasNextPage: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  currentPage: 1,
  hasNextPage: false,
  loading: false,
  error: null,
};

// 10件を1ページとする
const PAGE_SIZE = 10;

// `fetchReviews` 関数を修正
export const fetchReviews = createAsyncThunk<
  { reviews: ReviewType[]; hasNextPage: boolean },
  number,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'reviews/fetchReviews',
  async (currentPage: number, { rejectWithValue }) => {
    try {
      const offset = (currentPage - 1) * PAGE_SIZE;
      const response = await fetch(`https://railway.bookreview.techtrain.dev/public/books?offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.ErrorMessageJP || 'エラーが発生しました');
      }

      const data: ReviewType[] = await response.json(); 

      // ログインユーザーの情報を取得
      const userName = localStorage.getItem('userName') || '';

      // `isMine` プロパティを追加
      const reviews: ReviewType[] = data.map((review) => ({
        id: review.id,
        title: review.title,
        review: review.review,
        reviewer: review.reviewer,
        isMine: review.reviewer === userName, // `reviewer` が現在のユーザーと一致するか
      }));

      // reviewsの内容をコンソールに表示
      // console.log('Reviews:', reviews);

      // 次のページが存在するかを判断
      const hasNextPage = data.length === PAGE_SIZE;

      return {
        reviews,
        hasNextPage,
      };
    } catch {
      return rejectWithValue('ネットワークエラー');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchReviews.fulfilled,
        (state, action: PayloadAction<{ reviews: ReviewType[]; hasNextPage: boolean }>) => {
          state.loading = false;
          state.reviews = action.payload.reviews;
          state.hasNextPage = action.payload.hasNextPage;
        }
      )
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage } = reviewsSlice.actions;
export default reviewsSlice.reducer;
