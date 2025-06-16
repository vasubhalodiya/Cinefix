import React, { useState } from 'react';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import images from '../utils/Images';
import { auth, db } from "./firebase";
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Timestamp, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // console.log("Authentication successful for:", user.email);

      // Firestore operations
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const today = new Date();
          await setDoc(userRef, {
            email: user.email,
            lastLogin: serverTimestamp(),
            subscriptionStatus: 'deactive',
            subscriptionExpiry: Timestamp.fromDate(today)
          }, { merge: true });
        } else {
          await setDoc(userRef, {
            lastLogin: serverTimestamp()
          }, { merge: true });
        }

        toast.success("Login successful!");
        navigate("/");

      } catch (firestoreError) {
        // Even if Firestore fails, authentication was successful
        toast.success("Login successful!");
        navigate("/");
      }

    } catch (error) {
      toast.error("Login failed. Please check credentials or network.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="auth-loading">
          <div className="film-loader">
            <div className="reel left-reel"></div>
            <div className="strip"></div>
            <div className="reel right-reel"></div>
          </div>
          <h3>🍿 Popcorn Ready ? We're Loading...</h3>
        </div>
      ) : (
        <div className="auth">
          <div className="auth-content">
            <div className="auth-heading">
              <Link to="/">
                <img src={images.logo} alt="cinefix-logo" className='logo' />
              </Link>
            </div>
            <div className="auth-form">
              <h2 className='auth-title'>Login</h2>
              <form onSubmit={handleLogin}>
                <div className="auth-input-field">
                  <h6 className='auth-input-title'>Email Address</h6>
                  <input
                    type="email"
                    placeholder="Email"
                    className='auth-input'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-input-field">
                  <h6 className='auth-input-title'>Password</h6>
                  <input
                    type="password"
                    placeholder="Password"
                    className='auth-input'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  className='auth-btn'
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <p className='auth-already-account'>
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;