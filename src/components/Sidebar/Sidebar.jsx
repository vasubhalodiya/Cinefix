import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import images from '@/utils/Images';
import NavLink from '../NavLink/NavLink';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../Auth/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1240);

  // Local state for subscription (instead of redux)
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const tablet = window.innerWidth < 1240;
      setIsTablet(tablet);
      if (!tablet) setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Firebase check subscriptionStatus on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            // Check if subscriptionStatus is active
            if (userData.subscriptionStatus === 'active') {
              setIsSubscribed(true);
            } else {
              setIsSubscribed(false);
            }
          } else {
            setIsSubscribed(false);
          }
        } catch (error) {
          console.error('Error fetching user subscription status:', error);
          setIsSubscribed(false);
        }
      } else {
        // No user logged in, subscription off
        setIsSubscribed(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className={`sidebar ${isTablet && isOpen ? 'open' : ''}`}>
        <div className="sidebar-cnt">
          <div className="sidebar-logo">
            <Link to="/">
              <img src={images.logo} alt="cinefix-logo" className='logo' />
            </Link>
            {isTablet && isOpen && (
              <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close Sidebar">
                <i className="fa-light fa-sidebar"></i>
              </button>
            )}
          </div>

          <div className="sidebar-list">
            <div className="sidebar-list-group">
              <div className="sidebar-title"><h6>Menu</h6></div>
              <div className="sidebar-link-list">
                <ul className="sidebar-links">
                  <NavLink to="/" iconClass="fa-regular fa-compass" label="Discovery" isSidebar={true} onClick={closeSidebar} />
                  <NavLink to="/search" iconClass="fa-regular fa-magnifying-glass" label="Search" isSidebar={true} onClick={closeSidebar} />
                  <NavLink to="/toprated" iconClass="fa-regular fa-star" label="Top Rated" isSidebar={true} onClick={closeSidebar} />
                  <NavLink to="/premium" iconClass="fa-regular fa-crown" label="Premium" isSidebar={true} onClick={closeSidebar} />
                </ul>
              </div>
            </div>

            {isTablet && isOpen && (
              <div className="sidebar-top-menu">
                <div className="sidebar-list-group">
                  <div className="sidebar-title"><h6>Streaming</h6></div>
                  <div className="sidebar-link-list">
                    <ul className="sidebar-links">
                      <NavLink to="/movies" iconClass="fa-regular fa-clapperboard-play" label="Movies" isSidebar={true} onClick={closeSidebar} />
                      <NavLink to="/series" iconClass="fa-regular fa-popcorn" label="Series" isSidebar={true} onClick={closeSidebar} />
                      <NavLink to="/tvshows" iconClass="fa-regular fa-tv" label="Tv Shows" isSidebar={true} onClick={closeSidebar} />
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="sidebar-list-group">
              <div className="sidebar-title"><h6>Library</h6></div>
              <div className="sidebar-link-list">
                <ul className="sidebar-links">
                  <NavLink to="/mybackpack" iconClass="fa-light fa-backpack" label="My Backpack" isSidebar={true} onClick={closeSidebar} />
                </ul>
              </div>
            </div>

            {isTablet && isOpen && (
              <div className={`sidebar-list-group sidebar-subscribe ${isSubscribed ? 'd-none' : ''}`}>
                <div className="sidebar-title"><h6>Subscribe</h6></div>
                <div className="sidebar-link-list">
                  <ul className="sidebar-links subscribe-link">
                    <NavLink to="/subscribe" iconClass="fa-regular fa-badge-dollar" label="Subscribe" isSidebar={true} onClick={closeSidebar} />
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Navbar
        isTablet={isTablet}
        onToggle={toggleSidebar}
        isOpen={isOpen}
        closeSidebar={closeSidebar}
        showSubscribe={!isSubscribed}
      />

      {isTablet && isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          role="button"
          tabIndex={0}
          aria-label="Close Sidebar"
          onKeyDown={(e) => { if (e.key === 'Escape') closeSidebar(); }}
        />
      )}
    </>
  );
};

export default Sidebar;
