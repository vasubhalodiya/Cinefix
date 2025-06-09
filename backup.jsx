import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!movieId) {
      console.error("movieId is undefined!");
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        const API_KEY = "0c9eb6c7265733aad8b14540ca4cdf5f";

        // Step 1: Fetch Movie Details with Videos
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`
        );
        const data = await res.json();
        setMovieDetails(data);

        if (data.videos && data.videos.results.length > 0) {
          setVideoKey(data.videos.results[0].key);
        }

        // Step 2: Get First Production Company ID (if available)
        const companyId = data.production_companies?.[0]?.id;

        if (companyId) {
          // Step 3: Fetch movies by that company
          const recRes = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_companies=${companyId}`
          );
          const recData = await recRes.json();

          // Step 4: Filter out current movie from recommendations
          const filtered = recData.results.filter(
            (movie) => movie.id !== data.id
          );

          setRecommendations(filtered.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Movie Detail */}
      <div style={{ flex: 2 }}>
        <h1>{movieDetails.title}</h1>
        <p>{movieDetails.overview}</p>

        {videoKey && (
          <div>
            <h3>Trailer</h3>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${videoKey}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div style={{ flex: 1 }}>
        <h2>Recommandation</h2>
        {recommendations.map((rec) => (
          <div key={rec.id} style={{ marginBottom: "1rem" }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${rec.backdrop_path}`}
              alt={rec.title}
              style={{ width: "100px", height: "auto", borderRadius: "8px" }}
            />
            <p>{rec.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
