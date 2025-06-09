import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// createApi → function chhe je API slice banava mate use thay
// fetchBaseQuery → simple HTTP requests (GET,POST,..) karva mate use thay

const apiKey = '0c9eb6c7265733aad8b14540ca4cdf5f';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.themoviedb.org/3/',
  }),
  endpoints: (builder) => ({
    getTopRatedMovies: builder.query({
      query: () =>
        `discover/movie?api_key=${apiKey}&with_companies=2&sort_by=vote_average.desc&vote_count.gte=100&page=1&language=en-US`,
    }),
    getComingSoonMovies: builder.query({
      query: () =>
        `discover/movie?api_key=${apiKey}&with_companies=420&sort_by=release_date.asc&primary_release_date.gte=2025-05-13`,
    }),
    getPopularMovies: builder.query({
      query: () => `discover/movie?api_key=${apiKey}&with_companies=25`,
    }),
    getMovies: builder.query({
      query: () =>
        `discover/movie?api_key=${apiKey}&with_companies=420&language=en-US&release_date.gte=2013-01-01&release_date.lte=2025-12-31&page=1`,
    }),
    getSeries: builder.query({
      query: () =>
        `discover/tv?api_key=${apiKey}&with_companies=420&language=en-US&page=1`,
    }),
    getTvShows: builder.query({
      query: () =>
        `discover/tv?api_key=${apiKey}&with_origin_country=IN&first_air_date.gte=2023-01-01&language=en-US`,
    }),

    getMergedSearchResults: builder.query({
      async queryFn(query) {
        const urls = [
          `discover/movie?api_key=${apiKey}&with_companies=2&sort_by=vote_average.desc&vote_count.gte=100&page=1&language=en-US&query=${query}`,
          `discover/movie?api_key=${apiKey}&with_genres=28,12,16&query=${query}`,
          `discover/tv?api_key=${apiKey}&with_companies=420&language=en-US&query=${query}`,
          `discover/tv?api_key=${apiKey}&with_origin_country=IN&first_air_date.gte=2023-01-01&language=en-US&query=${query}`,
          `discover/movie?api_key=${apiKey}&with_companies=420&sort_by=release_date.asc&primary_release_date.gte=2025-05-13&query=${query}`,
          `discover/movie?api_key=${apiKey}&with_companies=25&query=${query}`,
        ];

        try {
          const responses = await Promise.all(
            urls.map((url) =>
              fetch(`https://api.themoviedb.org/3/${url}`).then((res) => res.json())
            )
          );

          const results = responses.flatMap((res) => res.results || []);
          const filtered = results.filter((item) =>
            (item.title || item.name)?.toLowerCase().includes(query.toLowerCase())
          );

          return { data: filtered };
        } catch (error) {
          return { error: { message: 'Failed to fetch merged search results' } };
        }
      },
    }),
  }),
});

export const { useGetMoviesQuery, useGetTopRatedMoviesQuery, useGetSeriesQuery, useGetTvShowsQuery, useGetComingSoonMoviesQuery, useGetPopularMoviesQuery, useGetMergedSearchResultsQuery} = movieApi;
