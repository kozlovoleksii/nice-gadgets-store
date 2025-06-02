import './App.scss';
import { HashRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/Routes';
import { useEffect } from 'react';

export const App = () => {
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch) {
      document.body.classList.add('no-hover');
    }
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};
