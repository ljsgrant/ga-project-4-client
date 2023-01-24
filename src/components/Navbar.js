import '../styles/Navbar.scss';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthenticated } from '../hooks/useAuthenticated';
import { AUTH } from '../lib/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn, isAdmin] = useAuthenticated();

  const logout = () => {
    AUTH.deleteToken();
    console.log('logged out');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <div className='Navbar'>
        <div className='nav-left'>
          <div className='site-title-wrapper'>
            <h1>birdl</h1>
          </div>
          <ul>
            <li>
              <Link className='nav-link' to='/'>
                Home
              </Link>
            </li>
            <li>
              <Link className='nav-link' to='/birds'>
                Birds
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link className='nav-link' to='/add-new-sighting'>
                  Post New Sighting
                </Link>
              </li>
            )}

            {isAdmin && (
              <li>
                <Link className='nav-link' to='/admin'>
                  {' '}
                  Admin Controls
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className='nav-right'>
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    className='nav-link'
                    to={`/user/${AUTH.getPayload().sub}`}
                  >
                    Your Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logout}>Log Out</button>
                </li>
              </>
            ) : (
              <>
                {' '}
                <li>
                  <Link className='nav-link' to='/login'>
                    Log In
                  </Link>
                </li>
                <li>
                  <Link className='nav-link' to='/register'>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
