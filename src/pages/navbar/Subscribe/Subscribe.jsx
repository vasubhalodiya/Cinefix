import React, { useEffect, useState } from 'react';
import './Subscribe.css';
import { Link } from 'react-router-dom';
import images from '../../../utils/Images';
import SubscribeCard from '@/components/SubscribeCard/SubscribeCard';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from "../../../Auth/firebase";
import { toast } from 'react-toastify';


const BASE_URL = "https://cinefix.onrender.com";

const Subscribe = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('reset-css');
    return () => {
      document.body.classList.remove('reset-css');
    };
  }, []);

  const handlePayment = async (amount) => {
    try {

      setIsLoading(true);

      // const res = await fetch("http://localhost:5000/create-order", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ amount }),
      // });
      const res = await fetch(`${BASE_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create order");

      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("Please login first");
        return;
      }

      const options = {
        key: "rzp_test_f72l5fnGjUGpvZ",
        amount: data.amount,
        currency: "INR",
        name: "Cinefix",
        description: "Subscription Payment",
        order_id: data.id,
        handler: async function (response) {
          console.log("Payment successful!", response);

          let expiryDate = new Date();
          if (amount === 189) {
            expiryDate.setDate(expiryDate.getDate() + 1);
          } else if (amount === 2189) {
            expiryDate.setDate(expiryDate.getDate() + 3);
          }
          const expiryTimestamp = Timestamp.fromDate(expiryDate);  //fromDate firestore compatible timestamp ma convert kare chhe

          await updateDoc(doc(db, "users", currentUser.uid), {
            subscriptionStatus: "active",
            subscriptionExpiry: expiryTimestamp,
            lastSubscriptionUpdate: serverTimestamp(),
          });

          const redirectPath = localStorage.getItem("redirectAfterPayment");

          if (redirectPath) {
            localStorage.removeItem("redirectAfterPayment");
            navigate(redirectPath);
          } else {
            navigate("/premium");
          }
        },

        prefill: {
          name: currentUser.displayName || "User",
          email: currentUser.email || "",
          contact: "1234567890",
        },
        theme: { color: "#e43a3a" },
      };

      toast.dismiss("razorpay-load");
      setIsLoading(false);

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error("Error in payment flow:", error);
      toast.dismiss("razorpay-load");
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  const plans = [
    {
      type: 'Free Trial',
      price: '0',
      isActive: false,
      isMostPopular: false,
      amountInINR: 0,
      features: [
        { text: 'Streaming in high quality', available: true },
        { text: 'With the best audio quality', available: true },
        { text: 'Stream on multiple devices', available: false },
        { text: 'Ad-free viewing experience', available: false },
        { text: 'Download to watch later', available: false },
      ],
    },
    {
      type: 'Monthly Subscription',
      price: '189',
      isActive: true,
      isMostPopular: true,
      amountInINR: 189,
      features: [
        { text: 'Streaming in high quality', available: true },
        { text: 'With the best audio quality', available: true },
        { text: 'Stream on multiple devices', available: true },
        { text: 'Ad-free viewing experience', available: true },
        { text: 'Download to watch later', available: true },
      ],
    },
    {
      type: 'Yearly Subscription',
      price: '2189',
      isActive: false,
      isMostPopular: false,
      amountInINR: 2189,
      features: [
        { text: 'Streaming in high quality', available: true },
        { text: 'With the best audio quality', available: true },
        { text: 'Stream on multiple devices', available: true },
        { text: 'Ad-free viewing experience', available: true },
        { text: 'Download to watch later', available: true },
      ],
    },
  ];

  return (
    <>
      {isLoading && (
        <div className="payment-loader">
          <div className="loader"></div>
          <h2 className='loader-txt'>Your payment is getting ready...</h2>
        </div>
      )}
      <div className="subscribe reset-css">
        <div className="subscribe-container">
          <div className="subscribe-heading">
            <Link to="/">
              <img src={images.logo} alt="cinefix-logo" className='logo' />
            </Link>
          </div>
          <div className="subscribe-card-head">
            <p className='subscribe-access-premium'>Access Premium</p>
            <h2 className='subscribe-big-txt'>It's easy to get started</h2>
            <h2 className='subscribe-small-txt'>Choose the best plan to enjoy the best movies and series</h2>
          </div>
          <div className="subscribe-section">
            {plans.map((plan, index) => (
              <SubscribeCard
                key={index}
                type={plan.type}
                price={plan.price}
                features={plan.features}
                isActive={plan.isActive}
                isMostPopular={plan.isMostPopular}
                onSubscribe={() => handlePayment(plan.amountInINR)} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscribe;