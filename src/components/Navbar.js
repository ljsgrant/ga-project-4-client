import '../styles/Navbar.scss';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthenticated } from '../hooks/useAuthenticated';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useAuthenticated();
  const navigate = useNavigate();

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
          <li>
            <Link to='/login'>Log In</Link>
          </li>
          <li>
            <Link to='/register'>Register</Link>
          </li>
          <li>
            <Link to='/login'>Log In</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
