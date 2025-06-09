import axios from "axios";
import {
  fetchTopRatedStart,
  fetchTopRatedSuccess,
  fetchTopRatedFailure,
} from "./movieSlice";

const API_KEY = "0c9eb6c7265733aad8b14540ca4cdf5f";
const BASE_URL = "https://api.themoviedb.org/3";

export const getTopRatedMovies = () => async (dispatch) => {
  dispatch(fetchTopRatedStart());

  try {
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/discover/movie`,
      params: {
        api_key: API_KEY,
        with_companies: 2,
        sort_by: "vote_average.desc",
        vote_count_gte: 100,
        page: 1,
        language: "en-US",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch(fetchTopRatedSuccess(response.data.results));
  } catch (error) {
    dispatch(fetchTopRatedFailure(error.message));
  }
};
