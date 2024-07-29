import React, { useRef, useState, useEffect } from 'react';
import styles from '../../../css/components/VidCarousel.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeMute, faVolumeHigh, faVolumeDown, faVolumeUp, faForwardStep, faBackwardStep, faSpinner, faArrowRightLong, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import logo from '../../../images/zoe-clear.png';
import NoLogo from '../../../images/zoe-clear.png';
import LoaderAnimation from '../Lotie/LoaderAnimation';
import ButtonAnimation from '../Lotie/ButtonAnimation';

function MainVidCarousel({ adverts }) {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const currentAdvert = adverts ? adverts[currentVideoIndex] : null;

  useEffect(() => {
    if (currentAdvert) {
      setIsLoading(true);
      const videoElement = videoRef.current;
      const handleLoadedData = () => {
        setIsLoading(false);
        videoElement.play();
      };

      videoElement.addEventListener('loadeddata', handleLoadedData);
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [currentVideoIndex, currentAdvert]);

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleVolumeChange = (amount) => {
    let newVolume = videoRef.current.volume + amount;
    if (newVolume > 1) newVolume = 1;
    if (newVolume < 0) newVolume = 0;
    videoRef.current.volume = newVolume;
  };

  const handleNext = () => {
    setCurrentVideoIndex((currentVideoIndex + 1) % adverts.length);
  };

  const handlePrevious = () => {
    setCurrentVideoIndex((currentVideoIndex - 1 + adverts.length) % adverts.length);
  };

  const handleVideoEnd = () => {
    handleNext();
  };

  return (
    <div className={styles.videoPlayerContainer}>
      {adverts && adverts.length !== 0 ? (
        <>
          {isLoading && (
            <div className={styles.loadingIndicator}>
              < ButtonAnimation />
            </div>
          )}
          <div className={styles.companyLogo}>
            <img src={logo} alt="Maasai logo" />
          </div>
          <video
            ref={videoRef}
            src={currentAdvert && `/storage/${currentAdvert.video}`}
            className={styles.videoPlayer}
            autoPlay
            muted
            onEnded={handleVideoEnd}
          >
            Your browser does not support the video tag.
          </video>
          <div className={styles.controls}>
            <button onClick={handlePrevious}>
              <FontAwesomeIcon icon={faArrowLeftLong} />
              <small></small>
            </button>
            <button onClick={handleNext}>
              <FontAwesomeIcon icon={faArrowRightLong} />
              <small></small>
            </button>
            {/* <button onClick={handlePlayPause}>< FontAwesomeIcon icon={faPlay} /> / <FontAwesomeIcon icon={faPause}/></button> */}
            <button onClick={handleMute}>{isMuted ? < FontAwesomeIcon icon={faVolumeHigh} /> : < FontAwesomeIcon icon={faVolumeMute} />}</button>
            {/* <button onClick={() => handleVolumeChange(-0.1)}>< FontAwesomeIcon icon={faVolumeDown} /> </button> */}
            <button onClick={() => handleVolumeChange(0.1)}>< FontAwesomeIcon icon={faVolumeUp} /></button>
          </div>
          <div className={styles.AdvertVidDetails}>
            <div className={styles.advertTitle}>{currentAdvert && currentAdvert.title}</div>
            {/* <div className={styles.advertContent}>{currentAdvert.content}</div> */}
          </div>
        </>
      ) : (
        <div className={styles.NoAdvertsContainer}>
          <div className={styles.NoAdvertsLogo}>
            <img src={NoLogo} alt="Zoe's Kids Baby Shop" />
          </div>
          <p>No Ads to display at the moment. Watchout for our latest promotions.</p>
        </div>
      )}
    </div>
  );
}

export default MainVidCarousel;