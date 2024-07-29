import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../../images/LotiFiles/confirmation.json';


const Confirmation = () => {
  return (
    <div style={{ width: 160, height: 160 }}>
      <Lottie animationData={animationData} />
    </div>
  );
};

export default Confirmation;