
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollPosition = () => {
  const location = useLocation();

  useEffect(() => {
    // Always scroll to top when navigating to a new page
    window.scrollTo(0, 0);
  }, [location.pathname]);
};

export default useScrollPosition;
