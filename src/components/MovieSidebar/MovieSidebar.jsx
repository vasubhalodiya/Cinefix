
// import { useNavigate } from "react-router-dom";
// import MovieCard from "../MovieCard/MovieCard";

// const MovieSidebar = ({ recommendations }) => {
//   const navigate = useNavigate();

//   const handleCardClick = (movieId) => {
//     navigate(`/moviedetails/${movieId}`);
//   };

//   return (
//     <div className="movie-sidebar">
//       <div className="movie-sidebar-cnt">
//         <div className="movie-sidebar-cnt-head">
//           <h2 className="section-heading">Recommendation</h2>
//         </div>
//         <div className="movie-sidebar-cnt-cards-list recommendation-cards-list">
//           {recommendations.map((rec) => (
//             <MovieCard
//               key={rec.id}
//               poster={rec.backdrop_path || rec.poster_path}
//               title={rec.title}
//               rating={rec.vote_average}
//               onClick={() => handleCardClick(rec.id)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieSidebar;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../MovieCard/MovieCard";

import { getFirestore, doc, getDoc } from "firebase/firestore";

const MovieSidebar = ({ recommendations }) => {
  const navigate = useNavigate();
  const [premiumMovieIds, setPremiumMovieIds] = useState([]);

  useEffect(() => {
    const fetchPremiumIds = async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, "PremiumMovieCollection", "AllPremiumMovies");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const ids = docSnap.data().PremiumMovieIds || [];
          setPremiumMovieIds(ids.map(id => Number(id))); // ensure number type
        }
      } catch (error) {
        console.error("Error fetching premium movie IDs:", error);
      }
    };

    fetchPremiumIds();
  }, []);

  const handleCardClick = (movieId) => {
    navigate(`/moviedetails/${movieId}`);
  };

  return (
    <div className="movie-sidebar">
      <div className="movie-sidebar-cnt">
        <div className="movie-sidebar-cnt-head">
          <h2 className="section-heading">Recommendation</h2>
        </div>
        <div className="movie-sidebar-cnt-cards-list recommendation-cards-list">
          {recommendations.map((rec) => (
            <MovieCard
              key={rec.id}
              poster={rec.backdrop_path || rec.poster_path}
              title={rec.title}
              rating={rec.vote_average}
              onClick={() => handleCardClick(rec.id)}
              isPremium={premiumMovieIds.includes(rec.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieSidebar;
