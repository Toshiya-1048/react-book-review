import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReviewsState } from '../types';

const initialState: ReviewsState = {
  currentPage: 1,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = reviewsSlice.actions;
export default reviewsSlice.reducer;
