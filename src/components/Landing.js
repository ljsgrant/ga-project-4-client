import '../styles/Landing.scss';
import { Link } from 'react-router-dom';
import { useAuthenticated } from '../hooks/useAuthenticated';
import { AUTH } from '../lib/auth';

export default function Landing() {
  const [isLoggedIn] = useAuthenticated();

  return (
    <div className='Landing'>
      <div className='background'>
        <div className='text-container'>
          {AUTH.getPayload() ? (
            <>
              <p>Hi there, {AUTH.getPayload().username}!</p>
              <p className='subheader'>Want to get started?</p>
              <p className='actions'>
                <Link className='Link'>Record a sighting</Link> or{' '}
                <Link className='Link'>Browse all birds</Link>
              </p>
            </>
          ) : (
            <>
              <p>Welcome to</p>
              <h1>birdl</h1>
              <p className='subheader'>
                Record bird sightings and see distribution
              </p>
              <p className='actions'>
                Don't have an account yet? <Link className='Link'>Sign Up</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
