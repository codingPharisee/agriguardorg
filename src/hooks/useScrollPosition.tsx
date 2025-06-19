
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollPosition = () => {
  const location = useLocation();

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scrollPosition-${location.pathname}`);
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 100);
    }

    const handleScroll = () => {
      sessionStorage.setItem(`scrollPosition-${location.pathname}`, window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);
};

export default useScrollPosition;
