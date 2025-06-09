import React from 'react';
import Button from '../Button/Button';
import './SubscribeCard.css';

const SubscribeCard = ({ type, price, features, isActive, onSubscribe }) => {
  return (
    <div className={`subscribe-card ${isActive ? 'active' : ''}`}>
      <div className="subscribe-card-cnt">
        <div className={`subscribe-card-type ${isActive ? 'active' : ''}`}>
          <p className="subscribe-card-type-mode">{type}</p>
          <p className="subscribe-card-type-price">
            ₹{price}<span>{type === 'Yearly Subscription' ? '/Year' : '/Month'}</span>
          </p>
        </div>
        <div className="subscribe-card-offer-lists">
          <ul className="subscribe-card-offer-list">
            {features.map((feature, index) => (
              <li
                key={index}
                className={`subscribe-card-offer ${!feature.available ? 'disabled' : ''}`}
              >
                <div className={`subscribe-card-offer-icon ${isActive ? 'active' : ''}`}>
                  <i className="fa-solid fa-check"></i>
                </div>
                <h6 className="subscribe-card-offer-txt">{feature.text}</h6>
              </li>
            ))}
          </ul>
        </div>
        <div className="subscribe-card-buy">
          <Button
            variant={isActive ? 'filled' : 'outline'}
            onClick={() => onSubscribe()}>
            {isActive ? 'Buy Now' : 'Get Started'}
          </Button>

        </div>
      </div>
    </div>
  );
};

export default SubscribeCard;
