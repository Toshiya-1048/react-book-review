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
      ? `https://railway.bookreview.techtrain.dev/books?offset=${offset}`
      : `https://railway.bookreview.techtrain.dev/public/books?offset=${offset}`;
    
    const headers: HeadersInit = isLoggedIn
      ? { 'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}` }
      : {};

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const data: ReviewType[] = await response.json();
        const hasNextPage = data.length === 10;
        return { reviews: data, hasNextPage };
      } else {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData.ErrorMessageJP || 'レビューの取得に失敗しました');
      }
    } catch {
      return thunkAPI.rejectWithValue('ネットワークエラーが発生しました');
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
