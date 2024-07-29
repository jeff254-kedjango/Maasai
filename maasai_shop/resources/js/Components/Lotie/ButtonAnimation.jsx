import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../../images/LotiFiles/loader.json';

const ButtonAnimation = () => {
  return (
    <div style={{ position:"absolute", width: 80, height: 50, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', zIndex:"900000" }}>
      <Lottie animationData={animationData} style={{ width: '50px', height: '50px' }} />
    </div>
  );
};

export default ButtonAnimation;