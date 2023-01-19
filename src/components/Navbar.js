import '../styles/Navbar.scss'
import { Link } from 'react-router-dom'

export default function Navbar(){


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
        </ul>
      </div>
    </div>
  );
}