import React from 'react'
import { useEffect } from 'react'
import './Auth.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import images from '../utils/Images';
import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('reset-css');
    return () => {
      document.body.classList.remove('reset-css');
    };
  }, []);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Signup successful!");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("User already registered.");
      } else {
        toast.error("Signup failed. Please check credentials or network.");
      }
    }
  };
  return (
    <>
      <div className="auth">
        <div className="auth-content">
          <div className="auth-heading">
            <Link to="/">
              <img src={images.logo} alt="cinefix-logo" className='logo' />
            </Link>
          </div>
          <div className="auth-form">
            <h2 className='auth-title'>Create Account</h2>
            <div className="auth-input-field">
              <h6 className='auth-input-title'>Email Address</h6>
              <input type="text" placeholder="Email" className='auth-input' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="auth-input-field">
              <h6 className='auth-input-title'>Password</h6>
              <input type="password" placeholder="Password" className='auth-input' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className='auth-btn' onClick={handleSignup} onKeyDown={(e) => {if (e.key === "Enter") {handleLogin();}}}>Create Account</button>
            <p className='auth-already-account'>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
