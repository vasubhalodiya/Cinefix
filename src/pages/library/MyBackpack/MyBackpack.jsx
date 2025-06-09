// import React, { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";
// import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "./MyBackpack.css";

// const MyBackpack = () => {
//   const [backpackMovies, setBackpackMovies] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const navigate = useNavigate();

//   const fetchBackpack = async () => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       setIsLoggedIn(false);
//       setBackpackMovies([]);
//       return;
//     }

//     setIsLoggedIn(true);

//     const db = getFirestore();
//     const userRef = doc(db, "users", user.uid);
//     const userSnap = await getDoc(userRef);

//     if (userSnap.exists()) {
//       const data = userSnap.data();
//       setIsSubscribed(data.subscriptionStatus === "active");
//       setBackpackMovies(data.backpack || []);
//     }
//   };

//   const handleRemoveFromBackpack = async (movie) => {
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (!user) return;

//       const db = getFirestore();
//       const userRef = doc(db, "users", user.uid);

//       await updateDoc(userRef, {
//         backpack: arrayRemove(movie),
//       });

//       toast.success("Removed from backpack");
//       fetchBackpack(); // refresh after delete
//     } catch (error) {
//       console.error("Error removing movie:", error);
//       toast.error("Failed to remove movie");
//     }
//   };

//   useEffect(() => {
//     fetchBackpack();
//     window.addEventListener("backpackUpdated", fetchBackpack);
//     return () => window.removeEventListener("backpackUpdated", fetchBackpack);
//   }, []);

//   return (
//     <div className="my-backpack-container">
//       <h1 className="section-heading">My Backpack</h1>

//       <div className={`backpack-content-wrapper ${!isLoggedIn || !isSubscribed ? "blurred" : ""}`}>
//         {backpackMovies.length > 0 ? (
//           <div className="backpack-movies-section">
//             {backpackMovies.map((movie) => (
//               <div key={movie.id} className="backpack-movie-card">
//                 <div
//                   className="backpack-movie-card-dtl"
//                   onClick={() => isSubscribed && navigate(`/movie/${movie.id}`)}>
//                   <img
//                     src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
//                     alt={movie.title}
//                     className="backpack-movie-card-img"
//                   />
//                   <p className="backpack-movie-title moviecard-title">{movie.title}</p>
//                 </div>
//                 <button
//                   onClick={() => isSubscribed && handleRemoveFromBackpack(movie)}
//                   className="backpack-remove-btn"
//                   disabled={!isSubscribed}>
//                   <i className="fa-regular fa-trash-can"></i> Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No movies in backpack.</p>
//         )}
//       </div>

//       {!isLoggedIn && (
//         <div className="backpack-overlay-message">Please login to view your backpack</div>
//       )}
//       {isLoggedIn && !isSubscribed && (
//         <div className="backpack-overlay-message">Subscribe to access your backpack</div>
//       )}
//     </div>
//   );
// };

// export default MyBackpack;





import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./MyBackpack.css";

const MyBackpack = () => {
  const [backpackMovies, setBackpackMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBackpack = async () => {
    setIsLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setIsLoggedIn(false);
      setBackpackMovies([]);
      setIsLoading(false);
      return;
    }

    setIsLoggedIn(true);

    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      setIsSubscribed(data.subscriptionStatus === "active");
      setBackpackMovies(data.backpack || []);
    }

    setIsLoading(false);
  };

  const handleRemoveFromBackpack = async (movie) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        backpack: arrayRemove(movie),
      });

      toast.success("Removed from backpack");
      fetchBackpack();
    } catch (error) {
      console.error("Error removing movie:", error);
      toast.error("Failed to remove movie");
    }
  };

  useEffect(() => {
    fetchBackpack();
    window.addEventListener("backpackUpdated", fetchBackpack);
    return () =>
      window.removeEventListener("backpackUpdated", fetchBackpack);
  }, []);

if (isLoading) {
  return (
    <div className="my-backpack-container">
      <h1 className="section-heading">My Backpack</h1>
      <div className="backpack-loader-wrapper">
        <div className="loader"></div>
        <p className="loader-text">Data Fetching...</p>
      </div>
    </div>
  );
}


  return (
    <div className="my-backpack-container">
      <h1 className="section-heading">My Backpack</h1>

      <div
        className={`backpack-content-wrapper ${
          !isLoggedIn || !isSubscribed ? "blurred" : ""
        }`}
      >
        {backpackMovies.length > 0 ? (
          <div className="backpack-movies-section">
            {backpackMovies.map((movie) => (
              <div key={movie.id} className="backpack-movie-card">
                <div
                  className="backpack-movie-card-dtl"
                  onClick={() =>
                    isSubscribed && navigate(`/movie/${movie.id}`)
                  }
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="backpack-movie-card-img"
                  />
                  <p className="backpack-movie-title moviecard-title">
                    {movie.title}
                  </p>
                </div>
                <button
                  onClick={() =>
                    isSubscribed && handleRemoveFromBackpack(movie)
                  }
                  className="backpack-remove-btn"
                  disabled={!isSubscribed}
                >
                  <i className="fa-regular fa-trash-can"></i> Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No movies in backpack.</p>
        )}
      </div>

      {!isLoggedIn && (
        <div className="backpack-overlay-message">
          Please login to view your backpack
        </div>
      )}
      {isLoggedIn && !isSubscribed && (
        <div className="backpack-overlay-message">
          Subscribe to access your backpack
        </div>
      )}
    </div>
  );
};

export default MyBackpack;
