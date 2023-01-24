import '../../styles/PageMessage.scss';
import { Link } from 'react-router-dom';

export default function PageMessage({ title, text }) {
  return (
    <div className='PageMessage'>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link to='/birds'>
        <button>Back to Homepage</button>
      </Link>
    </div>
  );
}
