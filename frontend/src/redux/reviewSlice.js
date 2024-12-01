import { createSlice } from '@reduxjs/toolkit';

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [], // Mặc định là mảng rỗng
    loading: false,
    error: null,
  },
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload || []; // Đảm bảo luôn là mảng
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setReviews, setLoading, setError } = reviewSlice.actions;
export default reviewSlice.reducer;
  