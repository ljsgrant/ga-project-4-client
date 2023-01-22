import '../styles/BirdListCard.scss';
import { Link } from 'react-router-dom';

export default function BirdListCard({ bird }) {
  return (
    <div className='BirdListCard'>
      <Link className='Link' key={bird.id} to={`/birds/${bird.id}`}>
        <p>{bird.name}</p>
        <div className='sci-name-wrapper'>
          <p className='sci-name-text'>{bird.scientific_name}</p>
        </div>
      </Link>
    </div>
  );
}
