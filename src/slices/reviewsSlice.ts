import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface Review {
  id: string;
  title: string;
  review: string;
  reviewer: string;
  isMine: boolean;
}

interface ReviewsState {
  reviews: Review[];
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

// 正しいAPIエンドポイントを使用し、レスポンスが配列であることを考慮
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (currentPage: number, { rejectWithValue }) => {
    try {
      const offset = (currentPage - 1) * PAGE_SIZE;
      const response = await fetch(`https://railway.bookreview.techtrain.dev/public/books?offset=${offset}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.ErrorMessageJP || 'エラーが発生しました');
      }
      const data: Review[] = await response.json();

      // 次のページが存在するかを判断
      const hasNextPage = data.length === PAGE_SIZE;

      return {
        reviews: data,
        hasNextPage,
      };
    } catch  {
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
    resetReviews(state) {
      state.reviews = [];
      state.currentPage = 1;
      state.hasNextPage = false;
      state.loading = false;
      state.error = null;
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
        (state, action: PayloadAction<{ reviews: Review[]; hasNextPage: boolean }>) => {
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

export const { setCurrentPage, resetReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;