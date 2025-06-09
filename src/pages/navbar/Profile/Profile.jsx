import React from 'react';
import './Profile.css';
import { useAuth } from '../../../Auth/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../../Auth/firebase';
import { useNavigate } from 'react-router-dom';
import NavLink from '../../../components/NavLink/NavLink';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsSubscribed(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error: ", error.message);
    }
  };

  return (
    <>
      <div className="profile">
        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-sidebar-head">
              <h1 className='profile-sidebar-head-txt section-heading'>Profile Settings</h1>
            </div>
            <div className="profile-list">
              <div className="profile-list-group">
                <div className="profile-title">
                  <h6 className='profile-mini-title'>Personal Info</h6>
                </div>
                <div className="profile-link-list">
                  <ul className="profile-links">
                    <NavLink to="/profile" iconClass="fa-regular fa-user" label="Your Profile" isSidebar={true} />
                  </ul>
                </div>
              </div>
              <div className="profile-list-group">
                <div className="profile-title">
                  <h6 className='profile-mini-title'>General</h6>
                </div>
                <div className="profile-link-list">
                  <ul className="profile-links">
                    <button onClick={handleLogout} className="logout-button"><i class="fa-solid fa-left-from-bracket"></i>Logout</button>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-main-container">
            <div className="profile-edit-profile-section">
              <div className='profile-welcome-title'>Welcome to Cinefix</div>
              <div className='profile-name'>Email : <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
