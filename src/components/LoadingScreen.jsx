import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading.json';
import '../styles/global.css';

const LoadingScreen = ({ isVisible }) => {
  if (!isVisible) return null;

  // Fix for potential ESM/CJS module object issues in Vite
  const LottieComponent = Lottie.default || Lottie;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <LottieComponent
          animationData={loadingAnimation}
          loop={true}
          autoplay={true}
          style={{ width: 320, height: 320 }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;