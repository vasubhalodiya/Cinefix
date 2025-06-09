import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSubscription } from '../../../utils/checkSubscription';
import './PremiumPage.css';
import confetti from 'canvas-confetti/dist/confetti.module.mjs';

const PremiumPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndCelebrate = async () => {
      const isSubscribed = await checkSubscription();

      if (!isSubscribed) {
        navigate('/subscribe');
        return;
      }

      const hasCelebrated = sessionStorage.getItem('hasCelebrated');
      if (!hasCelebrated) {
        const duration = 2000;
        const animationEnd = Date.now() + duration;

        const fireCannons = () => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 1 },
            colors: ['#FF4C60', '#4CD7FF', '#FFD93D', '#4CFF81'],
            shapes: ['square'],
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 1 },
            colors: ['#FF4C60', '#4CD7FF', '#FFD93D', '#4CFF81'],
            shapes: ['square'],
          });
        };

        const fireFirecracker = () => {
          confetti({
            particleCount: 100,
            spread: 360,
            startVelocity: 50,
            origin: { y: 0 },
            colors: ['#FF4C60', '#4CD7FF', '#FFD93D', '#4CFF81'],
            shapes: ['square'],
          });
        };

        fireCannons();
        fireFirecracker();

        const timeout = setTimeout(() => {
          if (Date.now() < animationEnd) {
            fireCannons();
          }
        }, 1000);

        sessionStorage.setItem('hasCelebrated', 'true');
        return () => clearTimeout(timeout);
      }
    };

    checkAndCelebrate();
  }, [navigate]);

  return (
    <div className="premium">
      <div className="premium-content">
        <i className="fa-solid fa-crown fa-bounce premium-icon"></i>
        <h1 className="premium-txt-title">Welcome to Premium 🎉</h1>
        <p className="premium-txt">
          Enjoy unlimited, ad-free streaming with exclusive movies, series, and more.
        </p>
      </div>
    </div>
  );
};

export default PremiumPage;
