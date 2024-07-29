import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../../images/LotiFiles/loader.json';

const LoaderAnimation = () => {
  return (
    <div style={{ width: 100, height: 10, position: "absolute", marginTop: "60px" }}>
      <Lottie animationData={animationData} />
    </div>
  );
};

export default LoaderAnimation;