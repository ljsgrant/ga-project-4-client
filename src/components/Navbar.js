import '../styles/Navbar.scss';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthenticated } from '../hooks/useAuthenticated';
import { AUTH } from '../lib/auth';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useAuthenticated();
  const navigate = useNavigate();

  const logout = () => {
    AUTH.deleteToken();
    console.log('logged out');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className='Navbar'>
      <div className='nav-left'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/birds'>Birds</Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          ) : (
            <>
              {' '}
              <li>
                <Link to='/login'>Log In</Link>
              </li>
              <li>
                <Link to='/register'>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
