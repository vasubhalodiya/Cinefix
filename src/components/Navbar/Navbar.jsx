import React, { useEffect, useState } from 'react';
import './Navbar.css';
import images from '../../utils/Images';
import NavLink from '../NavLink/NavLink';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../Auth/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = ({ isTablet, onToggle, isOpen, closeSidebar, showSubscribe }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setIsSubscribed(userData.subscriptionStatus === "active");
          } else {
            setIsSubscribed(false);
          }
        } catch {
          setIsSubscribed(false);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubscribeClick = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
    } else {
      navigate("/subscribe");
    }

    if (isTablet && isOpen) {
      closeSidebar();
    }
  };

  const handleClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className={`navbar ${isTablet && isOpen ? "shifted" : ""}`}
      style={{ zIndex: isOpen ? -1 : 999999999999 }}
    >
      <div className="navbar-cnt">
        {isTablet && (
          <div className="navbar-mobile-header">
            <button className="navbar-toggle-btn" onClick={onToggle}>
              <i className="fa-light fa-sidebar"></i>
            </button>
            <Link to="/">
              <img src={images.logo} alt="cinefix-logo" className="navbar-mobile-logo" />
            </Link>
          </div>
        )}

        {!isTablet && (
          <div className="navbar-link-list">
            <ul className="navbar-links">
              <NavLink to="/movies" label="Movies" />
              <NavLink to="/series" label="Series" />
              <NavLink to="/tvshows" label="TV Shows" />
            </ul>
          </div>
        )}

        <div className="navbar-profile-section">
          {!isLoading && (
            <>
              {!isSubscribed && showSubscribe && (
                <div className="navbar-subscribe-btn">
                  <NavLink
                    to="/subscribe"
                    label="Subscribe"
                    className="button-link"
                    isSidebar={isTablet && isOpen}
                    onClick={handleSubscribeClick}
                  />
                </div>
              )}

              {isSubscribed && (
                <div className="navbar-premium-badge">
                  <i className="fa-solid fa-crown"></i><span>Premium</span>
                </div>
              )}
            </>
          )}

          <div onClick={handleClick} className="navbar-profile" style={{ cursor: "pointer" }}>
            <img src={images.avtar} alt="avatar" />
            <div className="profile-dropdown">
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
