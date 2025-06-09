import React from 'react';
import { useNavigate } from 'react-router-dom';


const SubscribeNotify = () => {
      const navigate = useNavigate();
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Subscription Required</h1>
      <p>You need to subscribe to access this content.</p>
      <button
        onClick={() => navigate('/subscribe')}
        style={{ fontSize: '16px', cursor: 'pointer', color: 'red'}}>
        Go to Subscribe Page
      </button>
    </div>
  );
};

export default SubscribeNotify;
