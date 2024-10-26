import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ReviewType } from '../types';
import { apiFetch } from '../utils/api';

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

// 引数にページ番号とログイン状態を受け取る
export const fetchReviews = createAsyncThunk<
  { reviews: ReviewType[]; hasNextPage: boolean },
  { page: number; isLoggedIn: boolean },
  {
    state: RootState;
    rejectValue: string;
  }
>(
  'reviews/fetchReviews',
  async ({ page, isLoggedIn }: { page: number; isLoggedIn: boolean }, thunkAPI) => {
    const offset = (page - 1) * 10;
    const endpoint = isLoggedIn 
      ? `/books?offset=${offset}`
      : `/public/books?offset=${offset}`;
    
    const headers: HeadersInit = isLoggedIn
      ? { 'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}` }
      : {};

    try {
      const data: ReviewType[] = await apiFetch(endpoint, {
        method: 'GET',
        headers,
      });
      const hasNextPage = data.length === 10;
      return { reviews: data, hasNextPage };
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message || 'レビューの取得に失敗しました。');
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
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<{ reviews: ReviewType[]; hasNextPage: boolean }>) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.hasNextPage = action.payload.hasNextPage;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage } = reviewsSlice.actions;
export default reviewsSlice.reducer;
