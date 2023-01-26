import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMessage from './common/PageMessage.js';

export default function LogOutRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
    // eslint-disable-next-line
  }, []);

  return (
    <PageMessage
      title={'Thanks for using birdl!'}
      text={'Taking you back to the homepage...'}
    />
  );
}
