import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  movies: [],
};

const backpackSlice = createSlice({
  name: 'backpack',
  initialState,
  reducers: {
    addToBackpack: (state, action) => {
      const movieExists = state.movies.find(movie => movie.id === action.payload.id);
      if (!movieExists) {
        state.movies.push(action.payload);
        localStorage.setItem('backpack', JSON.stringify(state.movies));
      }
    },
    removeFromBackpack: (state, action) => {
      state.movies = state.movies.filter(movie => movie.id !== action.payload.id);
      localStorage.setItem('backpack', JSON.stringify(state.movies));
    },
    loadBackpack: (state) => {
      const savedMovies = JSON.parse(localStorage.getItem('backpack')) || [];
      state.movies = savedMovies;
    },
  },
});

export const { addToBackpack, removeFromBackpack, loadBackpack } = backpackSlice.actions;
export default backpackSlice.reducer;
