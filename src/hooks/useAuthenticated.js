import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AUTH } from '../lib/auth';
import { API } from '../lib/api';

export const useAuthenticated = () => {
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsLoggedIn(AUTH.getPayload());
  }, [pathname]);

  useEffect(() => {
    setIsAdmin(false);
    if (isLoggedIn) {
      API.GET(API.ENDPOINTS.singleUser(AUTH.getPayload().sub))
        .then(({ data }) => {
          setIsAdmin(data.is_staff);
        })
        .catch((err) => console.error(err));
    }
  }, [isLoggedIn, pathname]);

  return [isLoggedIn, setIsLoggedIn, isAdmin];
};
