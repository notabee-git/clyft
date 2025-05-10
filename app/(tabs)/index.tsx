import { useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import RegisterScreen from '../../components/RegisterScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1-second delay

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  return isLoading ? <LoadingScreen /> : <RegisterScreen />;
}
