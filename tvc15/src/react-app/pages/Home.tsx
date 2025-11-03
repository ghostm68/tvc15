import { useState } from 'react';
import LoadingScreen from '@/react-app/components/LoadingScreen';
import MirrorViewer from '@/react-app/components/MirrorViewer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <MirrorViewer />
      )}
    </>
  );
}
