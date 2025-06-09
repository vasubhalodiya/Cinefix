import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MovieSidebar from "../MovieSidebar/MovieSidebar";
import "./MovieDetails.css";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";

const MovieDetails = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [movieDetails, setMovieDetails] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isPremiumMovie, setIsPremiumMovie] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const type = location.pathname.includes("/series/") ? "tv" : "movie";

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!movieId) return;

      try {
        const [allSnap, comingSoonSnap] = await Promise.all([
          getDoc(doc(db, "PremiumMovieCollection", "AllPremiumMovies")),
          getDoc(doc(db, "PremiumMovieCollection", "comingSoonPremiumMovies")),
        ]);

        const allIds = allSnap.exists() ? allSnap.data().PremiumMovieIds || [] : [];
        const comingSoonIds = comingSoonSnap.exists() ? comingSoonSnap.data().PremiumMovieIds || [] : [];

        const combinedIds = [...new Set([...allIds, ...comingSoonIds])];
        const currentId = Number(movieId);
        const isPremium = combinedIds.includes(currentId);

        setIsPremiumMovie(isPremium);

        if (!user) {
          setSubscriptionStatus(false);
          setHasAccess(false);
        } else {
          const userSnap = await getDoc(doc(db, "users", user.uid));
          const isSubscribed = userSnap.exists() && userSnap.data().subscriptionStatus === "active";

          setSubscriptionStatus(isSubscribed);
          setHasAccess(isPremium && isSubscribed);
        }
      } catch (error) {
        console.error(error);
        setIsPremiumMovie(false);
        setSubscriptionStatus(false);
        setHasAccess(false);
      }

      setUserLoading(false);
    });

    return () => unsubscribe();
  }, [movieId]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const API_KEY = "0c9eb6c7265733aad8b14540ca4cdf5f";

        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${movieId}?api_key=${API_KEY}&append_to_response=videos`
        );
        const data = await res.json();
        setMovieDetails(data);

        if (data.videos?.results?.length) {
          setVideoKey(data.videos.results[0].key);
        }

        const companyId = data.production_companies?.[0]?.id;
        if (companyId) {
          const recRes = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_companies=${companyId}`
          );
          const recData = await recRes.json();
          const filtered = recData.results.filter((m) => m.id !== data.id);
          setRecommendations(filtered.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (movieId) fetchMovieDetails();
  }, [movieId, type]);

  const handleSubscribe = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }

    localStorage.setItem("redirectAfterPayment", location.pathname);
    navigate("/subscribe");
  };

  const handleAddToBackpack = async (movie) => {
    const user = getAuth().currentUser;
    if (!user) return toast.warn("Please login first");

    const userRef = doc(getFirestore(), "users", user.uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    if (!userSnap.exists() || data.subscriptionStatus !== "active") {
      return toast.warn("Subscribe to use backpack");
    }

    if ((data.backpack || []).some((m) => m.id === movie.id)) {
      return toast.warn("Already in backpack");
    }

    await updateDoc(userRef, {
      backpack: arrayUnion({
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.backdrop_path,
      })
    });

    toast.success("Added to backpack");
    window.dispatchEvent(new Event("backpackUpdated"));
  };

  if (!movieDetails) return <div>Loading...</div>;

  return (
    <div className="movie-details-container master-container">
      <div className="movie-main-details">
        <div className="movie-info">
          {videoKey && (
            <div className="trailer">
              {!showVideo ? (
                <div className="trailer-relative" style={{ position: "relative" }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movieDetails.backdrop_path}`}
                    alt={movieDetails.title || movieDetails.name}
                    className="movie-thumbnail"/>

                  {isPremiumMovie && !subscriptionStatus && !userLoading && (
                    <div className="blue-overlay">
                      <button className="subscribe-now-btn" onClick={handleSubscribe}>
                        Subscribe to Watch
                      </button>
                    </div>
                  )}

                  {((isPremiumMovie && subscriptionStatus) || !isPremiumMovie) && !userLoading && (
                    <div
                      className="movie-play-btn-detail"
                      onClick={() => setShowVideo(true)}
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        bottom: "15px",
                        right: "15px",
                        zIndex: 20,
                      }}
                    >
                      <div className="play-btn">
                        <div className="play-btn-circle">
                          <i className="fa-solid fa-play btn-play"></i>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          )}

          <div className="movie-details-section">
            <div className="movie-details-title-with-btn">
              <h1 className="movie-details-title">{movieDetails.title || movieDetails.name}</h1>
              <button className="add-to-backpack-btn" onClick={() => handleAddToBackpack(movieDetails)}>
                <i className="fa-regular fa-backpack"></i>
                <span>Add to Backpack</span>
              </button>
            </div>

            <p className="movie-details-genres">
              <i className="fa-light fa-film"></i>{" "}
              {movieDetails.genres ? movieDetails.genres.slice(0, 2).map((g) => g.name).join(" • ") : "N/A"}
            </p>

            <p className="movie-details-rating">
              <i className="fa-solid fa-star"></i>{" "}
              {movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : "N/A"}
            </p>

            <p className="movie-details-release-date">
              <i className="fa-light fa-calendar-days"></i>{" "}
              {movieDetails.release_date || movieDetails.first_air_date || "N/A"}
            </p>
          </div>

          <div className="movie-details-storyline-txt-section">
            <h5 className="top-rated-movie-title moviecard-title">Storyline</h5>
            <p className="movie-details-storyline">{movieDetails.overview || "No Storyline Available."}</p>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && <MovieSidebar recommendations={recommendations} />}
    </div>
  );
};

export default MovieDetails;
