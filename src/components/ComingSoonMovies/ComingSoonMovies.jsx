// import React, { useEffect, useState } from 'react';
// import './ComingSoonMovies.css';
// import CommonSlider from '../CommonSlider/CommonSlider';
// import { useGetComingSoonMoviesQuery } from '@/redux/movieApi';
// import { useNavigate } from 'react-router-dom';

// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { db } from '../../Auth/firebase'; // Firebase config ni path adjust karo

// const ComingSoonMovies = () => {
//   const { data, error, isLoading } = useGetComingSoonMoviesQuery();
//   const navigate = useNavigate();

//   const [premiumMovieIds, setPremiumMovieIds] = useState([]);
//   const [loadingPremiumIds, setLoadingPremiumIds] = useState(true);

//   const createOrUpdateComingSoonPremiumMovies = async (comingSoonMovies) => {
//     if (!comingSoonMovies?.length) return;

//     const docRef = doc(db, 'PremiumMovieCollection', 'comingSoonPremiumMovies');
//     const docSnap = await getDoc(docRef);

//     if (!docSnap.exists() || !docSnap.data()?.PremiumMovieIds?.length) {
//       const movieIdsToStore = comingSoonMovies.map((movie) => movie.id);

//       await setDoc(docRef, { PremiumMovieIds: movieIdsToStore });
//     }
//   };

//   const fetchPremiumIds = async () => {
//     try {
//       const docRef = doc(db, 'PremiumMovieCollection', 'comingSoonPremiumMovies');
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const ids = docSnap.data()?.PremiumMovieIds || [];
//         setPremiumMovieIds(ids.map(id => Number(id)));
//       } else {
//         setPremiumMovieIds([]);
//       }
//     } catch (err) {
//       console.error('Error fetching premium IDs:', err);
//       setPremiumMovieIds([]);
//     }
//     setLoadingPremiumIds(false);
//   };

//   useEffect(() => {
//     if (data?.results?.length) {
//       createOrUpdateComingSoonPremiumMovies(data.results).then(() => {
//         fetchPremiumIds();
//       });
//     }
//   }, [data]);

//   if (isLoading || loadingPremiumIds) return <p>Loading...</p>;
//   if (error) return <p>Error loading coming soon movies.</p>;

//   const comingSoonData = data?.results || [];

//   return (
//     <>
//       <CommonSlider
//         title="Coming Soon"
//         data={comingSoonData}
//         renderCard={(movie) => {
//           const isPremium = premiumMovieIds.includes(movie.id);
//           return (
//             <div
//               key={movie.id}
//               className="coming-soon-movie-poster"
//               onClick={() => navigate(`/movie/${movie.id}`)}
//             >
//               <img
//                 src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
//                 alt={movie.title}
//                 className="coming-soon-poster-img"
//               />

//               {isPremium && (
//                 <div className="coming-soon-premium-badge">
//                   <i className="fa-solid fa-crown"></i>
//                 </div>
//               )}

//               <div className="coming-soon-poster-txt">
//                 <div className="coming-soon-poster-txt-title">
//                   <h6 className="movie-type">Coming Soon</h6>
//                   <h1 className="movie-name">{movie.title}</h1>
//                   <h6 className="movie-episode">
//                     On {new Date(movie.release_date).toLocaleDateString()}
//                   </h6>
//                 </div>
//               </div>
//             </div>
//           );
//         }}
//       />
//     </>
//   );
// };

// export default ComingSoonMovies;



import React, { useEffect, useState } from 'react';
import './ComingSoonMovies.css';
import CommonSlider from '../CommonSlider/CommonSlider';
import { useGetComingSoonMoviesQuery } from '@/redux/movieApi';
import { useNavigate } from 'react-router-dom';
import DiscoverySkeleton from '../../pages/menu/Discovery/DiscoverySkeleton';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../Auth/firebase';

const ComingSoonMovies = () => {
  const { data, error, isLoading } = useGetComingSoonMoviesQuery();
  const navigate = useNavigate();

  const [premiumMovieIds, setPremiumMovieIds] = useState([]);
  const [loadingPremiumIds, setLoadingPremiumIds] = useState(true);

  const createOrUpdateComingSoonPremiumMovies = async (comingSoonMovies) => {
    if (!comingSoonMovies?.length) return;

    const docRef = doc(db, 'PremiumMovieCollection', 'comingSoonPremiumMovies');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || !docSnap.data()?.PremiumMovieIds?.length) {
      const movieIdsToStore = comingSoonMovies.map((movie) => movie.id);
      await setDoc(docRef, { PremiumMovieIds: movieIdsToStore });
    }
  };

  const fetchPremiumIds = async () => {
    try {
      const docRef = doc(db, 'PremiumMovieCollection', 'comingSoonPremiumMovies');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const ids = docSnap.data()?.PremiumMovieIds || [];
        setPremiumMovieIds(ids.map(id => Number(id)));
      } else {
        setPremiumMovieIds([]);
      }
    } catch (err) {
      console.error('Error fetching premium IDs:', err);
      setPremiumMovieIds([]);
    }
    setLoadingPremiumIds(false);
  };

  useEffect(() => {
    if (data?.results?.length) {
      createOrUpdateComingSoonPremiumMovies(data.results).then(() => {
        fetchPremiumIds();
      });
    }
  }, [data]);

  // ✅ Use DiscoverySkeleton instead of <p>Loading...</p>
  if (isLoading || loadingPremiumIds) return <DiscoverySkeleton />;
  if (error) return <p>Error loading coming soon movies.</p>;

  const comingSoonData = data?.results || [];

  return (
    <>
      <CommonSlider
        title="Coming Soon"
        data={comingSoonData}
        renderCard={(movie) => {
          const isPremium = premiumMovieIds.includes(movie.id);
          return (
            <div
              key={movie.id}
              className="coming-soon-movie-poster"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                alt={movie.title}
                className="coming-soon-poster-img"
              />
              {isPremium && (
                <div className="coming-soon-premium-badge">
                  <i className="fa-solid fa-crown"></i>
                </div>
              )}
              <div className="coming-soon-poster-txt">
                <div className="coming-soon-poster-txt-title">
                  <h6 className="movie-type">Coming Soon</h6>
                  <h1 className="movie-name">{movie.title}</h1>
                  <h6 className="movie-episode">
                    On {new Date(movie.release_date).toLocaleDateString()}
                  </h6>
                </div>
              </div>
            </div>
          );
        }}
      />
    </>
  );
};

export default ComingSoonMovies;
